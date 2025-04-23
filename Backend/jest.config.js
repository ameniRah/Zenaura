module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Use Babel for JavaScript files
    },
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/test-setup.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    transformIgnorePatterns: ['/node_modules/'],
};