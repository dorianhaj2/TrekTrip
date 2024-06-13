// jest.config.js
module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '<rootDir>/node_modules/(?!axios)', // Add other modules if needed
    ],
  };
  