import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Lock,
  Search,
  Download,
  ChevronRight,
  Languages,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { CaseRecord } from '../types';

interface ExecutiveDashboardProps {
  cases: CaseRecord[];
  onSelectCase: (caseId: string) => void;
  onNewFileUpload?: (file: File) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  cases,
  onSelectCase,
  onNewFileUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    progress: number;
    completed: boolean;
  }>({
    name: 'State_vs_Sharma_ChargeSheet.pdf',
    size: '18.4 MB',
    progress: 100,
    completed: true,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      setSelectedFile({
        name: file.name,
        size: sizeStr,
        progress: 100,
        completed: true,
      });

      setUploadNotice(`Uploading ${file.name} to VPC Service Controls perimeter...`);

      setTimeout(() => {
        setIsUploading(false);
        setUploadNotice(`✓ ${file.name} ingested successfully. Redirecting to NyayAI Workspace...`);
        if (onNewFileUpload) {
          onNewFileUpload(file);
        }
      }, 700);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };


  const getStatusBadge = (status: CaseRecord['status']) => {
    switch (status) {
      case 'AI Analysis Ready':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            AI Analysis Ready
          </span>
        );
      case 'Document Parsing':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Document Parsing
          </span>
        );
      case 'Human Review':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            Human Review
          </span>
        );
      case 'Indexed & Secured':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" />
            Indexed & Secured
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-[calc(100vh-65px)]">
      {/* Top Title & User Session Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
            Case Management Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Case Ingestion Dashboard
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Securely upload, process, and track judicial case records.
          </p>
        </div>

        {/* Clerk Profile Chip */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow">
            SC
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Logged in as
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              Senior Clerk, Bench 04
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone Card */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300/90 p-6 sm:p-10 relative overflow-hidden shadow-sm hover:border-blue-400 transition-colors">
        {/* Hidden input for real file picking */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.json"
          className="hidden"
          aria-label="Upload case dossier"
        />

        {/* Indic Multi-script OCR Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-800 text-xs font-medium mb-4 sm:mb-2">
          <Languages className="w-4 h-4 text-blue-600" />
          <span>
            <strong className="font-semibold">Indic Multi-script OCR Enabled</strong>{' '}
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              (Hindi, Marathi, Bengali, and additional regional languages)
            </span>
          </span>
        </div>

        {/* Central Drag-and-Drop Area */}
        <div
          onClick={handleTriggerUpload}
          className="cursor-pointer py-6 flex flex-col items-center justify-center text-center group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
            Upload Legal Dossier / Case PDF
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md">
            Drag and drop a case file here, or click to initialize secure ingestion.
          </p>

          {/* Currently Ingested File Pill */}
          <div className="mt-5 inline-flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 shadow-sm text-left">
            <FileText className="w-5 h-5 text-rose-500" />
            <div className="text-xs sm:text-sm font-semibold text-slate-800">
              {selectedFile.name}
            </div>
            <div className="text-xs text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
              {selectedFile.size}
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          {/* Upload Status Notice */}
          {uploadNotice && (
            <div className="mt-3 text-xs text-blue-600 font-medium animate-pulse">
              {uploadNotice}
            </div>
          )}

          {/* VPC Boundary Security note */}
          <div className="mt-5 flex items-center space-x-1.5 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Files remain within the VPC Service Controls perimeter</span>
          </div>
        </div>
      </div>

      {/* Protected Case Registry Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
              Protected Case Registry
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Active Case Matrix
            </h3>
          </div>

          {/* Search & Export Actions */}
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search records"
                className="pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors w-44 sm:w-60"
              />
            </div>

            <button
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify(cases, null, 2)],
                  { type: 'application/json' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Active_Case_Matrix_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export ledger</span>
            </button>
          </div>
        </div>

        {/* Case Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  <th className="py-3 px-4 sm:px-6">Case ID</th>
                  <th className="py-3 px-4 sm:px-6">Case Title</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6">Upload Timestamp</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Case ID */}
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-blue-600">
                      {c.id}
                    </td>

                    {/* Case Title */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {c.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 pl-6 font-normal">
                        {c.division} · {c.pageCount} pages
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-6">
                      {getStatusBadge(c.status)}
                    </td>

                    {/* Upload Timestamp */}
                    <td className="py-4 px-4 sm:px-6 text-slate-500 font-mono text-xs">
                      {c.uploadTimestamp}
                    </td>

                    {/* Arrow */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100/60 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
