export default {
  testEnvironment: 'node',
  transform: {},
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
