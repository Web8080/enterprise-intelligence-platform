# Wireframe G: Sales Workspace

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

## Data sources

- `curated.sales_account_dim`
- `curated.sales_rep_dim`
- `curated.sales_pipeline_fact`
- `mart.mart_sales_pipeline_kpis`

## API endpoints

- `GET /api/v1/sales`

## Notes

The sales workspace is part of the primary dashboard navigation and is accessible from the global sidebar. It consumes the same governed warehouse layer as portfolio, finance and operations views.
