# 🚀 AWS Lambda Function - Company Registration

## 📋 Overview

This AWS Lambda function provides an alternative entry point for company registration, complementing your existing NestJS API. It's designed to handle high-volume company registration requests with serverless scalability and automatic validation.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   External      │    │   API Gateway    │    │   Lambda       │
│   Client        │───▶│   + CORS         │───▶│   Function     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   DynamoDB      │◀───│   Validation     │◀───│   Business     │
│   Companies     │    │   Layer          │    │   Logic        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Features

- **Serverless Architecture**: Automatic scaling based on demand
- **Input Validation**: Comprehensive business rule validation
- **Error Handling**: Detailed error responses with validation details
- **CORS Support**: Cross-origin request handling
- **Logging**: Structured logging for monitoring and debugging
- **Security**: IAM role-based access control
- **Integration Ready**: Designed to work with your existing NestJS API

## 📥 Input Format (JSON)

### Request Body
```json
{
  "name": "TechCorp Solutions",
  "description": "Innovative technology consulting firm",
  "industry": "Technology",
  "foundedYear": 2020,
  "employeeCount": 150,
  "isActive": true,
  "type": "PYME"
}
```

### Field Requirements

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `name` | string | ✅ | 1-100 characters |
| `description` | string | ❌ | Max 500 characters |
| `industry` | string | ✅ | Non-empty |
| `foundedYear` | number | ✅ | 1800-2025 |
| `employeeCount` | number | ✅ | ≥ 0 |
| `isActive` | boolean | ✅ | true/false |
| `type` | enum | ✅ | "PYME" or "CORPORATE" |

### Business Rules

- **PYME Companies**: Maximum 250 employees
- **Corporate Companies**: Minimum 1000 employees
- **Founded Year**: Must be between 1800 and current year

## 📤 Output Format (JSON)

### Success Response (201)
```json
{
  "success": true,
  "companyId": "lambda-1703123456789-abc123def",
  "message": "Company registered successfully via Lambda",
  "requestId": "aws-request-id-123",
  "timestamp": "2025-01-23T10:30:00.000Z"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Validation failed",
  "validationErrors": [
    "PYME companies cannot have more than 250 employees",
    "Founded year must be between 1800 and 2025"
  ],
  "requestId": "aws-request-id-123",
  "timestamp": "2025-01-23T10:30:00.000Z"
}
```

## 🔗 Integration Options

### Option 1: Direct Database Integration
The Lambda function can directly interact with your DynamoDB table, bypassing the NestJS API for high-performance scenarios.

```typescript
// In simulateCompanyCreation function
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const companyItem = {
  id: generateUUID(),
  ...request,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await dynamoDB.put({
  TableName: process.env.COMPANIES_TABLE,
  Item: companyItem
}).promise();
```

### Option 2: API Gateway Integration
The Lambda can call your existing NestJS API endpoint, maintaining consistency with your current system.

```typescript
// In simulateCompanyCreation function
const axios = require('axios');
const response = await axios.post(
  `${process.env.API_ENDPOINT}/companies`,
  request,
  {
    headers: {
      'X-API-KEY': process.env.API_KEY,
      'Content-Type': 'application/json'
    }
  }
);
return response.data.companyId;
```

### Option 3: Event-Driven Architecture
Use AWS EventBridge to trigger downstream processes after successful company registration.

```typescript
// After successful company creation
const eventBridge = new AWS.EventBridge();
await eventBridge.putEvents({
  Entries: [{
    Source: 'company.registration.lambda',
    DetailType: 'CompanyRegistered',
    Detail: JSON.stringify({
      companyId,
      companyData: request,
      timestamp: new Date().toISOString()
    }),
    EventBusName: 'default'
  }]
}).promise();
```

## 🚀 Deployment

### Prerequisites
- AWS CLI configured
- Node.js 18+ installed
- Serverless Framework installed globally

### Installation
```bash
# Install dependencies
npm install

# Install Serverless Framework globally
npm install -g serverless

# Install Serverless plugins
npm install --save-dev serverless-webpack serverless-offline webpack webpack-node-externals ts-loader
```

### Local Development
```bash
# Start local development server
npm run lambda:dev

# Test locally
curl -X POST http://localhost:3001/dev/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "industry": "Technology",
    "foundedYear": 2020,
    "employeeCount": 50,
    "isActive": true,
    "type": "PYME"
  }'
```

### Production Deployment
```bash
# Deploy to AWS
serverless deploy --stage prod

# Deploy specific function
serverless deploy function --function companyRegistration
```

## 🔐 Security & Permissions

### IAM Roles
The Lambda function uses the following IAM permissions:
- **CloudWatch Logs**: For logging and monitoring
- **DynamoDB**: For company data storage
- **SSM Parameter Store**: For configuration management
- **EventBridge**: For event publishing (optional)

### Environment Variables
```bash
NODE_ENV=production
API_ENDPOINT=https://your-api.com
API_KEY=your-api-key
COMPANIES_TABLE=companies-prod
```

## 📊 Monitoring & Logging

### CloudWatch Metrics
- Invocation count
- Duration
- Error rate
- Throttles

### Structured Logging
```json
{
  "level": "info",
  "message": "Company registration successful",
  "companyName": "TechCorp",
  "companyType": "PYME",
  "requestId": "aws-request-id-123",
  "timestamp": "2025-01-23T10:30:00.000Z",
  "duration": 150,
  "memoryUsed": "128MB"
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test:lambda
```

### Integration Tests
```bash
npm run test:lambda:integration
```

### Load Testing
```bash
# Using Artillery
artillery run load-test.yml
```

## 🔄 API Gateway Configuration

### CORS Settings
```yaml
cors:
  origin: '*'
  headers:
    - Content-Type
    - X-Amz-Date
    - Authorization
    - X-Api-Key
    - X-Amz-Security-Token
  methods:
    - POST
    - OPTIONS
```

### Request Validation
- JSON schema validation
- Required field checking
- Business rule validation

## 📈 Performance Considerations

### Cold Start Optimization
- Use Node.js 18.x runtime
- Minimize dependencies
- Lazy load heavy modules

### Memory Configuration
- **Development**: 128MB
- **Production**: 256MB-512MB (based on load)

### Timeout Settings
- **Default**: 30 seconds
- **Recommended**: 10 seconds for most use cases