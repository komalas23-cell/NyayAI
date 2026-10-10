import React, { useState } from 'react';
import {
  Download,
  Key,
  Network,
  Shield,
  CheckCircle2,
  FileCheck2,
  Lock,
  Filter,
  Radio,
  Terminal,
  ExternalLink,
  Check,
} from 'lucide-react';
import { AuditLog } from '../types';

interface ComplianceLogsProps {
  logs: AuditLog[];
  onAddLog: (operation: string, result: string, category: 'Inference' | 'IAM' | 'Ingestion' | 'System') => void;
}

export const ComplianceLogs: React.FC<ComplianceLogsProps> = ({ logs }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedCert, setExportedCert] = useState<{
    reportId: string;
    generatedAt: string;
    signature: string;
  } | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (filterCategory === 'All') return true;
    return log.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/export-audit', { method: 'POST' });
      const data = await res.json();
      setExportedCert(data);

      // Trigger file download
      const reportBlob = new Blob(
        [
          `============================================================\n` +
            `NYAYAI SECURE JUDICIAL CLOUD - CRYPTOGRAPHIC AUDIT REPORT\n` +
            `============================================================\n` +
            `Report ID: ${data.reportId}\n` +
            `Generated At: ${data.generatedAt}\n` +
            `Digital Signature: ${data.signature}\n` +
            `Cloud KMS Key: ${data.cloudKmsKey}\n` +
            `Verified Controls: ${data.verifiedControls}\n` +
            `Jurisdiction: Secure Judicial Cloud Compliance\n\n` +
            `--- IMMUTABLE LEDGER ENTRIES ---\n` +
            logs
              .map(
                (l) =>
                  `[${l.timestamp}] [${l.principal}] [${l.operation}] -> ${l.result}`
              )
              .join('\n') +
            `\n\n============================================================\n` +
            `CHAIN OF CUSTODY VERIFIED - BENCH 04 SEAL\n` +
            `============================================================\n`,
        ],
        { type: 'text/plain' }
      );

      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NyayAI_Signed_Audit_Report_${Date.now()}.txt`;
      a.click();
    } catch (e) {
      console.warn('Local fallback export:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-[calc(100vh-65px)]">
      {/* Title & Top Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
            Defensibility Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Security & Compliance Logs
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Continuous verification of isolation, access, and evidentiary chain of custody.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>{isExporting ? 'Generating Signature...' : 'Export signed audit report'}</span>
        </button>
      </div>

      {/* 3 Status Cards (Exact to Screenshot 05) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Data Sovereignty Status */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 relative overflow-hidden shadow-xs border-t-4 border-t-blue-500 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
              Data Sovereignty Status
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mt-0.5">
              Cloud KMS (CMEK) Encryption
            </h4>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              100%
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Isolated
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Customer-managed encryption keys active across all storage and inference services.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-xs text-slate-600">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>Key rotation verified · 18 Jun 2025</span>
          </div>
        </div>

        {/* Card 2: Network Perimeter Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 relative overflow-hidden shadow-xs border-t-4 border-t-emerald-500 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
              Network Perimeter Matrix
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mt-0.5">
              VPC Service Controls
            </h4>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              Active
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Protected
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Private Service Connect routing enforced. No traffic traverses the public internet.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-xs text-slate-600">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>0 data exfiltration anomalies</span>
          </div>
        </div>

        {/* Card 3: Regulatory Posture */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 relative overflow-hidden shadow-xs border-t-4 border-t-amber-500 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
              Regulatory Posture
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mt-0.5">
              Government Compliance
            </h4>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['FedRAMP High', 'CJIS', 'SOC 2', 'HIPAA'].map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono"
              >
                {badge}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            All required control families are mapped and continuously monitored.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-xs text-slate-600">
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span>148 / 148 controls passing</span>
          </div>
        </div>
      </div>

      {/* Export Confirmation Banner */}
      {exportedCert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono">
                Cryptographic Attestation {exportedCert.reportId}
              </div>
              <div className="text-[11px] text-emerald-700 font-mono">
                Signature: {exportedCert.signature.slice(0, 36)}...
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700">Verified & Downloaded</span>
        </div>
      )}

      {/* Immutable Audit Ledger Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">
              Immutable Audit Ledger
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Live Operations Terminal</span>
            </h3>
          </div>

          {/* Controls: Filter & Live Stream */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-xs">
              <span className="text-slate-400">Filter:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All operations</option>
                <option value="Ingestion">Ingestion</option>
                <option value="Inference">Inference</option>
                <option value="IAM">IAM</option>
                <option value="System">System</option>
              </select>
            </div>

            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isLiveStreaming
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  isLiveStreaming ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span>LIVE STREAM</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen (Dark Theme matching Screenshot 05) */}
        <div className="rounded-2xl bg-[#0a1120] border border-slate-800 text-slate-200 overflow-hidden shadow-xl font-mono text-xs">
          {/* Terminal Title Bar */}
          <div className="bg-[#0f172a] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>audit.terminal.judicial.internal</span>
            </div>
            <div className="text-[10px] text-slate-500">
              SHA-256 Merkle Root: 4f98...d71b
            </div>
          </div>

          {/* Terminal Table */}
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Principal</th>
                  <th className="py-2.5 px-3">Operation</th>
                  <th className="py-2.5 px-3">Verification Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {log.timestamp}
                    </td>

                    {/* Principal */}
                    <td className="py-3 px-3 text-blue-400 font-semibold font-mono">
                      {log.principal}
                    </td>

                    {/* Operation */}
                    <td className="py-3 px-3 text-slate-200">
                      {log.operation}
                    </td>

                    {/* Result */}
                    <td className="py-3 px-3 text-emerald-400 flex items-center space-x-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400 flex-shrink-0" />
                      <span>{log.result}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Live blinking cursor prompt */}
            {isLiveStreaming && (
              <div className="pt-3 px-3 flex items-center space-x-2 text-slate-500 text-[11px]">
                <span className="w-2 h-3.5 bg-emerald-400 inline-block animate-pulse" />
                <span>Awaiting next verified transaction...</span>
              </div>
            )}
          </div>

          {/* Terminal Footer */}
          <div className="bg-[#070b14] px-4 py-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-500 gap-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-slate-600" />
              <span>Append-only ledger · Cloud Logging retention: 7 years</span>
            </div>
            <div>Last integrity check: 14:23:08 · Hash verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
