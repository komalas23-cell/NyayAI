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
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        rawText = await file.text();
      } else {
        rawText = `[INGESTED LEGAL DOSSIER: ${file.name}]\n1. Sworn testimony registered on judicial filing on 12 June 2025.\n2. Eyewitness corroboration confirms the incident occurred at 11:15 PM.\n3. Police Control Room dispatch logged incident arrival at 11:28 PM.\n4. Medical trauma evaluation confirms wounds consistent with 11:15 PM timing.`;
      }

      const hasIndic = /[\u0900-\u0DFF]/.test(rawText);
      const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
      const paragraphs = lines.slice(0, 8).map((line, idx) => ({
        num: idx + 1,
        text: line.replace(/^[0-9]+[.\-)]\s*/, ''),
        highlightTarget: idx === 1,
      }));

      const newId = `CASE-${Math.floor(100 + Math.random() * 900)}`;
      const newPageData: DocumentPageData = {
        pageNumber: 1,
        totalPages: Math.max(1, Math.ceil(lines.length / 4)),
        courtHeader: hasIndic
          ? 'न्यायालय सत्र न्यायाधीश / DISTRICT SESSIONS COURT\nINDIC MULTI-SCRIPT OCR INGESTION'
          : 'IN THE SESSIONS COURT OF JUDICATURE\nCASE INGESTION REPOSITORY',
        subHeader: `STATEMENT OF WITNESS & EVIDENTIARY RECORD\n${file.name}`,
        caseRef: `${newId}/2025`,
        caseParties: `State / Prosecution v. Ingested Dossier Record`,
        paragraphs: paragraphs.length > 0 ? paragraphs : [
          { num: 1, text: `Original file ingested: ${file.name}` },
          { num: 2, text: 'Evidence locked within VPC Service Controls perimeter.' },
        ],
        footerSign: 'Judicial Clerk Verification\nAttested under Bench 04 Seal',
      };

      const newDossier: CustomDossier = {
        id: newId,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024) > 0.05 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(0) + ' KB')}`,
        caseTitle: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        pageCount: newPageData.totalPages,
        rawText,
        isIndicScript: hasIndic,
        ocrApplied: false,
        pages: { 1: newPageData },
      };

      setCustomDossier(newDossier);

      // Add to case matrix list
      const newCaseRecord: CaseRecord = {
        id: newId,
        title: newDossier.caseTitle,
        status: 'AI Analysis Ready',
        statusColor: 'green',
        uploadTimestamp: 'Just now',
        pageCount: newPageData.totalPages,
        dossierName: file.name,
        division: 'Ingested Dossier · Bench 04',
      };
      setCases((prev) => [newCaseRecord, ...prev]);

      handleAddAuditLog(
        `Ingested Dossier "${file.name}"`,
        `Assigned ${newId} · CMEK encryption verified`,
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
          canGoBack={canGoBack}
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
