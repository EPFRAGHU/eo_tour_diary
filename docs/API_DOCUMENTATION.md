# EPFO EO Tour Diary - REST API Documentation

## Overview
This document specifies the RESTful API endpoints for the **EPFO Enforcement Officer (EO) Tour Diary & Field Inspection System**. All requests must include the JWT Authentication bearer token in the HTTP Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication & Session Management

### `POST /api/auth/login`
Authenticates an Enforcement Officer or Regional Administrator.

#### Request Body
```json
{
  "email": "rajesh.sharma@epfindia.gov.in",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "eo-101",
    "name": "Rajesh Sharma",
    "email": "rajesh.sharma@epfindia.gov.in",
    "designation": "Enforcement Officer (EO/AO)",
    "officeRegion": "RO Mumbai (Bandra)",
    "role": "EO"
  }
}
```

---

## 2. Monthly Tour Programs API

### `GET /api/tours`
Retrieves monthly tour programs for the authenticated officer.

#### Response (200 OK)
```json
[
  {
    "id": "tour-1",
    "officerId": "eo-101",
    "title": "Special Compliance Drive - Andheri East Zone",
    "purpose": "Inspection of 14B damages defaults & contract worker verification.",
    "month": 8,
    "year": 2026,
    "startDate": "2026-08-10",
    "endDate": "2026-08-14",
    "status": "APPROVED",
    "inspectionsCount": 4
  }
]
```

### `POST /api/tours`
Proposes a new monthly tour program itinerary.

#### Request Body
```json
{
  "title": "Routine Inspection Tour - MIDC Sector II",
  "purpose": "Verification of coverage eligibility under Sec 1(3)(b).",
  "month": 8,
  "year": 2026,
  "startDate": "2026-08-20",
  "endDate": "2026-08-22",
  "remarks": "Submitted for APFC approval"
}
```

---

## 3. Field Inspection Logs API

### `GET /api/inspections`
Retrieves field inspection visit logs.

### `POST /api/inspections`
Logs a new field inspection visit entry with optional GPS coordinates and photo URL.

#### Request Body
```json
{
  "tourId": "tour-1",
  "visitDate": "2026-08-11",
  "establishmentCode": "MH/BAN/0045231/000",
  "establishmentName": "Apex Logistics & Freight India Pvt Ltd",
  "location": "MIDC Andheri East, Mumbai",
  "inspectionPurpose": "Section 7A Enquiry Records Examination",
  "observations": "Examined attendance registers. Detected 18 non-enrolled contractual staff.",
  "conveyanceMode": "OWN_CAR",
  "distanceKm": 18.5,
  "gpsCoords": "Lat: 19.1197, Long: 72.9051",
  "status": "NON_COMPLIANT_FOUND"
}
```

---

## 4. Establishments Registry API

### `GET /api/establishments`
Queries establishment master records with optional search, coverage status, and district filters.

### `POST /api/establishments`
Registers a new establishment master record.

---

## 5. TA / DA Reimbursement Claims API

### `GET /api/claims`
Retrieves TA/DA reimbursement claims.

### `POST /api/claims`
Submits a TA/DA reimbursement claim bill for APFC verification.

---

## 6. Security Audit & Activity Stream API

### `GET /api/security/audit-logs`
Retrieves timestamped security audit logs (Admin/APFC restricted).
