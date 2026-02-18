# Use Case Diagram — Return Fraud Detection System

```mermaid
graph TB
    subgraph Actors
        Customer["Customer"]
        Merchant["Merchant"]
        System["System"]
        MLService["ML Service"]
    end
    subgraph UseCases["Use Cases"]
        UC1["Submit Return Request"]
        UC2["Score Return"]
        UC3["View Dashboard"]
        UC4["Override Decision"]
        UC5["Toggle Scoring Mode"]
        UC6["Receive Real-time Alert"]
        UC7["View Fraud Clusters"]
        UC8["Register / Login"]
        UC9["View Return Details"]
        UC10["View Analytics"]
        UC11["Create Order"]
    end
    Customer -->|submits| UC1
    Customer -->|places| UC11
    Customer --> UC8
    Merchant --> UC3
    Merchant --> UC4
    Merchant --> UC5
    Merchant --> UC6
    Merchant --> UC7
    Merchant --> UC9
    Merchant --> UC10
    Merchant --> UC8
    System -->|triggers| UC2
    System -->|sends| UC6
    UC2 -->|"uses rule-based"| System
    UC2 -->|"uses ML mode"| MLService
    UC1 -->|"includes"| UC2
    UC2 -->|"includes"| UC6
    UC3 -->|"extends"| UC7
    UC3 -->|"extends"| UC10
```

## Actor Descriptions

| Actor | Description |
|-------|-------------|
| **Customer** | End-user who places orders and submits return requests via the API |
| **Merchant** | Business user who monitors returns, reviews flagged cases, and makes override decisions |
| **System** | Automated backend that orchestrates scoring, alerting, and clustering |
| **ML Service** | External Python microservice providing ML-based fraud scoring when toggled on |

## Use Case Details

| Use Case | Primary Actor | Description |
|----------|--------------|-------------|
| Submit Return Request | Customer | Customer submits a return for a previously delivered order |
| Score Return | System | System evaluates the return using the active scoring strategy |
| View Dashboard | Merchant | Merchant views summary stats including total returns, fraud rate, risk distribution |
| Override Decision | Merchant | Merchant manually approves or rejects a return regardless of system recommendation |
| Toggle Scoring Mode | Merchant | Merchant switches between rule-based and ML scoring at runtime |
| Receive Real-time Alert | Merchant | Merchant receives a live WebSocket notification when a HIGH-risk return is detected |
| View Fraud Clusters | Merchant | Merchant views D3 force graph of accounts linked by shared address or device |
| Register / Login | Customer, Merchant | Users authenticate via JWT to access the system |
| View Return Details | Merchant | Merchant views individual return with signal breakdown and weights |
| View Analytics | Merchant | Merchant views signal frequency charts and fraud trend lines |
| Create Order | Customer | Customer places an order which can later be the subject of a return |
