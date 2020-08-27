module.exports = {
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '.',
        outputName: 'test_results.xml'
      }
    ]
  ]
}
