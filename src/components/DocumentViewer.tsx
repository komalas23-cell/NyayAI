import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Lock,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Scale,
  Eye,
} from 'lucide-react';
import { DOSSIER_PAGES } from '../data/cases';
import { DocumentPageData, CustomDossier } from '../types';

interface DocumentViewerProps {
  customDossier?: CustomDossier | null;
  activePage: number;
  highlightedPara?: {
    page: number;
    para: number;
    role?: 'prosecution' | 'defense' | 'neutral';
  } | null;
  onPageChange: (page: number) => void;
  onUploadFile: (file: File) => void;
  contradictionActive?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  customDossier,
  activePage,
  highlightedPara,
  onPageChange,
  onUploadFile,
  contradictionActive,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showContradictionHighlights, setShowContradictionHighlights] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active pages data source
  const pagesSource: Record<number, DocumentPageData> =
    customDossier && Object.keys(customDossier.pages).length > 0
      ? customDossier.pages
      : DOSSIER_PAGES;

  const availablePageNumbers = Object.keys(pagesSource)
    .map(Number)
    .sort((a, b) => a - b);

  const currentActivePage = availablePageNumbers.includes(activePage)
    ? activePage
    : (availablePageNumbers[0] || 1);

  const totalPagesCount =
    customDossier?.pageCount ||
    (availablePageNumbers.length > 0
      ? availablePageNumbers[availablePageNumbers.length - 1]
      : 78);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(150, Math.max(75, prev + delta)));
  };

  useEffect(() => {
    if (highlightedPara) {
      const el = document.getElementById(
        `doc-page-${highlightedPara.page}-para-${highlightedPara.para}`
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedPara, activePage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    const textData = Object.values(pagesSource)
      .map(
        (p) =>
          `=== PAGE ${p.pageNumber} OF ${p.totalPages} ===\n${p.courtHeader}\n${p.subHeader}\n${p.caseRef}\n${p.caseParties}\n\n` +
          p.paragraphs
            .map((pr) => {
              if (pr.originalScript && pr.englishTranslation) {
                return `${pr.num}. [ORIGINAL SCRIPT]:\n   ${pr.originalScript}\n   [CERTIFIED TRANSLATION]:\n   ${pr.englishTranslation}`;
              }
              const roleTag = pr.contradictionRole
                ? ` [${pr.contradictionRole.toUpperCase()} POINT]`
                : '';
              return `${pr.num}.${roleTag} ${pr.text}`;
            })
            .join('\n\n') +
          `\n\n${p.footerSign}\n\n`
      )
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = customDossier?.fileName
      ? `Verified_${customDossier.fileName.replace(/\.[^/.]+$/, '')}_Record.txt`
      : 'State_vs_Sharma_ChargeSheet_Excerpts.txt';
    a.click();
  };

  const renderCleanTextWithTables = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableLines: string[] = [];
    let keyIdx = 0;

    const flushTable = () => {
      if (tableLines.length > 0) {
        const rows = tableLines
          .filter((l) => !l.trim().match(/^\|?\s*[-:]+\s*\|[-:|\s]*$/))
          .map((l) =>
            l
              .split('|')
              .map((c) => c.trim())
              .filter((c, idx, arr) => (idx > 0 && idx < arr.length - 1) || arr.length <= 2)
          )
          .filter((r) => r.length > 0);

        if (rows.length > 0) {
          const headerRow = rows[0];
          const bodyRows = rows.slice(1);
          elements.push(
            <div key={`table-${keyIdx++}`} className="overflow-x-auto my-3 border border-slate-300 rounded-lg shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    {headerRow.map((cell, ci) => (
                      <th key={ci} className="px-3 py-2 text-left border-r last:border-r-0 border-slate-200 bg-slate-100">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-slate-900 font-medium">
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 border-r last:border-r-0 border-slate-200">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        tableLines = [];
      }
    };

    let pBuffer: string[] = [];
    const flushParagraph = () => {
      if (pBuffer.length > 0) {
        const content = pBuffer.join('\n').trim();
        if (content) {
          elements.push(
            <div key={`p-${keyIdx++}`} className="my-2 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          );
        }
        pBuffer = [];
      }
    };

    for (const line of lines) {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushParagraph();
        tableLines.push(line.trim());
      } else {
        flushTable();
        pBuffer.push(line);
      }
    }
    flushParagraph();
    flushTable();

    return elements;
  };

  const isIndicDetected = false;

  return (
    <div className="flex flex-col h-full bg-slate-200/70 border-r border-slate-300/80 overflow-hidden">
      {/* Hidden File Input for standard OS file picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.json"
        className="hidden"
        aria-label="Upload case dossier document"
      />

      {/* Top Document Toolbar - Responsive Flexbox Container */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs flex-shrink-0 w-full overflow-x-auto min-w-0">
        {/* Left: Document Identity & Metadata */}
        <div className="flex items-center space-x-2.5 min-w-0 py-0.5 shrink-0">
          <div className="w-8 h-8 rounded bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs select-none">
            {customDossier?.fileName?.endsWith('.txt') ? 'TXT' : 'PDF'}
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate flex items-center space-x-1.5 max-w-[180px] sm:max-w-xs md:max-w-md">
              <span className="truncate">
                {customDossier?.fileName || 'State_vs_Sharma_ChargeSheet.pdf'}
              </span>
              {customDossier?.ocrApplied && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shrink-0">
                  OCR Verified
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {totalPagesCount} pages · {customDossier?.fileSize || '18.4 MB'} · Read only evidence
            </div>
          </div>
        </div>

        {/* Right: Toolbar Action Controls & Navigation (Relative Flex Layout) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 py-0.5 ml-auto">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            title="Upload PDF or text case dossier from local device"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Upload</span>
          </button>

          {/* Page Jumper */}
          <div className="relative inline-flex items-center space-x-1 text-xs text-slate-600 bg-slate-100 rounded-lg p-1 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => {
                const currentIndex = availablePageNumbers.indexOf(currentActivePage);
                if (currentIndex > 0) {
                  onPageChange(availablePageNumbers[currentIndex - 1]);
                }
              }}
              disabled={availablePageNumbers.indexOf(currentActivePage) <= 0}
              className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer transition-colors shrink-0"
              title="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1 font-semibold text-[11px] whitespace-nowrap select-none">
              Pg {currentActivePage}/{totalPagesCount}
            </span>
            <button
              type="button"
              onClick={() => {
                const currentIndex = availablePageNumbers.indexOf(currentActivePage);
                if (currentIndex < availablePageNumbers.length - 1) {
                  onPageChange(availablePageNumbers[currentIndex + 1]);
                }
              }}
              disabled={
                availablePageNumbers.indexOf(currentActivePage) >=
                availablePageNumbers.length - 1
              }
              className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer transition-colors shrink-0"
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="relative inline-flex items-center space-x-1 bg-slate-100 rounded-lg p-1 border border-slate-200 text-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => handleZoom(-15)}
              className="p-1 hover:bg-white rounded transition-colors shrink-0"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 font-medium select-none whitespace-nowrap">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(15)}
              className="p-1 hover:bg-white rounded transition-colors shrink-0"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            className="relative inline-flex items-center p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shrink-0 cursor-pointer"
            title="Download verified document transcript"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DISTINCT CONTRADICTION HIGHLIGHTING LEGEND BAR */}
      <div className="bg-slate-100 border-b border-slate-200 py-1.5 px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] flex-shrink-0 w-full overflow-x-auto min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <Scale className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
              Contradiction Mapping:
            </span>
          </div>

          {/* Contradiction Mapping or Clean Verification Pill */}
          {customDossier ? (
            customDossier.hasContradiction ? (
              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-[10px] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  <span>Contradiction Flagged in Current Document</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[10px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>No contradictions found in this document</span>
                </span>
              </div>
            )
          ) : (
            <>
              {/* Prosecution Legend Pill (Blue) */}
              <button
                type="button"
                onClick={() => onPageChange(45)}
                className="relative inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 font-semibold cursor-pointer transition-colors shrink-0"
                title="Jump to Prosecution statement on Page 45"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="whitespace-nowrap">Prosecution (11:15 PM)</span>
              </button>

              {/* Defense Legend Pill (Amber) */}
              <button
                type="button"
                onClick={() => onPageChange(52)}
                className="relative inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-semibold cursor-pointer transition-colors shrink-0"
                title="Jump to Defense statement on Page 52"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                <span className="whitespace-nowrap">Defense (10:45 PM)</span>
              </button>
            </>
          )}

          {/* Mode Switcher */}
          {/* Removed Indic OCR mode switcher */}
        </div>

        {/* Toggle markers */}
        <button
          type="button"
          onClick={() => setShowContradictionHighlights(!showContradictionHighlights)}
          className="relative inline-flex items-center space-x-1 text-[10px] text-slate-600 hover:text-slate-900 font-medium cursor-pointer shrink-0 transition-colors"
        >
          <Eye className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="whitespace-nowrap">{showContradictionHighlights ? 'Highlights Visible' : 'Highlights Hidden'}</span>
        </button>
      </div>

      {/* Sub-banner: Chain of custody */}
      <div className="bg-slate-50 border-b border-slate-200/90 py-1 px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex-shrink-0 w-full overflow-x-auto min-w-0">
        <div className="flex items-center space-x-1.5 shrink-0">
          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">Original Evidence · SHA-256 Verified · Chain of Custody Intact</span>
        </div>
        {customDossier?.detectedLanguage && (
          <div className="flex items-center space-x-1 text-blue-600 shrink-0">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="whitespace-nowrap">{customDossier.detectedLanguage}</span>
          </div>
        )}
      </div>

      {/* Scrollable Document Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 select-text"
      >
        {availablePageNumbers.map((pageNo) => {
          const pageData = pagesSource[pageNo];
          if (!pageData) return null;

          return (
            <div
              key={pageNo}
              id={`doc-page-${pageNo}`}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
              className="w-full max-w-2xl mx-auto bg-white shadow-lg shadow-slate-300/60 border border-slate-300/80 rounded-xs p-6 sm:p-12 relative font-serif text-slate-900 transition-all duration-150"
            >
            {/* Page Number Stamp */}
            <div className="text-right text-[11px] font-mono font-medium text-slate-500 mb-6 uppercase tracking-wider">
              Page {pageData.pageNumber} of {pageData.totalPages}
            </div>

            {/* Court Header */}
            <div className="text-center space-y-1 mb-6">
              <div className="text-sm sm:text-base font-bold tracking-widest uppercase leading-snug whitespace-pre-line text-slate-950 font-serif">
                {pageData.courtHeader}
              </div>
              <div className="w-3/4 mx-auto border-b border-slate-900 my-4" />
              <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-900">
                {pageData.subHeader}
              </div>
            </div>

            {/* Case Details */}
            <div className="mb-6 text-xs sm:text-sm space-y-0.5 text-slate-900">
              <div className="font-bold">{pageData.caseRef}</div>
              <div className="italic text-slate-800">{pageData.caseParties}</div>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-900">
              {pageData.paragraphs.map((p) => {
                const isHighlighted =
                  highlightedPara &&
                  highlightedPara.page === pageData.pageNumber &&
                  highlightedPara.para === p.num;

                const isProsecution =
                  showContradictionHighlights && p.contradictionRole === 'prosecution';
                const isDefense =
                  showContradictionHighlights && p.contradictionRole === 'defense';

                return (
                  <div
                    key={p.num}
                    id={`doc-page-${pageData.pageNumber}-para-${p.num}`}
                    className={`transition-all rounded-xs p-2.5 -mx-2 ${
                      isProsecution
                        ? 'bg-blue-50/95 border-l-4 border-l-blue-600 ring-2 ring-blue-500/70 shadow-xs'
                        : isDefense
                        ? 'bg-amber-50/95 border-l-4 border-l-amber-600 ring-2 ring-amber-500/70 shadow-xs'
                        : isHighlighted
                        ? 'bg-amber-100 ring-2 ring-amber-400 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* PROSECUTION CONTRADICTION HEADER BADGE */}
                    {isProsecution && (
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100/95 px-2.5 py-1 rounded-sm mb-2 font-sans border border-blue-200">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                          <span>Prosecution Contradiction Marker • Source A (Witness Statement)</span>
                        </span>
                        <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded text-[9px]">
                          Asserted: 11:15 PM
                        </span>
                      </div>
                    )}

                    {/* DEFENSE CONTRADICTION HEADER BADGE */}
                    {isDefense && (
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-amber-100/95 px-2.5 py-1 rounded-sm mb-2 font-sans border border-amber-200">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                          <span>Defense Contradiction Marker • Source B (Witness Deposition)</span>
                        </span>
                        <span className="font-mono bg-amber-600 text-white px-2 py-0.5 rounded text-[9px]">
                          Asserted: 10:45 PM [Conflict]
                        </span>
                      </div>
                    )}

                    {/* Paragraph text */}
                    <div className="flex items-start">
                      <span
                        className={`font-bold mr-2 font-mono ${
                          isProsecution
                            ? 'text-blue-800'
                            : isDefense
                            ? 'text-amber-800'
                            : 'text-slate-950'
                        }`}
                      >
                        {p.num}.
                      </span>
                      <span
                        className={
                          isProsecution
                            ? 'text-blue-950 font-medium'
                            : isDefense
                            ? 'text-amber-950 font-medium'
                            : 'text-slate-900'
                        }
                      >
                        {p.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Sign */}
            <div className="mt-10 pt-6 border-t border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line font-serif italic text-left">
              {pageData.footerSign}
            </div>

            {/* Document Security Hologram / Seal */}
            <div className="absolute bottom-6 right-6 opacity-30 pointer-events-none text-right font-mono text-[9px] text-slate-400 uppercase tracking-widest border border-slate-400 p-1">
              SEAL OF SESSIONS
              <br />
              DIGITAL SECURE CLOUD
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
