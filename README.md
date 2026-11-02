# Enterprise Intelligence Platform

![Enterprise Intelligence Platform dashboard preview](docs/dashboard-preview.svg)

SNOWFLAKE · DATA ENGINEERING · AI/ML · CLOUD SECURITY

A production-oriented enterprise data platform combining modern data warehousing, automated pipelines, machine learning, generative AI, data governance and cloud-native engineering.

## About

Enterprise Intelligence Platform is a production-oriented Snowflake-powered data platform for property management and real estate operations. It combines data ingestion, transformation, portfolio and sales analytics, Snowpark ML, a grounded generative AI assistant, governance, integrations, and operational monitoring into a single enterprise-ready solution for organisations that need secure, actionable intelligence across their portfolios.

The platform is designed to ingest structured and semi-structured operational data, connect CRM and sales systems, enforce governance and security controls, model business performance through analytics and forecasting, and provide natural language insights for decision-making. It is built with modular architecture so it can extend beyond property operations into additional industries such as logistics, healthcare, retail, and financial services.

## Product Goals

- Ingest structured and semi-structured property, portfolio, and sales pipeline data.
- Organise data using a layered Warehouse model inspired by Snowflake architecture.
- Transform raw landings into curated business datasets.
- Run ML-driven predictions for arrears, occupancy, maintenance demand, and sales pipeline coverage.
- Deliver natural language enterprise analytics through the grounded AI Assistant.
- Track sales opportunities, targets, channels, and closed-won performance.
- Connect external systems through a managed integrations surface.
- Apply enterprise security controls, workspace settings, and governance policies.
- Support monitoring and operational visibility across data and platform services.

## Architecture

```mermaid
flowchart TD
    A[Property and Sales Data Sources] --> B[Ingestion Layer]
    B --> C[Snowflake Raw Layer]
    C --> D[Snowflake Streams & Tasks]
    D --> E[Transformation Layer]
    E --> F[Snowflake Curated Data]
    F --> G[Snowpark Python / ML]
    F --> H[Snowflake Cortex AI]
    G --> I[Intelligence API]
    H --> I
    I --> J[FastAPI Backend]
    J --> K[React / Next.js Dashboard]
    K --> L[AI Assistant]
    K --> O[Sales Intelligence]
    K --> P[Integrations and Settings]
    M[RBAC / Data Governance] --> J
    N[Monitoring / Audit / CI-CD] --> B
    N --> D
    N --> J
    N --> P
```

### High-level system architecture

```mermaid
flowchart LR
    subgraph Source[Operational Sources]
        S1[Property management system]
        S2[Lease and tenant data]
        S3[Maintenance service desk]
        S4[Finance and general ledger]
        S5[Sales CRM and opportunity pipeline]
    end

    subgraph Data[Data Platform]
        D1[Ingestion jobs]
        D2[Snowflake raw]
        D3[Staging and validation]
        D4[Curated portfolio and sales marts]
        D5[ML and AI services]
    end

    subgraph App[Application Layer]
        A1[FastAPI services]
        A2[Next.js dashboard]
        A3[AI Assistant]
        A4[Sales workspace]
        A5[Integrations and Settings]
    end

    S1 --> D1
    S2 --> D1
    S3 --> D1
    S4 --> D1
    S5 --> D1
    D1 --> D2 --> D3 --> D4 --> D5
    D5 --> A1 --> A2
    D5 --> A3
    D4 --> A4
    A5 --> D1
```

### Data ingestion and transformation lifecycle

```mermaid
sequenceDiagram
    participant Source as Source System
    participant Ingest as Ingestion Service
    participant Raw as Raw Stage
    participant Staging as Staging Layer
    participant Curated as Curated Layer
    participant Quality as Quality Rules

    Source->>Ingest: Upload property, finance, or sales CSV/JSON/API payload
    Ingest->>Raw: Persist raw records + metadata
    Ingest->>Quality: Validate schema and duplicates
    Quality->>Staging: Standardize and enrich property and opportunity data
    Staging->>Curated: Publish portfolio and sales-ready records
    Curated-->>Ingest: Data quality and freshness metrics
```

### AI and machine learning workflow

```mermaid
flowchart TD
    A[Curated portfolio and sales datasets] --> B[Feature engineering]
    B --> C[Snowpark ML training]
    C --> D[Model validation and metrics]
    D --> E[Versioned model registry]
    E --> F[Inference pipeline]
    F --> G[Forecasts, pipeline coverage, and anomaly results]
    G --> H[AI Assistant]
    H --> I[Business insight and SQL provenance]
    H --> J[Executive and sales actions]
```

### Authentication and authorisation lifecycle

```mermaid
sequenceDiagram
    participant User as End User
    participant App as API / UI
    participant Auth as Identity Provider
    participant Policy as RBAC + Row Policies
    participant Data as Warehouse Data

    User->>App: Sign in and request analytics
    App->>Auth: Validate session and roles
    Auth-->>App: Token, org, permissions
    App->>Policy: Resolve permissible datasets
    Policy->>Data: Enforce row access and masking
    Data-->>App: authorised results only
    App-->>User: Dashboard or AI response
```

### Deployment architecture

```mermaid
flowchart LR
    subgraph Edge[Edge and Platform]
        G[GitHub Actions]
        D[Docker]
        C[Docker Compose / Runtime]
    end

    subgraph Services[Application Services]
        B[FastAPI backend]
        F[Next.js frontend]
        O[Observability stack]
    end

    G --> D --> C
    C --> B
    C --> F
    B --> O
    F --> O
```

### CI/CD workflow

```mermaid
flowchart TD
    A[Code push] --> B[GitHub Actions lint]
    B --> C[Type check and unit tests]
    C --> D[Security scan]
    D --> E[Build images]
    E --> F[Deploy to staging]
    F --> G[Smoke tests]
    G --> H[Production promotion]
```

### Multi-tenant data isolation

```mermaid
flowchart LR
    subgraph TenantA[Organisation A]
        A1[Role A]
        A2[Masked view]
    end
    subgraph TenantB[Organisation B]
        B1[Role B]
        B2[Masked view]
    end
    subgraph Shared[Platform control plane]
        C1[Identity and policy engine]
        C2[Audit log]
    end

    C1 --> A1
    C1 --> B1
    A2 --> C2
    B2 --> C2
```

## Product UI Wireframes

The following wireframes reflect the product surface shipped in this repository.

### Wireframe A: Enterprise Dashboard

```mermaid
flowchart TB
    A[Sidebar: Overview, Portfolio, Sales, Finance, Operations, Governance, AI Assistant, Integrations, Settings] --> B[Global search]
    A --> C[Date filters]
    B --> D[Total Properties]
    B --> E[Total Rental Income]
    B --> F[Outstanding Arrears]
    B --> G[Occupancy Rate]
    D --> H[Revenue Trends]
    E --> I[Portfolio Performance]
    F --> J[AI Business Insights]
    G --> K[Recent Alerts]
    H --> L[Maintenance Spend]
    J --> M[AI Assistant action]
```

### Wireframe B: Data Engineering Console

```mermaid
flowchart TB
    A[Data Source Connections] --> B[Ingestion Status]
    A --> C[Pipeline Execution History]
    B --> D[Failed Jobs]
    C --> E[Records Ingested]
    D --> F[Data Quality Indicators]
    E --> G[Retry Controls]
    F --> H[Pipeline Logs]
```

### Wireframe C: AI Assistant

```mermaid
flowchart TB
    A[Header AI Assistant Action] --> B[Assistant Workspace]
    B --> C[Question Input]
    B --> D[Suggested Business Questions]
    B --> E[Assistant Status and Model]
    C --> F[AI-generated Response]
    F --> G[SQL Query Provenance]
    F --> H[Data Source References]
    F --> I[Charts and Tables]
    F --> J[Confidence and Limitation Indicators]
    G --> K[Query History]
```

### Wireframe D: Security and Governance Console

```mermaid
flowchart TB
    A[User Management] --> B[Roles and Permissions]
    A --> C[Data Access Policies]
    B --> D[Masking Policies]
    C --> E[Audit Events]
    D --> F[Suspicious Activity]
    E --> G[AI Access Monitoring]
    F --> H[Governance Status]
```

### Wireframe E: ML and Forecasting Dashboard

```mermaid
flowchart TB
    A[Model Selection] --> B[Training Status]
    B --> C[Model Performance]
    C --> D[Prediction Results]
    D --> E[Forecasting Charts]
    E --> F[Anomaly Detection]
    F --> G[Model Metrics]
    G --> H[Model Version History]
```

### Wireframe F: Infrastructure and Monitoring

```mermaid
flowchart TB
    A[API Health] --> B[Service Availability]
    B --> C[Pipeline Health]
    C --> D[System Latency]
    D --> E[Error Rates]
    E --> F[Warehouse Utilisation]
    F --> G[Query Performance]
    G --> H[Deployment Status]
```

### Wireframe G: Sales Workspace

```mermaid
flowchart TB
    A[Sales Navigation] --> B[Pipeline Value]
    A --> C[Closed Won MTD]
    A --> D[Win Rate]
    A --> E[Average Deal Cycle]
    B --> F[Sales Performance Against Target]
    C --> G[Active Pipeline Table]
    D --> H[Regional Target Attainment]
    E --> I[Channel Mix]
    G --> J[Account, City, Value, Stage, Owner, Close Date]
```

### Wireframe H: Integrations

```mermaid
flowchart TB
    A[Integrations Navigation] --> B[Connected Systems Summary]
    B --> C[Snowflake]
    B --> D[Yardi]
    B --> E[Salesforce]
    B --> F[Stripe]
    B --> G[Slack]
    B --> H[Power BI]
    C --> I[Manage Connection and Last Sync]
```

### Wireframe I: Settings

```mermaid
flowchart TB
    A[Settings Navigation] --> B[Organisation Profile]
    A --> C[Reporting Defaults]
    A --> D[Notifications]
    A --> E[Data and Security]
    A --> F[Workspace Roles]
    B --> G[Save Settings]
    D --> H[Email Digest, AI Audit Log, Board Pack]
    E --> I[Snowflake Connection and Access Policies]
```

## Repository Structure

- `backend/` — Python FastAPI application, ingestion services, sales and AI Assistant endpoints, and API layer.
- `frontend/` — Next.js dashboard covering portfolio, sales, finance, operations, governance, AI Assistant, integrations and settings.
- `dbt/` — staging and mart models for portfolio and sales pipeline analytics.
- `sql/snowflake/` — warehouse, property, sales, security and governance DDL.
- `docs/wireframes/` — diagram source files for the product interface and operational design.
- `terraform/` — infrastructure definitions including landing, sales, curated and audit storage.
- `.github/workflows/` — automated CI/CD pipeline definition.
- `docker-compose.yml` — full local platform stack.

## API Surface

- `GET /api/v1/dashboard/overview` — executive portfolio metrics and alerts.
- `GET /api/v1/sales` — sales pipeline, targets, channels and opportunity detail.
- `GET /api/v1/analytics`, `/api/v1/finance`, `/api/v1/maintenance` — operational analytics.
- `GET /api/v1/ai/assistant` — assistant status, capabilities and suggested questions.
- `POST /api/v1/ai/query` — grounded natural language analytics with SQL provenance.
- `GET /api/v1/ingestion`, `/api/v1/pipelines`, `/api/v1/monitoring` — data platform operations.
- `GET /api/v1/security`, `/api/v1/governance`, `/api/v1/audit` — governance and audit views.

## Local Startup

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## Core Features Delivered

- Property portfolio analytics dashboard with city-level performance, composition, watchlist and lease expiry views.
- Sales workspace with pipeline value, closed-won performance, regional target attainment, channel mix and active opportunity table.
- Finance workspace with revenue trends, arrears ageing, cost breakdown, forecast variance and recent transactions.
- Operations workspace with work-order queue, maintenance spend, SLA performance, vendor scorecards and scheduled maintenance.
- Governance workspace with roles, compliance posture, audit events and data access policies.
- Grounded AI Assistant with suggested questions, SQL provenance, source references, confidence and limitations.
- Global search across properties, sales opportunities and navigation sections.
- Integrations workspace for Snowflake, Yardi, Salesforce, Stripe, Slack and Power BI.
- Settings workspace for organisation profile, reporting defaults, notifications, data security and workspace roles.
- Ingestion and pipeline status endpoints.
- Security and governance summary model.
- Observability status for health checks and operations.
- Dockerised local deployment with CI pipeline metadata.

## Security and Compliance Notes

This repository demonstrates enterprise-grade controls and policies in a prototype architecture. It does not replace formal production review, tenant isolation planning, or cloud security hardening required for a regulated environment.

## License

This project is provided for demonstration, architecture, and engineering exploration. Users should adapt it to their own contractual and regulatory requirements before production deployment.
