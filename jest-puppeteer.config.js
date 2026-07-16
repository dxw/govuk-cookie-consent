module.exports = {
  /* Incognito is important as it forces tests to be run in isolation.
   * Running outside of incognito means parallel tests will conflict.
   */
  browserContext: 'incognito',
  launch: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // set headless to false if you want to see the tests running locally
    headless: true,
  },
};
