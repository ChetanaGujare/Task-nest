module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/config/db.js',
    ],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    forceExit: true,
    detectOpenHandles: true,
    testTimeout: 10000,
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
};