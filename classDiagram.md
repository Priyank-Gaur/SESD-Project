# Class Diagram — Return Fraud Detection System

```mermaid
classDiagram
    direction TB

    class ScoringStrategy {
        <<interface>>
        +score(returnRequest IReturn) Promise~ScoringResult~
    }
    class RuleBasedScoringStrategy {
        -returnRepo ReturnRepository
        -userRepo UserRepository
        -orderRepo OrderRepository
        +score(returnRequest IReturn) Promise~ScoringResult~
    }
    class MLScoringStrategy {
        -returnRepo ReturnRepository
        -userRepo UserRepository
        -orderRepo OrderRepository
        -mlServiceUrl string
        +score(returnRequest IReturn) Promise~ScoringResult~
    }

    class AlertObserver {
        <<interface>>
        +notify(fraudScore IFraudScore) void
    }
    class WebSocketAlertObserver {
        -io Server
        +notify(fraudScore IFraudScore) void
    }
    class LogAlertObserver {
        +notify(fraudScore IFraudScore) void
    }

    class UserRepository {
        +findById(id) User
        +findByEmail(email) User
        +findAll() User array
        +create(data) User
        +update(id data) User
        +delete(id) void
        +findByAddress(address) User array
        +findByDeviceFingerprint(fp) User array
    }
    class OrderRepository {
        +findById(id) Order
        +findAll() Order array
        +findByUserId(userId) Order array
        +create(data) Order
        +update(id data) Order
        +delete(id) void
    }
    class ReturnRepository {
        +findById(id) Return
        +findAll() Return array
        +create(data) Return
        +update(id data) Return
        +delete(id) void
        +countRecentByUser(userId days) number
    }
    class FraudScoreRepository {
        +findById(id) FraudScore
        +findAll() FraudScore array
        +findByReturnId(returnId) FraudScore
        +create(data) FraudScore
        +getSignalStats() Object array
        +getFraudTrend(days) Object array
    }

    class AuthService {
        -userRepo UserRepository
        +register(data) Object
        +login(credentials) Object
    }
    class ScoringService {
        -activeStrategy ScoringStrategy
        -ruleStrategy RuleBasedScoringStrategy
        -mlStrategy MLScoringStrategy
        -fraudScoreRepo FraudScoreRepository
        -returnRepo ReturnRepository
        -alertService AlertService
        +scoreReturn(returnReq) FraudScore
        +setStrategy(name) void
        +getActiveStrategy() string
    }
    class ReturnService {
        -returnRepo ReturnRepository
        -orderRepo OrderRepository
        -scoringService ScoringService
        +createReturn(data) Object
        +getAllReturns() Return array
        +getReturnById(id) Return
        +updateDecision(id decision) Return
    }
    class AlertService {
        -observers AlertObserver array
        +addObserver(observer) void
        +notifyAll(fraudScore) void
    }
    class ClusterService {
        -userRepo UserRepository
        +getAddressClusters() Object array
        +getDeviceClusters() Object array
        +getAllClusters() ClusterData
    }

    class AuthController {
        -authService AuthService
        +register(req res) void
        +login(req res) void
    }
    class ReturnController {
        -returnService ReturnService
        -scoringService ScoringService
        +createReturn(req res) void
        +getAllReturns(req res) void
        +getReturnById(req res) void
        +updateDecision(req res) void
        +toggleStrategy(req res) void
    }
    class OrderController {
        -orderRepo OrderRepository
        +createOrder(req res) void
        +getOrdersByUser(req res) void
    }
    class DashboardController {
        -returnRepo ReturnRepository
        -fraudScoreRepo FraudScoreRepository
        -clusterService ClusterService
        +getStats(req res) void
        +getClusters(req res) void
        +getSignals(req res) void
    }

    ScoringStrategy <|.. RuleBasedScoringStrategy : implements
    ScoringStrategy <|.. MLScoringStrategy : implements
    AlertObserver <|.. WebSocketAlertObserver : implements
    AlertObserver <|.. LogAlertObserver : implements

    ScoringService --> ScoringStrategy : uses
    ScoringService --> AlertService : notifies
    ScoringService --> FraudScoreRepository : persists

    ReturnService --> ReturnRepository : manages
    ReturnService --> OrderRepository : validates
    ReturnService --> ScoringService : delegates

    AuthService --> UserRepository : manages
    ClusterService --> UserRepository : queries

    AuthController --> AuthService : delegates
    ReturnController --> ReturnService : delegates
    ReturnController --> ScoringService : toggles
    OrderController --> OrderRepository : delegates
    DashboardController --> ReturnRepository : reads
    DashboardController --> FraudScoreRepository : reads
    DashboardController --> ClusterService : reads

    RuleBasedScoringStrategy --> ReturnRepository : checks velocity
    RuleBasedScoringStrategy --> UserRepository : checks account
    RuleBasedScoringStrategy --> OrderRepository : checks order
    MLScoringStrategy --> ReturnRepository : features
    MLScoringStrategy --> UserRepository : features
    MLScoringStrategy --> OrderRepository : features
```

## Design Patterns Summary

| Pattern | Interface | Concrete Classes | Purpose |
|---------|-----------|-----------------|---------|
| Strategy | ScoringStrategy | RuleBasedScoringStrategy, MLScoringStrategy | Swappable fraud scoring algorithms |
| Observer | AlertObserver | WebSocketAlertObserver, LogAlertObserver | Decoupled real-time alerting on HIGH risk |
| Repository | — | UserRepository, OrderRepository, ReturnRepository, FraudScoreRepository | Isolated data access layer |
