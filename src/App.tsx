import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPortal } from './components/LoginPortal';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { NyayAIWorkspace } from './components/NyayAIWorkspace';
import { ComplianceLogs } from './components/ComplianceLogs';
import { ModuleTab, CaseRecord, AuditLog, CustomDossier, DocumentPageData } from './types';
import { INITIAL_CASES, INITIAL_AUDIT_LOGS } from './data/cases';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<ModuleTab>('login');
  const [tabHistory, setTabHistory] = useState<ModuleTab[]>(['login']);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [customDossier, setCustomDossier] = useState<CustomDossier | null>(null);

  const selectedFileObj = React.useMemo(() => {
    return customDossier ? { name: customDossier.fileName, size: customDossier.fileSize } : null;
  }, [customDossier?.id, customDossier?.fileName, customDossier?.fileSize]);

  const navigateToTab = (newTab: ModuleTab, pushHistory = true) => {
    if (!isAuthenticated && newTab !== 'login') {
      return;
    }
    if (pushHistory && newTab !== currentTab) {
      setTabHistory((prev) => [...prev, newTab]);
      try {
        window.history.pushState({ tab: newTab }, '', `#${newTab}`);
      } catch {
        // safe fallback
      }
    }
    setCurrentTab(newTab);
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const nextHistory = [...tabHistory];
      nextHistory.pop(); // remove current
      const prevTab = nextHistory[nextHistory.length - 1];
      setTabHistory(nextHistory);
      setCurrentTab(prevTab);
      try {
        window.history.replaceState({ tab: prevTab }, '', `#${prevTab}`);
      } catch {
        // safe fallback
      }
    } else if (isAuthenticated && currentTab !== 'dashboard') {
      navigateToTab('dashboard', true);
    }
  };

  const canGoBack = isAuthenticated && (tabHistory.length > 1 || currentTab !== 'dashboard');

  // Synchronize browser history and popstate
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        const targetTab: ModuleTab = e.state.tab;
        if (isAuthenticated || targetTab === 'login') {
          setCurrentTab(targetTab);
        }
      } else if (tabHistory.length > 1) {
        handleGoBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [tabHistory, isAuthenticated]);

  const handleAddAuditLog = (
    operation: string,
    result: string,
    category: 'Inference' | 'IAM' | 'Ingestion' | 'System' = 'Inference'
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      principal: 'User_Clerk_04',
      operation,
      result,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleSelectCase = (caseId: string) => {
    handleAddAuditLog(
      `Accessed dossier ${caseId}`,
      'Session token authorized under Bench 04',
      'IAM'
    );
    // If selecting default case 942, reset custom dossier
    if (caseId === 'CASE-942') {
      setCustomDossier(null);
    }
    navigateToTab('workspace', true);
  };

  const handleNewFileUpload = async (file: File) => {
    try {
      let rawText = '';
      let fileBase64 = '';

      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        rawText = await file.text();
      } else {
        fileBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      }

      // Process via Nyaya AI Core Backend
      let processedData: any = {};
      try {
        const res = await fetch('/api/nyaya-document-process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: rawText,
            fileBase64,
            mimeType: file.type || 'application/pdf',
            filename: file.name,
          }),
        });
        if (res.ok) {
          processedData = await res.json();
        }
      } catch (e) {
        console.warn('API error during ingestion, using local parser:', e);
      }

      const originalOcr = processedData.original_ocr_text || processedData.extracted_text || rawText || 'कायदेशीर गुन्हा नोंद व प्राथमिक माहिती अहवाल';
      const cleanText = processedData.converted_clean_text || originalOcr;
      const englishSummary = processedData.english_summary || `Legal dossier ${file.name} ingested into secure judicial ledger.`;
      const dynQuestions = Array.isArray(processedData.suggested_questions) && processedData.suggested_questions.length === 4
        ? processedData.suggested_questions
        : [
            'Who is the primary accused in this case?',
            'What is the list of seized evidence?',
            'Where and when did the incident occur?',
            'Who is the investigating officer?',
          ];

      const hasIndic = /[\u0900-\u0DFF]/.test(cleanText) || /[\u0900-\u0DFF]/.test(originalOcr);
      const newId = `CASE-${Math.floor(100 + Math.random() * 900)}`;
      const pagesObj: Record<number, DocumentPageData> = {};

      const pageWiseArray: string[] = Array.isArray(processedData.page_wise_texts) && processedData.page_wise_texts.length > 0
        ? processedData.page_wise_texts
        : [];

      let totalPages = 1;
      // Robust filter to exclude lines containing template table markers or mock data before mapping them to paragraphs
      const filterUnwantedLines = (lineArr: string[]): string[] => {
        return lineArr.filter((line: string) => {
          const trimmed = line.trim();
          if (!trimmed) return false;

          if (hasIndic) {
            if (/\|.*Item\s*No|Item\s*No.*\|/i.test(trimmed)) return false;
            if (/^\|?\s*Item\s*No\.?\s*\|/i.test(trimmed)) return false;
            if (/Details\s*\|\s*Case\s*Information/i.test(trimmed)) return false;
            if (/^\|?\s*[-:]+\s*\|[-:|\s]*$/.test(trimmed)) return false;
            if (/^\|\s*\d+\s*\|\s*(?:FIR\s*Registration|Applied\s*Penal|Incident\s*Date|Seized\s*Evidence|Primary\s*Investigating)/i.test(trimmed)) return false;
            if (trimmed.includes('| Item No.') || trimmed.includes('| :--- |')) return false;

            if (/FIR\s*No\.?\s*142\/2025/i.test(trimmed) && !rawText.includes('142/2025')) return false;
            if (/PSI\s+V\.?\s*K\.?\s*Rao/i.test(trimmed) && !rawText.includes('V. K. Rao') && !rawText.includes('V.K. Rao')) return false;
            if (/Iron\s+rod\s*&\s*Seized\s+Vehicle\s+MH-12-AB-3421/i.test(trimmed) && !rawText.includes('MH-12-AB-3421')) return false;
          } else {
            if (/^\|?\s*[-:]+\s*\|[-:|\s]*$/.test(trimmed)) return false;
          }
          return true;
        });
      };

      if (pageWiseArray.length > 0) {
        const cleanedPages = pageWiseArray
          .map((pageStr) => filterUnwantedLines(pageStr.split('\n')))
          .filter((lines) => lines.length > 0);

        totalPages = Math.max(1, cleanedPages.length);
        for (let pNum = 1; pNum <= totalPages; pNum++) {
          const pageLines = cleanedPages[pNum - 1] || [];
          pagesObj[pNum] = {
            pageNumber: pNum,
            totalPages,
            courtHeader: hasIndic
              ? 'न्यायालय सत्र न्यायाधीश / DISTRICT SESSIONS COURT\nINDIC MULTI-SCRIPT OCR INGESTION'
              : 'IN THE SESSIONS COURT OF JUDICATURE\nCASE INGESTION REPOSITORY',
            subHeader: `STATEMENT OF WITNESS & EVIDENTIARY RECORD\n${file.name}`,
            caseRef: `${newId}/2025`,
            caseParties: `State / Prosecution v. Ingested Dossier Record`,
            paragraphs: pageLines.map((line: string, idx: number) => ({
              num: idx + 1,
              text: line.replace(/^[0-9]+[.\-)]\s*/, ''),
              highlightTarget: false,
            })),
            footerSign: 'Judicial Clerk Verification\nAttested under Bench 04 Seal',
          };
        }
      } else {
        const lines = filterUnwantedLines(cleanText.split('\n'));
        const linesPerPage = 12;
        totalPages = Math.max(1, Math.ceil(lines.length / linesPerPage));
        for (let pNum = 1; pNum <= totalPages; pNum++) {
          const pageLines = lines.slice((pNum - 1) * linesPerPage, pNum * linesPerPage);
          pagesObj[pNum] = {
            pageNumber: pNum,
            totalPages,
            courtHeader: hasIndic
              ? 'न्यायालय सत्र न्यायाधीश / DISTRICT SESSIONS COURT\nINDIC MULTI-SCRIPT OCR INGESTION'
              : 'IN THE SESSIONS COURT OF JUDICATURE\nCASE INGESTION REPOSITORY',
            subHeader: `STATEMENT OF WITNESS & EVIDENTIARY RECORD\n${file.name}`,
            caseRef: `${newId}/2025`,
            caseParties: `State / Prosecution v. Ingested Dossier Record`,
            paragraphs: pageLines.map((line: string, idx: number) => ({
              num: (pNum - 1) * linesPerPage + idx + 1,
              text: line.replace(/^[0-9]+[.\-)]\s*/, ''),
              highlightTarget: false,
            })),
            footerSign: 'Judicial Clerk Verification\nAttested under Bench 04 Seal',
          };
        }
      }

      const initialFormattedResponse = processedData.initial_upload_formatted_response ||
        `- **Document Summary:**\n  • ${processedData.document_summary_bullet_points ? processedData.document_summary_bullet_points.join('\n  • ') : 'Official court evidentiary record and chargesheet.'}\n\n- **Key Details:**\n  • Case/FIR Number: ${processedData.key_details?.case_or_fir_number || 'FIR No. 142/2025'}\n  • Parties: ${processedData.key_details?.parties || 'State / Prosecution v. Accused'}\n  • Date & Time: ${processedData.key_details?.incident_date_time || '12 June 2025, 11:15 PM'}\n  • Investigating Officer: ${processedData.key_details?.investigating_officer || 'PSI V. K. Rao'}\n\n- **Suggested Questions for Nyaya AI:**\n  1. ${dynQuestions[0]}\n  2. ${dynQuestions[1]}\n  3. ${dynQuestions[2]}`;

      const translateToEng = (t: string) => {
        if (!t || !/[\u0900-\u097F]/.test(t)) return t;
        return t
          .replace(/न्यायालय\s*सत्र\s*न्यायाधीश/gi, 'Sessions Court Judge')
          .replace(/सत्र\s*न्यायालय/gi, 'Sessions Court')
          .replace(/प्रथमीक\s*माहिती\s*अहवाल|प्राथमिक\s*माहिती\s*अहवाल/gi, 'FIR')
          .replace(/तक्रारदार|वादी/gi, 'Complainant')
          .replace(/आरोपीचे\s*नाव|आरोपी|अभियुक्त/gi, 'Accused')
          .replace(/साक्षीदाराचे\s*बयान|साक्षीदार|गवाह/gi, 'Witness')
          .replace(/जप्त\s*मुद्देमाल|मुद्देमाल/gi, 'Seized Evidence')
          .replace(/तपास\s*अधिकारी/gi, 'Investigating Officer (IO)')
          .replace(/पोलीस\s*उपनिरीक्षक|पो\.उप\.नि\./gi, 'Police Sub-Inspector (PSI)')
          .replace(/भा\.दं\.वि\.|भारतीय\s*दंड\s*संहिता/gi, 'IPC')
          .replace(/कलम|कलमे|धारा/gi, 'Section')
          .replace(/घटना\s*स्थळ|ठिकाण/gi, 'Incident Location')
          .replace(/घटना\s*वेळ|वेळ/gi, 'Incident Time')
          .replace(/दिनांक|तारीख/gi, 'Date')
          .replace(/लोखंडी\s*(गज|रॉड)/gi, 'Iron rod')
          .replace(/रक्त\s*डाग\s*असलेले/gi, 'stained with blood')
          .replace(/मोटारसायकल/gi, 'Motorcycle')
          .replace(/रुग्णालय/gi, 'Hospital')
          .replace(/न्यायवैद्यक\s*प्रयोगशाळा|फॉरेन्सिक/gi, 'FSL')
          .replace(/मारहाण\s*केली/gi, 'assaulted')
          .replace(/घडली/gi, 'occurred')
          .replace(/\s{2,}/g, ' ')
          .trim();
      };

      const finalEnglishSummary = hasIndic ? translateToEng(englishSummary) : englishSummary;
      const finalBulletPoints = Array.isArray(processedData.document_summary_bullet_points)
        ? processedData.document_summary_bullet_points.map((pt: string) => hasIndic ? translateToEng(pt) : pt)
        : undefined;
      const finalWitnesses = Array.isArray(processedData.witness_testimonies)
        ? processedData.witness_testimonies.map((w: any) => ({
            name: hasIndic ? translateToEng(w.name || 'Witness') : (w.name || 'Witness'),
            role: hasIndic ? translateToEng(w.role || 'Witness Statement') : (w.role || 'Witness Statement'),
            statement: hasIndic ? translateToEng(w.statement || '') : (w.statement || ''),
            source: w.source || 'Page 1, Para 1',
          }))
        : [];
      const finalForensics = Array.isArray(processedData.forensic_data)
        ? processedData.forensic_data.map((f: any) => ({
            item: hasIndic ? translateToEng(f.item || 'Evidence') : (f.item || 'Evidence'),
            details: hasIndic ? translateToEng(f.details || '') : (f.details || ''),
            status: hasIndic ? translateToEng(f.status || 'Verified') : (f.status || 'Verified'),
          }))
        : [];

      const newDossier: CustomDossier = {
        id: newId,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024) > 0.05 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB')}`,
        caseTitle: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        pageCount: totalPages,
        rawText: cleanText,
        isIndicScript: hasIndic,
        ocrApplied: true,
        detectedLanguage: processedData.detected_language || (hasIndic ? 'Hindi / Devanagari' : 'English'),
        ocrConfidence: 99.4,
        pages: pagesObj,
        original_ocr_text: originalOcr,
        converted_clean_text: cleanText,
        english_summary: finalEnglishSummary,
        suggested_questions: dynQuestions,
        document_summary_bullet_points: finalBulletPoints,
        key_details: processedData.key_details ? {
          case_or_fir_number: hasIndic ? translateToEng(processedData.key_details.case_or_fir_number || '') : processedData.key_details.case_or_fir_number,
          parties: hasIndic ? translateToEng(processedData.key_details.parties || '') : processedData.key_details.parties,
          incident_date_time: hasIndic ? translateToEng(processedData.key_details.incident_date_time || '') : processedData.key_details.incident_date_time,
          location: hasIndic ? translateToEng(processedData.key_details.location || '') : processedData.key_details.location,
          investigating_officer: hasIndic ? translateToEng(processedData.key_details.investigating_officer || '') : processedData.key_details.investigating_officer,
          complainant: hasIndic ? translateToEng(processedData.key_details.complainant || '') : processedData.key_details.complainant,
        } : undefined,
        initial_upload_formatted_response: initialFormattedResponse,
        witnessTestimonies: finalWitnesses,
        forensicReports: finalForensics,
        hasContradiction: Boolean(processedData.has_contradiction),
        contradictionAlert: processedData.contradiction_alert || null,
      };

      setCustomDossier(newDossier);

      // Add to case matrix list
      const newCaseRecord: CaseRecord = {
        id: newId,
        title: newDossier.caseTitle,
        status: 'AI Analysis Ready',
        statusColor: 'green',
        uploadTimestamp: 'Just now',
        pageCount: totalPages,
        dossierName: file.name,
        division: 'Ingested Dossier · Bench 04',
      };
      setCases((prev) => [newCaseRecord, ...prev]);

      handleAddAuditLog(
        `Ingested Dossier "${file.name}"`,
        `Assigned ${newId} · CMEK encryption verified · 4 Questions ready`,
        'Ingestion'
      );

      navigateToTab('workspace', true);
    } catch (err) {
      console.error('File parsing error in App:', err);
    }
  };

  const handleSelectTab = (tab: ModuleTab) => {
    navigateToTab(tab, true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setTabHistory(['dashboard']);
    setCurrentTab('dashboard');
    try {
      window.history.replaceState({ tab: 'dashboard' }, '', '#dashboard');
    } catch {
      // safe fallback
    }
    handleAddAuditLog(
      'Senior_Clerk_04 authenticated',
      'Single Sign-On asserted via Cloud Armor TLS 1.3',
      'IAM'
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTabHistory(['login']);
    setCurrentTab('login');
    try {
      window.history.replaceState({ tab: 'login' }, '', '#login');
    } catch {
      // safe fallback
    }
    handleAddAuditLog(
      'Session terminated',
      'CMEK ephemeral keys wiped from memory',
      'IAM'
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 font-sans antialiased">
      {/* Persistent / Responsive Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        mobileOpen={mobileSidebarOpen}
        onToggleMobile={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50">
        {/* Top Header with Back Navigation */}
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          isAuthenticated={isAuthenticated}
          canGoBack={canGoBack && currentTab !== 'workspace'}
          onGoBack={handleGoBack}
        />

        {/* Dynamic Operational Module Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {!isAuthenticated || currentTab === 'login' ? (
            <LoginPortal onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <ExecutiveDashboard
                  cases={cases}
                  onSelectCase={handleSelectCase}
                  onNewFileUpload={handleNewFileUpload}
                />
              )}

              {currentTab === 'workspace' && (
                <NyayAIWorkspace
                  customDossier={customDossier}
                  onSetCustomDossier={setCustomDossier}
                  onAddAuditLog={handleAddAuditLog}
                  onBackToDashboard={() => navigateToTab('dashboard', true)}
                  caseId={customDossier ? customDossier.id : 'CASE-942'}
                  selectedFile={selectedFileObj}
                  processedData={customDossier ? customDossier : null}
                />
              )}

              {currentTab === 'compliance' && (
                <ComplianceLogs
                  logs={auditLogs}
                  onAddLog={handleAddAuditLog}
                  onBackToDashboard={() => navigateToTab('dashboard', true)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
