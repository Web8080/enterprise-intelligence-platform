# Wireframe C: AI Assistant

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

## API endpoints

- `GET /api/v1/ai/assistant`
- `POST /api/v1/ai/query`

## Governance

AI interactions are logged in `curated.ai_interaction_log` with user, organisation, question text, generated SQL, confidence score and execution status. The assistant is grounded in curated portfolio and sales datasets and reports confidence plus limitations with every answer.
