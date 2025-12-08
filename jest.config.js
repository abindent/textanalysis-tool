module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.ts', '**/?(*.)+(spec|test).ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  };