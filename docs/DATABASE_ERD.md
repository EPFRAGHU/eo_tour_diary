# EPFO EO Tour Diary - Database Entity-Relationship Diagram (ERD)

## Overview
The **EPFO EO Tour Diary** database is designed according to **Third Normal Form (3NF)** specifications in PostgreSQL using Prisma ORM.

---

## Visual Mermaid ER Diagram

```mermaid
erDiagram
    USER ||--o{ TOUR_PROGRAM : creates
    USER ||--o{ INSPECTION_LOG : conducts
    USER ||--o{ CLAIM_RECORD : submits
    USER ||--o{ AUDIT_LOG : generates

    ESTABLISHMENT ||--o{ INSPECTION_LOG : receives
    ESTABLISHMENT ||--o{ DOCUMENT_RECORD : stores
    ESTABLISHMENT ||--o{ FOLLOW_UP_ITEM : tracks
    ESTABLISHMENT ||--o{ CALL_LOG_ITEM : logs

    TOUR_PROGRAM ||--o{ INSPECTION_LOG : includes
    TOUR_PROGRAM ||--o{ CLAIM_RECORD : claims

    USER {
        string id PK
        string name
        string email UK
        string designation
        string officeRegion
        UserRole role
    }

    ESTABLISHMENT {
        string id PK
        string establishmentCode UK
        string name
        string location
        string district
        CoverageStatus coverageStatus
        string industryType
    }

    TOUR_PROGRAM {
        string id PK
        string officerId FK
        string title
        string purpose
        int month
        int year
        date startDate
        date endDate
        TourStatus status
    }

    INSPECTION_LOG {
        string id PK
        string tourId FK
        string establishmentCode FK
        string location
        string inspectionPurpose
        string observations
        InspectionStatus status
    }

    DOCUMENT_RECORD {
        string id PK
        string establishmentCode FK
        string title
        string category
        string folderPath
        FileFormatType fileFormat
        string currentVersion
    }

    FOLLOW_UP_ITEM {
        string id PK
        string establishmentCode FK
        date dueDate
        date nextVisitDate
        string priority
        string status
        string description
    }

    CLAIM_RECORD {
        string id PK
        string tourId FK
        string officerId FK
        decimal totalAmount
        decimal taAmount
        decimal daAmount
        decimal hotelAmount
        ClaimStatus status
    }
```

---

## Schema Table Summary

| Table Name | Primary Key | Foreign Keys | 3NF Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `id` | - | Officers & Regional Administrative Users |
| `establishments` | `id` | `establishmentCode` (Unique) | Master registry of covered & exempted establishments |
| `tour_programs` | `id` | `officerId` -> `users.id` | Monthly tour itineraries and approvals |
| `inspection_logs` | `id` | `tourId` -> `tour_programs.id`, `establishmentCode` -> `establishments.establishmentCode` | Field inspection log entries |
| `document_records` | `id` | `establishmentCode` -> `establishments.establishmentCode` | Digital document repository & versions |
| `follow_up_items` | `id` | `establishmentCode` -> `establishments.establishmentCode` | Pending compliance action items & reminders |
| `claim_records` | `id` | `tourId` -> `tour_programs.id`, `officerId` -> `users.id` | TA/DA travel reimbursement bills |
| `call_log_items` | `id` | `establishmentCode` -> `establishments.establishmentCode` | Employer liaison phone & WhatsApp logs |
| `audit_logs` | `id` | - | Immutable security audit trail |
