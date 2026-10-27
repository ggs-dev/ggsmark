module.exports = {
  sourceType: 'unambiguous',
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '20'
        }
      }
    ]
  ],
  sourceMaps: 'both'
}
