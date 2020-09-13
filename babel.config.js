module.exports = {
  presets: ['@babel/preset-env'],
  ignore: ['**/*.spec.js', '**/*.test.js'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-modules-commonjs'
  ],
  sourceMaps: 'both'
}
