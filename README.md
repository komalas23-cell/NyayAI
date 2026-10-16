# NyayAI - Enterprise GCP Legal AI Assistant  

This enterprise system provides judicial clerks and legal professionals with a secure environment to upload, parse, analyze, and search vast volumes of legal records. By leveraging specialized Legal AI models and isolated cloud security, the platform transforms manual, multi-day document reviews into near-instantaneous semantic searches and insights, while guaranteeing absolute data privacy and compliance.

---

## 📋 Legal Document Intelligence & Analysis Platform: Executive Summary

This enterprise system provides judicial clerks and legal professionals with a secure environment to upload, parse, analyze, and search vast volumes of legal records. By leveraging specialized Legal AI models and isolated cloud security, the platform transforms manual, multi-day document reviews into near-instantaneous semantic searches and insights, while guaranteeing absolute data privacy and compliance.

---

## 🛡️ Layer-by-Layer Component Directory

### 1. Frontend & Ingestion Layer
*This is the entry gate where users securely interact with the application.*

* 🌐 **Google Cloud Run / Firebase (Web Portal):** Powers the user-facing web interface. It gives judicial clerks a fast, clean workspace to upload case files, view generated summaries, and run search queries.
* 🛡️ **Google Cloud Armor:** Acts as the platform's shield against malicious online traffic. It blocks cyber attacks, filters out suspicious traffic (WAF), stops automated bot floods (DDoS protection), and prevents the system from being overwhelmed by rate limiting.
* 🔒 **HTTPS / TLS 1.3 Encryption:** Secures the "data in transit." Every file uploaded or action taken is encrypted using modern protocols to prevent eavesdropping.

### 2. Processing & Document AI Layer
*This layer handles turning raw images and scanned papers into digital text.*

* 📄 **GCP Document AI (Specialized Legal OCR):** A specialized optical character recognition engine trained on legal terminology, Devanagari/Marathi scripts, and layouts to accurately process PDFs, scanned briefs, and handwritten notes into machine-readable digital text.
* ⏳ **Cloud Tasks:** Manages workload queues asynchronously. When large document stacks (1,000+ pages) are uploaded, Cloud Tasks breaks the job into smaller batches without freezing the system.

### 3. Gen AI Engine & RAG Pipeline
*The core brain responsible for deep analysis and intelligent legal reasoning.*

* 🤖 **Vertex AI Gemini 1.5 Pro:** Foundation model featuring a 2-million token context window, allowing the AI to read across entire libraries of case files, trial binders, and evidence simultaneously.
* 📐 **Vertex AI Embeddings API:** Converts text into legal embeddings to understand semantic meaning and legal context rather than simple keyword matching.
* 🔍 **Vertex AI Vector Search:** Drives Retrieval-Augmented Generation (RAG) to instantly scour and retrieve historically similar legal precedents and contextually relevant case studies.

### 4. Secure Storage & Persistence Layer
*The secure vault where all legal data, assets, and metadata reside permanently.*

* 🪣 **Cloud Storage (Case Files Bucket):** Resilient, isolated storage repository for raw uploads, massive PDFs, legal briefs, and digital evidence dossiers.
* 🗄️ **Cloud Spanner / Firestore:** Structured databases storing system metadata, indexing information, case reference numbers, upload timestamps, and user permissions.

### 5. Security & Governance Layer
*Cross-cutting safety net monitoring and restricting actions platform-wide.*

* 🔑 **Cloud KMS (Customer-Managed Encryption Keys - CMEK):** Ensures total data sovereignty. Organization-controlled cryptographic keys encrypt data at rest.
* 🆔 **Cloud IAM (Identity & Access Management):** Enforces the Principle of Least Privilege so users and background services only access required assets (Role-Based Access Control).
* 📋 **Cloud Logging & Audit Logs:** Maintains an immutable, tamper-proof ledger of every action for compliance audits.

---

## 🧱 The Secure Boundary: VPC Service Controls

A critical architectural feature is the **VPC Service Controls Perimeter**, wrapping around the Processing, Gen AI, and Storage layers.

* **Why it matters:** Prevents unauthorized exfiltration or copying of sensitive legal files outside the cloud boundary, even if credentials are compromised.
* **Private Service Connect:** Internal traffic passing from the public portal into the perimeter travels over private Google network paths, completely bypassing the open internet.

---

## 🏛️ Compliance & Regulatory Standards Framework

Because this platform handles sensitive legal evidence, judicial files, and PII, it adheres to strict security standards:

* **FedRAMP High / StateRAMP:** Infrastructure utilizes validated Google Cloud services at the highest baseline for government and judicial data.
* **SOC 2 Type II:** Certified for operational excellence in Security, Availability, Processing Integrity, Confidentiality, and Privacy.
* **CJIS & HIPAA Compliance:** Hardened data boundaries aligned with Criminal Justice Information Services (CJIS) and safeguards protecting medical evidence.
* **Data Sovereignty & Zero Data Leakage:** Uploaded legal files remain strictly private and are never used to train public foundation models.

---

## 🏗️ System Architecture Diagram

```mermaid
graph TD
    %% Styling Definitions
    classDef userStyle fill:#f9f9f9,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5;
    classDef frontendStyle fill:#e8f0fe,stroke:#1a73e8,stroke-width:2px;
    classDef perimeterStyle fill:#fff5f5,stroke:#ea4335,stroke-width:3px,stroke-dasharray: 5 5;
    classDef layerStyle fill:#ffffff,stroke:#5f6368,stroke-width:2px;
    classDef securityStyle fill:#f1f3f4,stroke:#5f6368,stroke-width:1px;

    %% User Node
    User(["👤 User / Judicial Clerk"])
    class User userStyle;

    %% Ingestion Layer
    subgraph FrontendLayer ["Frontend & Ingestion Layer"]
        WAF["🛡️ Google Cloud Armor <br>(WAF, DDoS, Rate Limiting)"]
        Portal["🌐 Cloud Run / Firebase <br>(Web Portal)"]
        WAF --> Portal
    end
    class FrontendLayer frontendStyle;

    %% Secure Traffic Flow
    User -- "1. Secure HTTPS / TLS 1.3" --> WAF
    Portal -- "2. Private Service Connect" --> ProcessingLayer

    %% VPC Service Controls Boundary
    subgraph VPCPerimeter ["🔒 VPC Service Controls Perimeter (Secure Boundary)"]
        
        %% Processing Layer
        subgraph ProcessingLayer ["Processing & Document AI Layer"]
            DocAI["📄 GCP Document AI <br>(Specialized Legal OCR / Handwriting)"]
            Tasks["⏳ Cloud Tasks <br>(Asynchronous 1000+ Page Batch Processing)"]
            DocAI <--> Tasks
        end
        class ProcessingLayer layerStyle;

        %% Gen AI & RAG
        subgraph GenAILayer ["Gen AI Engine & RAG Pipeline"]
            Gemini["🤖 Vertex AI Gemini 1.5 Pro <br>(2M Context Window)"]
            VecSearch["🔍 Vertex AI Vector Search <br>(Semantic Precedent Retrieval)"]
            Embeddings["📐 Vertex AI Embeddings API <br>(Legal Embeddings)"]
            Gemini --> VecSearch
            Gemini --> Embeddings
        end
        class GenAILayer layerStyle;

        %% Storage Layer
        subgraph StorageLayer ["Secure Storage & Persistence Layer"]
            GCS["🪣 Cloud Storage <br>(Case Files / Dossiers Bucket)"]
            DB["🗄️ Cloud Spanner / Firestore <br>(Structured Legal Metadata)"]
        end
        class StorageLayer layerStyle;

        %% Security & Governance Layer
        subgraph GovLayer ["Security & Governance Layer (Cross-Cutting)"]
            KMS["🔑 Cloud KMS (CMEK)"]
            IAM["🆔 Cloud IAM (RBAC / Least Privilege)"]
            Audit["📋 Cloud Logging & Audit Logs (Immutable Trails)"]
        end
        class GovLayer securityStyle;

        %% Internal Flow Connections
        ProcessingLayer -- "3. Clean Extracted Text" --> GenAILayer
        GenAILayer -- "4. Vector Query / Embeddings" --> StorageLayer
    end

    class VPCPerimeter perimeterStyle;
