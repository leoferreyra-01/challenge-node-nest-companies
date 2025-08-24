import { handler } from '../company-registration-lambda';
import { CompanyValidator } from '../company-registration-lambda';
import { CompanyType } from '../../domain/entities/company.entity';

// Mock AWS Lambda types
const createMockEvent = (body: any) => ({
  body: JSON.stringify(body),
  headers: {},
  httpMethod: 'POST',
  path: '/companies',
  queryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: '',
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
  isBase64Encoded: false,
});

const createMockContext = () => ({
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'company-registration-lambda',
  functionVersion: '$LATEST',
  invokedFunctionArn:
    'arn:aws:lambda:us-east-1:123456789012:function:company-registration-lambda',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id-123',
  logGroupName: '/aws/lambda/company-registration-lambda',
  logStreamName: '2025/01/23/[$LATEST]abc123def',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
});

describe('Company Registration Lambda', () => {
  describe('CompanyValidator', () => {
    it('should validate a valid PYME company', () => {
      const validCompany = {
        name: 'Test Company',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 50,
        isActive: true,
        type: CompanyType.PYME,
      };

      const result = CompanyValidator.validateCompanyData(validCompany as any);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid Corporate company', () => {
      const validCompany = {
        name: 'Large Corp',
        industry: 'Manufacturing',
        foundedYear: 1990,
        employeeCount: 1500,
        isActive: true,
        type: CompanyType.CORPORATE,
      };

      const result = CompanyValidator.validateCompanyData(validCompany as any);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject PYME company with too many employees', () => {
      const invalidCompany = {
        name: 'Large PYME',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 300,
        isActive: true,
        type: CompanyType.PYME,
      };

      const result = CompanyValidator.validateCompanyData(
        invalidCompany as any,
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'PYME companies cannot have more than 250 employees',
      );
    });

    it('should reject Corporate company with too few employees', () => {
      const invalidCompany = {
        name: 'Small Corp',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 500,
        isActive: true,
        type: CompanyType.CORPORATE,
      };

      const result = CompanyValidator.validateCompanyData(
        invalidCompany as any,
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Corporate companies must have at least 1000 employees',
      );
    });

    it('should reject company with invalid founded year', () => {
      const invalidCompany = {
        name: 'Old Company',
        industry: 'Technology',
        foundedYear: 1700,
        employeeCount: 50,
        isActive: true,
        type: CompanyType.PYME,
      };

      const result = CompanyValidator.validateCompanyData(
        invalidCompany as any,
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Founded year must be between 1800 and 2025',
      );
    });

    it('should reject company with missing required fields', () => {
      const invalidCompany = {
        name: '',
        industry: '',
        foundedYear: 2020,
        employeeCount: 50,
        isActive: true,
        type: CompanyType.PYME,
      };

      const result = CompanyValidator.validateCompanyData(
        invalidCompany as any,
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Company name is required');
      expect(result.errors).toContain('Industry is required');
    });
  });

  describe('Lambda Handler', () => {
    it('should successfully register a valid company', async () => {
      const validCompany = {
        name: 'Test Company',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 50,
        isActive: true,
        type: CompanyType.PYME,
      };

      const event = createMockEvent(validCompany);
      const context = createMockContext();

      const result = await handler(event as any, context as any);

      expect(result.statusCode).toBe(201);
      expect(result.body).toBeDefined();

      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.companyId).toBeDefined();
      expect(responseBody.message).toBe(
        'Company registered successfully via Lambda',
      );
      expect(responseBody.requestId).toBe('test-request-id-123');
    });

    it('should return 400 for invalid company data', async () => {
      const invalidCompany = {
        name: 'Test Company',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 300, // Too many for PYME
        isActive: true,
        type: CompanyType.PYME,
      };

      const event = createMockEvent(invalidCompany);
      const context = createMockContext();

      const result = await handler(event as any, context as any);

      expect(result.statusCode).toBe(400);
      expect(result.body).toBeDefined();

      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Validation failed');
      expect(responseBody.validationErrors).toContain(
        'PYME companies cannot have more than 250 employees',
      );
    });

    it('should return 400 for missing request body', async () => {
      const event = {
        ...createMockEvent({}),
        body: undefined,
      };
      const context = createMockContext();

      const result = await handler(event as any, context as any);

      expect(result.statusCode).toBe(400);
      expect(result.body).toBeDefined();

      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Request body is required');
    });

    it('should return 400 for invalid JSON', async () => {
      const event = {
        ...createMockEvent({}),
        body: 'invalid json {',
      };
      const context = createMockContext();

      const result = await handler(event as any, context as any);

      expect(result.statusCode).toBe(400);
      expect(result.body).toBeDefined();

      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Invalid JSON in request body');
    });

    it('should include CORS headers in response', async () => {
      const validCompany = {
        name: 'Test Company',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 50,
        isActive: true,
        type: CompanyType.PYME,
      };

      const event = createMockEvent(validCompany);
      const context = createMockContext();

      const result = await handler(event as any, context as any);

      expect(result.headers).toBeDefined();
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers['Content-Type']).toBe('application/json');
    });
  });
});
