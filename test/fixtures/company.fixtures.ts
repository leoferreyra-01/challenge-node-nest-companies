export const CompanyFixtures = {
  // Valid company data for testing
  validCompany: {
    name: 'TechCorp Solutions',
    description: 'Innovative technology company specializing in AI solutions',
    industry: 'Technology',
    foundedYear: 2020,
    employeeCount: 150,
    isActive: true,
    type: 'PYME' as const,
  },

  // Company with minimal required fields
  minimalCompany: {
    name: 'Minimal Corp',
    industry: 'Finance',
    foundedYear: 2023,
    employeeCount: 10,
    isActive: true,
    type: 'PYME' as const,
  },

  // Company for enterprise testing
  enterpriseCompany: {
    name: 'Enterprise Solutions Inc',
    description: 'Large enterprise company with global presence',
    industry: 'Consulting',
    foundedYear: 1995,
    employeeCount: 2500,
    isActive: true,
    type: 'CORPORATE' as const,
  },

  // Invalid company data for negative testing
  invalidCompany: {
    name: '', // Empty name should fail validation
    description: 'This company has an invalid name',
    industry: 'Technology',
    foundedYear: 1800, // Too old
    employeeCount: -5, // Negative employees
    isActive: true,
    type: 'PYME' as const,
  },

  // Company with boundary values
  boundaryCompany: {
    name: 'Boundary Test Corp',
    description: 'A'.repeat(501), // Exceeds max length
    industry: 'B'.repeat(101), // Exceeds max length
    foundedYear: 2026, // Future year
    employeeCount: 0, // Zero employees
    isActive: true,
    type: 'PYME' as const,
  },
};
