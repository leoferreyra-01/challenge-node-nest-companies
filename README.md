# 🚀 Companies API - Instructions & Documentation

## 📋 **Overview**

This is a NestJS-based REST API for managing companies and transactions, built following **Clean Architecture** and **Hexagonal Architecture** principles. The API provides secure endpoints for company management and transaction tracking with comprehensive business logic.

## 🏗️ **Architecture Decisions**

### **Why Clean Architecture?**
- **Separation of Concerns**: Business logic is isolated from infrastructure details
- **Testability**: Easy to unit test business rules without external dependencies
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Easy to swap implementations (e.g., database, external services)

### **Why Hexagonal Architecture (Ports & Adapters)?**
- **Ports**: Define contracts that business logic expects
- **Adapters**: Implement those contracts (e.g., PostgreSQL, MongoDB, Redis)
- **Dependency Inversion**: Business logic depends on abstractions, not concrete implementations

### **Why SOLID Principles?**
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable for their base types
- **Interface Segregation**: Clients don't depend on interfaces they don't use
- **Dependency Inversion**: High-level modules don't depend on low-level modules

## 🏛️ **Project Structure**

```
src/
├── application/           # Application Layer (Use Cases)
│   ├── use-cases/        # Business operations
│   └── application.module.ts
├── domain/               # Domain Layer (Core Business)
│   ├── entities/         # Business entities
│   ├── value-objects/    # Immutable values
│   └── repositories/     # Repository interfaces
├── infrastructure/        # Infrastructure Layer (External Concerns)
│   ├── controllers/      # HTTP endpoints
│   ├── repositories/     # Data access implementations
│   ├── guards/           # Authentication & authorization
│   └── infrastructure.module.ts
├── shared/               # Shared Components
│   ├── constants/        # Injection tokens
│   ├── dto/             # Data Transfer Objects
│   └── interfaces/       # Common interfaces
└── app.module.ts         # Root module
```

## 🔑 **Key Design Patterns**

### **Repository Pattern**
- Abstracts data access behind interfaces
- Business logic doesn't know about database details
- Easy to swap implementations (in-memory, PostgreSQL, MongoDB)

### **Use Case Pattern**
- Each business operation is encapsulated in a use case
- Orchestrates domain entities and repositories
- Single responsibility: one use case = one business operation

### **Dependency Injection**
- Uses NestJS's DI container with custom injection tokens
- Resolves circular dependencies through proper module organization
- Makes testing easier with mock implementations

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ 
- npm 9+

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Configuration**
Create a `.env` file in the root directory:
```env
# API Configuration
API_KEY=secured_apy_key_2025

# Server Configuration
PORT=3000
```

To get the api key you have to do the following.
1. Go to the following website: https://www.devglan.com/online-tools/text-encryption-decryption.
2. Paste the encrypted password given in the email on the **Enter text to be Decrypted** field.
3. Check **Decyption requires a custom secret key**.
4. Paste the candidate email on the **Enter Secret Key** field.
5. Copy the decypted key and use it as an API-KEY in swagger or use it on any curl petition.

### **3. Start Development Server**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### **4. Access Swagger Documentation**
Navigate to `http://localhost:3000/api` for interactive API documentation.

**Important**: Click the 🔒 **Authorize** button and enter your API key before testing endpoints.

## 🔐 **Authentication**

The API uses **X-API-Key** header authentication:
```bash
curl -H "X-API-Key: challenge-node-nest-companies-2025-secure-key" \
     http://localhost:3000/companies
```

**Alternative formats supported:**
- Header: `X-API-Key: <your-key>`
- Authorization: `Authorization: Bearer <your-key>`
- Query: `?apiKey=<your-key>`

## 📚 **Available Endpoints**

### **Companies**
- `POST /companies` - Create a new company
- `GET /companies/:id` - Get company by ID
- `GET /companies/with-transactions/last-month` - Companies with recent transactions
- `GET /companies/created/last-month` - Companies created recently

### **Transactions**
- `POST /transactions` - Create a new transaction

## 🧪 **Testing**

### **Run All Tests**
```bash
npm test
```

### **Run Tests with Coverage**
```bash
npm run test:cov
```

### **Run Tests in Watch Mode**
```bash
npm run test:watch
```

### **Test Architecture**
- **Unit Tests**: Test individual classes in isolation
- **Controller Tests**: Test HTTP endpoints with mocked dependencies
- **Integration Tests**: Test complete workflows (when needed)

### **Code Quality**
```bash
# Format code
npm run format

# Lint and fix issues
npm run lint --fix

# Check for unused dependencies
npm run check:deps
```

## 🚨 **Common Issues & Solutions**

### **Port Already in Use**
```bash
# Kill existing process
pkill -f "node.*dist/main"

# Or change port in .env
PORT=3001
```

### **API Key Not Working**
- Ensure `.env` file exists in root directory
- Verify `API_KEY` value matches your request
- Check that `ApiKeyGuard` is properly registered

### **Dependency Injection Errors**
- Verify injection tokens are properly defined
- Check module imports/exports
- Ensure circular dependencies are resolved

## 🌟 **Best Practices**

### **Code Organization**
- Keep domain entities pure (no external dependencies)
- Use DTOs for input validation and Swagger documentation
- Implement repository pattern for data access
- Use dependency injection for loose coupling

### **Error Handling**
- Use NestJS exception filters for consistent error responses
- Validate input with class-validator decorators
- Return meaningful error messages for debugging

### **Security**
- Always validate API keys
- Use DTOs for input sanitization
- Implement proper HTTP status codes
