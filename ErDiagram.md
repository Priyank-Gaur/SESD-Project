# ER Diagram — Return Fraud Detection System

```mermaid
erDiagram
    USER {
        ObjectId id PK
        String name
        String email UK
        String passwordHash
        Date accountCreatedAt
        String deviceFingerprint
        String address
        String role
    }
    ORDER {
        ObjectId id PK
        ObjectId userId FK
        String itemName
        Number itemPrice
        Date purchaseDate
        Date deliveryDate
        Boolean isSealed
    }
    RETURN {
        ObjectId id PK
        ObjectId orderId FK
        ObjectId userId FK
        String reason
        Date requestedAt
        String status
        String decision
    }
    FRAUD_SCORE {
        ObjectId id PK
        ObjectId returnId FK
        Number score
        String riskLevel
        Object signalBreakdown
        String strategy
        Date createdAt
    }
    RISK_RULE {
        ObjectId id PK
        String signalName UK
        Number weight
        Number threshold
        Boolean isActive
    }
    ADDRESS_CLUSTER {
        ObjectId id PK
        String address
        Array userIds
    }
    USER ||--o{ ORDER : "places"
    USER ||--o{ RETURN : "requests"
    ORDER ||--o| RETURN : "may have"
    RETURN ||--|| FRAUD_SCORE : "scored by"
    USER }o--o{ ADDRESS_CLUSTER : "belongs to"
```

## Entity Descriptions

| Entity | Purpose | Key Constraints |
|--------|---------|----------------|
| **USER** | Customer and merchant accounts | Email unique; role is customer or merchant |
| **ORDER** | A purchase that can be returned | Linked to one user; isSealed indicates factory-sealed packaging |
| **RETURN** | A return request against a specific order | Status: pending, approved, rejected; decision: auto or manual |
| **FRAUD_SCORE** | Fraud assessment for a single return | Score 0-100; riskLevel: LOW, MEDIUM, HIGH; signalBreakdown stores per-signal scores |
| **RISK_RULE** | Configurable scoring rules | Each rule maps to one of the 7 fraud signals; isActive allows toggling |
| **ADDRESS_CLUSTER** | Groups users sharing the same address | Used by ClusterService to detect potential fraud rings |

## Relationships

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| USER to ORDER | One-to-Many | A user can place multiple orders |
| USER to RETURN | One-to-Many | A user can submit multiple returns |
| ORDER to RETURN | One-to-One optional | An order can have at most one return |
| RETURN to FRAUD_SCORE | One-to-One | Every return receives exactly one fraud score |
| USER to ADDRESS_CLUSTER | Many-to-Many | Multiple users can share an address |
