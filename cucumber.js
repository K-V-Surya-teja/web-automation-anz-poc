require('dotenv').config();

module.exports = {
  web: {
    paths: ["features/**/*.feature"],

    require: [
      "steps/**/*.ts",
      'hooks/**/*.ts',
      "support/**/*.ts"],

    requireModule: ["tsx/cjs"],

    format: [
      "progress",
      "html:reports/web-cucumber-report.html",
      "allure-cucumberjs/reporter",
    ],

    formatOptions: { resultsDir: "allure-results" },

    parallel: Number(process.env.WEB_PARALLEL_WORKERS || 1),

    publishQuiet: true,
  },
};
