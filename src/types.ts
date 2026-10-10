export type ModuleTab = 'login' | 'dashboard' | 'workspace' | 'compliance';

export type WorkspaceSubTab = 'summary' | 'testimonies' | 'forensics';

export interface CaseRecord {
  id: string;
  title: string;
  status: 'AI Analysis Ready' | 'Document Parsing' | 'Human Review' | 'Indexed & Secured';
  statusColor: 'green' | 'amber' | 'blue' | 'gray';
  uploadTimestamp: string;
  pageCount: number;
  dossierName: string;
  division: string;
}

export interface DocumentParagraph {
  num: number;
  text: string;
  originalScript?: string;
  englishTranslation?: string;
  highlightTarget?: boolean;
  contradictionRole?: 'prosecution' | 'defense';
  contradictionLabel?: string;
}

export interface DocumentPageData {
  pageNumber: number;
  totalPages: number;
  courtHeader: string;
  subHeader: string;
  caseRef: string;
  caseParties: string;
  paragraphs: DocumentParagraph[];
  footerSign: string;
}

export interface CustomDossier {
  id: string;
  fileName: string;
  fileSize: string;
  caseTitle: string;
  pageCount: number;
  rawText: string;
  isIndicScript?: boolean;
  ocrApplied?: boolean;
  detectedLanguage?: string;
  ocrConfidence?: number;
  pages: Record<number, DocumentPageData>;
}

export interface Citation {
  page: number;
  para: number;
  label: string;
}


export interface ContradictionSource {
  name: string;
  statement: string;
  source: string;
  page: number;
  para: number;
}

export interface ContradictionAlert {
  title: string;
  description: string;
  sourceA: ContradictionSource;
  sourceB: ContradictionSource;
}

export interface ConsistencyCard {
  source: string;
  detail: string;
  verified: boolean;
}

export interface AIAnalysisResult {
  answer: string;
  citation: Citation;
  confidence: number;
  crossVerifiedCount: number;
  hasContradiction: boolean;
  contradictionAlert: ContradictionAlert | null;
  consistencyCards: ConsistencyCard[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  principal: string;
  operation: string;
  result: string;
  category: 'Ingestion' | 'Inference' | 'IAM' | 'Encryption' | 'System';
}
