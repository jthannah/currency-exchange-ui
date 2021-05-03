vueJest = require.resolve('vue-jest')
tsJest = require.resolve('ts-jest')

module.exports = {
  testMatch: [
    // "<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)",
    '<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lodash-es$': 'lodash',
  },
  reporters: ['default', 'jest-junit'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
  transform: {
    '^.+\\.vue$': vueJest,
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      'jest-transform-stub'
    ),
    '^.+\\.jsx?$': require.resolve('babel-jest'),
    '^.+\\.tsx?$': tsJest,
    '^.+\\.svg$': '<rootDir>/jest-svg-transform.js',
  },
  transformIgnorePatterns: ['/node_modules/'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      babelConfig: true,
    },
  },
  resetMocks: true,
}
