import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { CompanyType } from '../domain/entities/company.entity';

// Types for Lambda input/output
export interface CompanyRegistrationRequest {
  name: string;
  description?: string;
  industry: string;
  foundedYear: number;
  employeeCount: number;
  isActive: boolean;
  type: CompanyType;
  source: 'lambda' | 'api';
  requestId: string;
}

export interface CompanyRegistrationResponse {
  success: boolean;
  companyId?: string;
  message: string;
  validationErrors?: string[];
  requestId: string;
  timestamp: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Business validation rules
export class CompanyValidator {
  static validateCompanyData(
    data: CompanyRegistrationRequest,
  ): ValidationResult {
    const errors: string[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Company name is required');
    } else if (data.name.length > 100) {
      errors.push('Company name must be less than 100 characters');
    }

    // Industry validation
    if (!data.industry || data.industry.trim().length === 0) {
      errors.push('Industry is required');
    }

    // Founded year validation
    const currentYear = new Date().getFullYear();
    if (data.foundedYear < 1800 || data.foundedYear > currentYear) {
      errors.push(`Founded year must be between 1800 and ${currentYear}`);
    }

    // Employee count validation
    if (data.employeeCount < 0) {
      errors.push('Employee count cannot be negative');
    }

    // Company type validation
    if (!Object.values(CompanyType).includes(data.type)) {
      errors.push(
        `Invalid company type. Must be one of: ${Object.values(CompanyType).join(', ')}`,
      );
    }

    // Business rule validation
    if (data.type === CompanyType.PYME && data.employeeCount > 250) {
      errors.push('PYME companies cannot have more than 250 employees');
    }

    if (data.type === CompanyType.CORPORATE && data.employeeCount < 1000) {
      errors.push('Corporate companies must have at least 1000 employees');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Main Lambda handler
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log('Lambda function invoked:', {
    requestId: context.awsRequestId,
    event: JSON.stringify(event),
    timestamp: new Date().toISOString(),
  });

  try {
    // Parse and validate input
    if (!event.body) {
      return createErrorResponse(
        400,
        'Request body is required',
        context.awsRequestId,
      );
    }

    let requestBody: CompanyRegistrationRequest;
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return createErrorResponse(
        400,
        'Invalid JSON in request body',
        context.awsRequestId,
      );
    }

    // Add request metadata
    const companyRequest: CompanyRegistrationRequest = {
      ...requestBody,
      source: 'lambda',
      requestId: context.awsRequestId,
    };

    // Validate company data
    const validation = CompanyValidator.validateCompanyData(companyRequest);
    if (!validation.isValid) {
      return createErrorResponse(
        400,
        'Validation failed',
        context.awsRequestId,
        validation.errors,
      );
    }

    // Simulate company creation (in real implementation, this would call your API or database)
    const companyId = await simulateCompanyCreation(companyRequest);

    // Return success response
    const response: CompanyRegistrationResponse = {
      success: true,
      companyId,
      message: 'Company registered successfully via Lambda',
      requestId: context.awsRequestId,
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Lambda execution error:', error);
    return createErrorResponse(
      500,
      'Internal server error',
      context.awsRequestId,
    );
  }
};

// Helper function to create error responses
function createErrorResponse(
  statusCode: number,
  message: string,
  requestId: string,
  validationErrors?: string[],
): APIGatewayProxyResult {
  const response: CompanyRegistrationResponse = {
    success: false,
    message,
    validationErrors,
    requestId,
    timestamp: new Date().toISOString(),
  };

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    },
    body: JSON.stringify(response),
  };
}

// Simulate company creation (replace with actual API call or database operation)
async function simulateCompanyCreation(
  request: CompanyRegistrationRequest,
): Promise<string> {
  // In real implementation, this would:
  // 1. Call your NestJS API endpoint
  // 2. Or directly interact with your database
  // 3. Or use AWS SDK to call other services

  console.log('Simulating company creation for:', request.name);

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Generate a mock company ID (in real implementation, this would come from your system)
  const companyId = `lambda-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log('Company created with ID:', companyId);

  return companyId;
}

// CORS preflight handler
export const corsHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('CORS preflight handler invoked:', {
    event: JSON.stringify(event),
    timestamp: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    },
    body: '',
  };
};
