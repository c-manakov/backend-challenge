module.exports = {
  verbose: true,
  reporters: [
      "default",
      ["./node_modules/jest-html-reporter", {
          "pageTitle": "Test Report"
      }]
  ]
}
