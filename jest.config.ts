export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.{ts,js}',
    '!**/*.decorator.{ts,js}',
    '!**/ports/*.{ts,js}',
    '!**/mappers/*.{ts,js}',
    '!**/core/config/*.{ts,js}',
    '!**/main.{ts,js}',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/../jest.setup.ts',
};
