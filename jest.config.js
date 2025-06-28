export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  // Environnement pour Vite
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  // Permettre l'utilisation de import.meta.env
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:3000/api'
      }
    }
  }
};
