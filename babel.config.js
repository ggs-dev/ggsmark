module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        }
      }
    ]
  ],
  sourceMaps: 'both',
  plugins: ['add-module-exports']
}
