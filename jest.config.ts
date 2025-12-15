import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // 1. Compile TS with ts-jest, and JS with babel-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.m?js$': 'babel-jest',
  },

  // 2. CRITICAL: Tell Jest to compile 'franc' and its dependencies
  // (Usually Jest ignores everything in node_modules, this overrides that for specific folders)
  transformIgnorePatterns: [
    'node_modules/(?!(franc|iso-639-3|trigram-utils|n-gram|collapse-white-space)/)'
  ],

  // 3. Standard Setup
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  testMatch: ['**/tests/**/*.ts', '**/?(*.)+(spec|test).ts'],
};

export default config;