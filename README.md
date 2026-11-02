# Enterprise Intelligence Platform

SNOWFLAKE · DATA ENGINEERING · AI/ML · CLOUD SECURITY

A production-oriented enterprise data platform combining modern data warehousing, automated pipelines, machine learning, generative AI, data governance and cloud-native engineering.

## About

Enterprise Intelligence Platform is a production-oriented Snowflake-powered data platform for property management and real estate operations. It combines data ingestion, transformation, analytics, Snowpark ML, generative AI, governance, and operational monitoring into a single enterprise-ready solution for organisations that need secure, actionable intelligence across their portfolios.

The platform is designed to ingest structured and semi-structured operational data, enforce governance and security controls, model business performance through analytics and forecasting, and provide natural language insights for decision-making. It is built with modular architecture so it can extend beyond property operations into additional industries such as logistics, healthcare, retail, and financial services.

## Product Goals

- Ingest structured and semi-structured property and portfolio data.
- Organise data using a layered Warehouse model inspired by Snowflake architecture.
- Transform raw landings into curated business datasets.
- Run ML-driven predictions for arrears, occupancy, and maintenance demand.
- Deliver natural language enterprise analytics through an AI assistant.
- Apply enterprise security controls and governance policies.
- Support monitoring and operational visibility across data and platform services.

## Architecture

```mermaid
flowchart TD
    A[Business Data Sources] --> B[Ingestion Layer]
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
    K --> L[Natural Language Analytics]
    M[RBAC / Data Governance] --> J
    N[Monitoring / Audit / CI-CD] --> B
    N --> D
    N --> J
```

### High-level system architecture

```mermaid
flowchart LR
    subgraph Source[Operational Sources]
        S1[Property management system]
        S2[Lease and tenant data]
        S3[Maintenance service desk]
        S4[Finance and general ledger]
    end

    subgraph Data[Data Platform]
        D1[Ingestion jobs]
        D2[Snowflake raw]
        D3[Staging and validation]
        D4[Curated marts]
        D5[ML and AI services]
    end

    subgraph App[Application Layer]
        A1[FastAPI services]
        A2[Next.js dashboard]
        A3[AI assistant]
    end

    S1 --> D1
    S2 --> D1
    S3 --> D1
    S4 --> D1
    D1 --> D2 --> D3 --> D4 --> D5
    D5 --> A1 --> A2
    D5 --> A3
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

    Source->>Ingest: Upload CSV/JSON/API payload
    Ingest->>Raw: Persist raw records + metadata
    Ingest->>Quality: Validate schema and duplicates
    Quality->>Staging: Standardize and enrich data
    Staging->>Curated: Publish business-ready records
    Curated-->>Ingest: Data quality and freshness metrics
```

### AI and machine learning workflow

```mermaid
flowchart TD
    A[Curated enterprise datasets] --> B[Feature engineering]
    B --> C[Snowpark ML training]
    C --> D[Model validation and metrics]
    D --> E[Versioned model registry]
    E --> F[Inference pipeline]
    F --> G[Forecasts and anomaly results]
    G --> H[AI assistant]
    H --> I[Business insight generation]
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
    A[Sidebar] --> B[Organisation selector]
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

### Wireframe C: AI Intelligence Assistant

```mermaid
flowchart TB
    A[Question Input] --> B[Suggested Business Questions]
    A --> C[AI-generated Response]
    C --> D[SQL Query Provenance]
    C --> E[Data Source References]
    C --> F[Charts and Tables]
    C --> G[Confidence and Limitation Indicators]
    D --> H[Query History]
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

## Repository Structure

- `backend/` — Python FastAPI application, ingestion services, and API layer.
- `frontend/` — Next.js dashboard and enterprise UI.
- `docs/wireframes/` — diagram source files for the product interface and operational design.
- `terraform/` — infrastructure definitions.
- `.github/workflows/` — automated CI/CD pipeline definition.
- `docker-compose.yml` — full local platform stack.

## Local Startup

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## Core Features Delivered

- Property portfolio analytics dashboard.
- Rental and arrears overview metrics.
- Maintenance and occupancy insights.
- AI assistant grounded in demo operational data.
- Ingestion and pipeline status endpoints.
- Security and governance summary model.
- Observability status for health checks and operations.
- Dockerised local deployment with CI pipeline metadata.

## Security and Compliance Notes

This repository demonstrates enterprise-grade controls and policies in a prototype architecture. It does not replace formal production review, tenant isolation planning, or cloud security hardening required for a regulated environment.

## License

This project is provided for demonstration, architecture, and engineering exploration. Users should adapt it to their own contractual and regulatory requirements before production deployment.
