import { CaseRecord, AuditLog, DocumentPageData } from '../types';

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'CASE-942',
    title: 'State v. Sharma',
    status: 'AI Analysis Ready',
    statusColor: 'green',
    uploadTimestamp: '18 Jun 2025 · 14:20',
    pageCount: 78,
    dossierName: 'State_vs_Sharma_ChargeSheet.pdf',
    division: 'Criminal Division · Bench 04',
  },
  {
    id: 'CASE-938',
    title: 'Kumar v. National Housing Board',
    status: 'Document Parsing',
    statusColor: 'amber',
    uploadTimestamp: '18 Jun 2025 · 11:42',
    pageCount: 142,
    dossierName: 'Kumar_v_NHB_Petition.pdf',
    division: 'Civil Appellate Division · Bench 02',
  },
  {
    id: 'CASE-921',
    title: 'People v. Mehta Industries',
    status: 'Human Review',
    statusColor: 'blue',
    uploadTimestamp: '17 Jun 2025 · 16:08',
    pageCount: 210,
    dossierName: 'Mehta_Environmental_Violation_Brief.pdf',
    division: 'Tribunal Regulatory Bench · Bench 01',
  },
  {
    id: 'CASE-904',
    title: 'State v. Verma',
    status: 'Indexed & Secured',
    statusColor: 'gray',
    uploadTimestamp: '16 Jun 2025 · 09:31',
    pageCount: 54,
    dossierName: 'State_vs_Verma_FIR_Index.pdf',
    division: 'Criminal Division · Bench 04',
  },
];

export const DOSSIER_PAGES: Record<number, DocumentPageData> = {
  44: {
    pageNumber: 44,
    totalPages: 78,
    courtHeader: 'IN THE COURT OF THE SESSIONS JUDGE\nDISTRICT COURT, NEW DELHI',
    subHeader: 'STATEMENT OF PROSECUTION WITNESS — 2',
    caseRef: 'Case No. 942/2025',
    caseParties: 'State (NCT of Delhi) versus Rajesh Sharma',
    paragraphs: [
      {
        num: 1,
        text: 'I, Anil Kumar, son of Shri Mohan Kumar; aged 42 years, residing at 17, Lajpat Nagar, New Delhi, do hereby state on solemn affirmation as follows:',
      },
      {
        num: 2,
        text: 'On the evening of 12 June 2025, I was present at my place of employment at 42 Market Road. I observed the accused enter the premises and engage in a verbal altercation.',
      },
      {
        num: 3,
        text: 'The premises were adequately illuminated. I was positioned approximately fifteen metres from the principal entrance and had an unobstructed view.',
      },
    ],
    footerSign: 'Recorded before me,\nMagistrate First Class',
  },
  45: {
    pageNumber: 45,
    totalPages: 78,
    courtHeader: 'IN THE COURT OF THE SESSIONS JUDGE\nDISTRICT COURT, NEW DELHI',
    subHeader: 'CONTINUATION OF WITNESS STATEMENT\nPROSECUTION WITNESS — 2',
    caseRef: 'Case No. 942/2025',
    caseParties: 'State (NCT of Delhi) versus Rajesh Sharma',
    paragraphs: [
      {
        num: 1,
        text: 'The verbal exchange continued for several minutes. At this time I moved toward the east-facing window to better ascertain the nature of the disturbance.',
      },
      {
        num: 2,
        text: 'According to medical and police records and my direct line of sight, the primary physical altercation occurred at exactly 11:15 PM. The accused produced a metallic object from beneath his overcoat and struck repeatedly.',
        highlightTarget: true,
        contradictionRole: 'prosecution',
        contradictionLabel: 'PROSECUTION (Source A): Primary Incident Timestamp 11:15 PM',
      },
      {
        num: 3,
        text: 'I promptly engaged the interior security deadbolt and contacted emergency dispatch via mobile handset at 11:19 PM. Emergency personnel arrived shortly thereafter.',
      },
    ],
    footerSign: 'Witness Signature: Anil Kumar\nAttested: Magistrate First Class',
  },
  52: {
    pageNumber: 52,
    totalPages: 78,
    courtHeader: 'IN THE COURT OF THE SESSIONS JUDGE\nDISTRICT COURT, NEW DELHI',
    subHeader: 'DEPOSITION OF DEFENCE WITNESS — WITNESS B',
    caseRef: 'Case No. 942/2025',
    caseParties: 'State (NCT of Delhi) versus Rajesh Sharma',
    paragraphs: [
      {
        num: 1,
        text: 'I, Priya Nair, night-shift supervisor at 44 Market Road commercial annex, state on solemn oath:',
      },
      {
        num: 4,
        text: '“I heard the disturbance at approximately 10:45 PM. By the time I reached the exterior service alleyway at 10:55 PM, no shouting was audible and no persons were standing near the doorway.”',
        highlightTarget: true,
        contradictionRole: 'defense',
        contradictionLabel: 'DEFENSE (Source B): Conflicting Incident Timestamp 10:45 PM',
      },
      {
        num: 5,
        text: 'The ambient street lighting was flickering intermittently throughout the evening prior to municipal maintenance arrival.',
      },
    ],
    footerSign: 'Recorded before me,\nSessions Registrar',
  },
  61: {
    pageNumber: 61,
    totalPages: 78,
    courtHeader: 'STATE POLICE INVESTIGATION BRANCH\nCRIME SCENE FIRST RESPONDER LOG',
    subHeader: 'DISPATCH ENTRY & ON-SCENE APPREHENSION MEMORANDUM',
    caseRef: 'Case No. 942/2025',
    caseParties: 'FIR No. 104/2025 · Police Station Connaught Place',
    paragraphs: [
      {
        num: 1,
        text: 'First Responder Unit 4 arrived at 42 Market Road at 11:28 PM. Forensic examination confirms the physical disturbance occurred at 11:15 PM as logged by dispatch communications.',
        highlightTarget: true,
      },
      {
        num: 2,
        text: 'CCTV feed from adjacent establishment camera #3 was impounded under Section 65B Certificate.',
      },
    ],
    footerSign: 'Sub-Inspector V. K. Rao\nBadge ID #88419',
  },
  68: {
    pageNumber: 68,
    totalPages: 78,
    courtHeader: 'CIVIL HOSPITAL TRAUMA EMERGENCY CENTER\nMEDICO-LEGAL FORENSIC CERTIFICATE',
    subHeader: 'EMERGENCY ADMISSION & WOUND CHRONOLOGY',
    caseRef: 'Case No. 942/2025',
    caseParties: 'MLC No. 841/2025',
    paragraphs: [
      {
        num: 1,
        text: 'Patient brought by Emergency Medical Ambulance at 11:42 PM.',
      },
      {
        num: 3,
        text: 'Attending trauma surgeon Dr. S. K. Sen certifies wound age consistent with trauma sustained at 11:15 PM (+/- 10 minutes), matching eyewitness chronometry.',
        highlightTarget: true,
      },
    ],
    footerSign: 'Chief Medical Officer\nRegistration #DMC-39148',
  },
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '14:20:05',
    principal: 'User_Clerk_04',
    operation: 'Uploaded Case_942',
    result: 'Transaction logged to Cloud Spanner',
    category: 'Ingestion',
  },
  {
    id: 'log-2',
    timestamp: '14:20:06',
    principal: 'Cloud_Tasks',
    operation: 'Batch queue initialized',
    result: 'Job ID CT-8841 verified',
    category: 'System',
  },
  {
    id: 'log-3',
    timestamp: '14:20:12',
    principal: 'Document_AI',
    operation: 'Parsed 78 document pages',
    result: 'CMEK encryption retained',
    category: 'Ingestion',
  },
  {
    id: 'log-4',
    timestamp: '14:20:18',
    principal: 'Vertex_RAG',
    operation: 'Generated 1,426 embeddings',
    result: 'Vector index isolated',
    category: 'Inference',
  },
  {
    id: 'log-5',
    timestamp: '14:22:41',
    principal: 'User_Clerk_04',
    operation: 'Queried Witness 2 statement',
    result: 'Citation retrieval logged',
    category: 'Inference',
  },
  {
    id: 'log-6',
    timestamp: '14:23:02',
    principal: 'IAM_Gateway',
    operation: 'Permission assertion renewed',
    result: 'Least privilege policy valid',
    category: 'IAM',
  },
];
