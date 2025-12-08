# Water Tariff Management API Documentation

## Overview

The Water Tariff Management API is a comprehensive system for managing water billing with slab-based pricing, user management, location hierarchies, and approval workflows.

## Base URL

```
http://localhost:3000
```

## Interactive API Documentation

Once the application is running, visit:

```
http://localhost:3000/api-docs
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Swagger package (if not already installed)
npm install --save @nestjs/swagger
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=water_tariff
PORT=3000
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Response Format

All API responses follow a standardized format:

### Success Response

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2025-12-08T10:30:00.000Z",
  "path": "/api/endpoint"
}
```

## API Endpoints

### 1. Admins (`/admins`)

#### Get All Admins

```http
GET /admins
GET /admins?roleId=1
```

**Query Parameters:**

- `roleId` (optional): Filter by role ID

**Response:**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Admins retrieved successfully",
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "admin@example.com",
      "phone": "+8801712345678",
      "roleId": 1,
      "createdAt": "2025-12-08T10:00:00.000Z"
    }
  ]
}
```

#### Get Admin by ID

```http
GET /admins/:id
```

#### Create Admin

```http
POST /admins
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "admin@example.com",
  "phone": "+8801712345678",
  "password": "password123",
  "roleId": 1
}
```

#### Update Admin

```http
PUT /admins/:id
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "email": "newemail@example.com"
}
```

#### Delete Admin

```http
DELETE /admins/:id
```

#### Admin Login

```http
POST /admins/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "admin@example.com",
    "roleId": 1
  }
}
```

#### Change Password

```http
PUT /admins/:id/change-password
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

---

### 2. Users (`/users`)

#### Get All Users

```http
GET /users
GET /users?status=active
```

**Query Parameters:**

- `status` (optional): Filter by status (pending/active)

#### Get User by ID

```http
GET /users/:id
```

#### Create User

```http
POST /users
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "user@example.com",
  "phone": "+8801987654321",
  "address": "123 Main St",
  "meterNo": "MTR001",
  "zoneId": 1,
  "wardId": 1
}
```

**Note:** User status defaults to "pending" on creation.

#### Update User Status (Activate)

```http
PUT /users/:id/status
Content-Type: application/json

{
  "status": "active"
}
```

#### Update User

```http
PUT /users/:id
Content-Type: application/json

{
  "fullName": "Jane Smith Updated",
  "address": "456 Oak Ave"
}
```

#### Delete User

```http
DELETE /users/:id
```

---

### 3. Roles (`/roles`)

#### Get All Roles

```http
GET /roles
```

#### Get Role by ID

```http
GET /roles/:id
```

#### Create Role

```http
POST /roles
Content-Type: application/json

{
  "name": "Super Admin",
  "description": "Full system access"
}
```

#### Update Role

```http
PUT /roles/:id
```

#### Delete Role

```http
DELETE /roles/:id
```

---

### 4. City Corporations (`/city-corporations`)

#### Get All City Corporations

```http
GET /city-corporations
```

#### Get City Corporation by ID

```http
GET /city-corporations/:id
```

#### Create City Corporation

```http
POST /city-corporations
Content-Type: application/json

{
  "name": "Dhaka North City Corporation",
  "code": "DNCC"
}
```

#### Update City Corporation

```http
PUT /city-corporations/:id
```

#### Delete City Corporation

```http
DELETE /city-corporations/:id
```

---

### 5. Zones (`/zones`)

#### Get All Zones

```http
GET /zones
GET /zones?cityCorporationId=1
```

#### Create Zone

```http
POST /zones
Content-Type: application/json

{
  "name": "Zone 1",
  "code": "Z001",
  "tariffCategory": "residential",
  "cityCorporationId": 1
}
```

**Tariff Categories:**

- `residential`
- `commercial`
- `industrial`

---

### 6. Wards (`/wards`)

#### Get All Wards

```http
GET /wards
GET /wards?zoneId=1
```

#### Create Ward

```http
POST /wards
Content-Type: application/json

{
  "name": "Ward 1",
  "code": "W001",
  "tariffMultiplier": 1.2,
  "zoneId": 1
}
```

---

### 7. Tariff Plans (`/tariff-plans`)

Tariff plans define slab-based pricing structures for water billing.

#### Get All Tariff Plans

```http
GET /tariff-plans
GET /tariff-plans?approvalStatusId=2
```

#### Get Tariff Plan by ID

```http
GET /tariff-plans/:id
```

#### Create Tariff Plan

```http
POST /tariff-plans
Content-Type: application/json

{
  "name": "Residential Tariff 2025",
  "description": "Standard residential water tariff",
  "effectiveDate": "2025-01-01",
  "isActive": true,
  "approvalStatusId": 1,
  "slabs": [
    {
      "minUsage": 0,
      "maxUsage": 100,
      "baseRate": 10,
      "order": 1
    },
    {
      "minUsage": 100,
      "maxUsage": 200,
      "baseRate": 15,
      "order": 2
    },
    {
      "minUsage": 200,
      "maxUsage": null,
      "baseRate": 20,
      "order": 3
    }
  ]
}
```

**Slab Validation Rules:**

- First slab must start at 0
- Slabs must be continuous (next minUsage = previous maxUsage)
- Only the last slab can have `null` maxUsage (unlimited)
- Slabs must be in sequential order

#### Calculate Bill

```http
POST /tariff-plans/:id/calculate-bill
Content-Type: application/json

{
  "consumption": 250
}
```

**Response:**

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Bill calculated successfully",
  "data": {
    "totalAmount": 3250,
    "consumption": 250,
    "breakdown": [
      {
        "slab": "0-100",
        "units": 100,
        "rate": 10,
        "amount": 1000
      },
      {
        "slab": "100-200",
        "units": 100,
        "rate": 15,
        "amount": 1500
      },
      {
        "slab": "200+",
        "units": 50,
        "rate": 20,
        "amount": 1000
      }
    ]
  }
}
```

#### Approve Tariff Plan

```http
PUT /tariff-plans/:id/approve
Content-Type: application/json

{
  "approvedBy": 1,
  "comments": "Approved for 2025 fiscal year"
}
```

#### Reject Tariff Plan

```http
PUT /tariff-plans/:id/reject
Content-Type: application/json

{
  "rejectedBy": 1,
  "comments": "Rates need adjustment"
}
```

#### Update Tariff Plan

```http
PUT /tariff-plans/:id
```

#### Delete Tariff Plan

```http
DELETE /tariff-plans/:id
```

**Note:** Deleting a tariff plan cascades and deletes all associated slabs.

---

### 8. Approval Status (`/approval-status`)

#### Get All Approval Statuses

```http
GET /approval-status
```

**Default Statuses:**

- ID 1: Pending
- ID 2: Approved
- ID 3: Rejected

---

### 9. Approval Requests (`/approval-requests`)

Generic approval workflow management.

#### Get All Approval Requests

```http
GET /approval-requests
GET /approval-requests?statusId=1
```

#### Create Approval Request

```http
POST /approval-requests
Content-Type: application/json

{
  "entityType": "TariffPlan",
  "entityId": 5,
  "requestedBy": 2,
  "statusId": 1,
  "comments": "New tariff plan for review"
}
```

---

## Database Schema

### Entity Relationships

```
CityCorporation (1) ──→ (N) Zone
Zone (1) ──→ (N) Ward
Zone (1) ──→ (N) User
Ward (1) ──→ (N) User
Role (1) ──→ (N) Admin
TariffPlan (1) ──→ (N) TariffSlab
ApprovalStatus (1) ──→ (N) TariffPlan
ApprovalStatus (1) ──→ (N) ApprovalRequest
```

### Key Entities

1. **Admin**: System administrators with role-based access
2. **User**: Customer accounts with meter numbers and location
3. **Role**: Admin roles and permissions
4. **CityCorporation**: Top-level geographic division
5. **Zone**: Mid-level area with tariff categories
6. **Ward**: Granular location with tariff multipliers
7. **TariffPlan**: Parent entity for tariff pricing structure
8. **TariffSlab**: Individual consumption ranges and rates
9. **ApprovalStatus**: Lookup for approval states
10. **ApprovalRequest**: Generic approval tracking

## Authentication

Currently, the API uses admin login with email/password authentication. Password hashing is implemented using bcrypt with 10 salt rounds.

**Future Enhancements:**

- JWT token-based authentication
- Role-based access control (RBAC)
- API key authentication for external systems

## Error Handling

Common HTTP status codes:

- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input or validation error
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Validation Rules

### Admin

- Email must be valid format
- Password minimum 6 characters
- Phone number required
- Role ID must exist

### User

- Email must be unique
- Meter number must be unique
- Status defaults to "pending"
- Zone and Ward IDs must exist

### Tariff Plan

- Effective date required
- At least one slab required
- Slabs must follow continuity rules
- Only last slab can be unlimited

## Best Practices

1. **Always include proper headers:**

   ```http
   Content-Type: application/json
   ```

2. **Handle validation errors:**
   Check the error message for specific field validation issues.

3. **Use appropriate HTTP methods:**
   - GET for retrieval
   - POST for creation
   - PUT for updates
   - DELETE for removal

4. **Filter and query wisely:**
   Use query parameters to reduce response payload.

5. **Approval workflow:**
   - Create tariff plan with status "Pending"
   - Use approve/reject endpoints
   - Track changes through approval requests

## Testing

### Using cURL

```bash
# Get all admins
curl http://localhost:3000/admins

# Create admin
curl -X POST http://localhost:3000/admins \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Admin",
    "email": "test@example.com",
    "phone": "+8801234567890",
    "password": "password123",
    "roleId": 1
  }'

# Calculate bill
curl -X POST http://localhost:3000/tariff-plans/1/calculate-bill \
  -H "Content-Type: application/json" \
  -d '{"consumption": 250}'
```

### Using Postman

Import the API endpoints or use the Swagger documentation at `/api-docs` to generate requests.

## Support

For issues or questions, please contact the development team or refer to the Swagger documentation at `/api-docs`.

## Version History

- **v1.0.0** (2025-12-08): Initial release
  - Complete CRUD operations for all entities
  - Slab-based tariff calculation
  - Approval workflow system
  - Universal response format
  - API documentation with Swagger
