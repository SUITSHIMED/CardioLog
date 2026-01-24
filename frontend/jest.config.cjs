module.exports = {
  testEnvironment: "jsdom",
  testMatch: [
    "**/tests/**/*.test.js"
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native)/)",
  ],
};
