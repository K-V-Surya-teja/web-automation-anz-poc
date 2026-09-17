import * as fs from "fs";
import * as xml2js from "xml2js";

async function generateEmailReport(
  xmlPath: string,
  outputHtmlPath: string,
  buildId?: string
) {
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");

  const parsed = await xml2js.parseStringPromise(xmlContent);

  const suite =
    parsed.testsuite ||
    parsed.testsuites?.testsuite?.[0];

  const testcases = suite.testcase || [];

  const totalTests = testcases.length;

  const passedTests = testcases.filter(
    (tc: any) => !tc.failure
  ).length;

  const failedTests = testcases.filter(
    (tc: any) => tc.failure
  ).length;

  const passPercentage =
    totalTests > 0
      ? ((passedTests / totalTests) * 100).toFixed(2)
      : "0";

  const executionTime = suite.$?.timestamp
  ? new Date(suite.$.timestamp).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }
    ) + " IST"
  : "N/A";


  const suiteDurationSeconds = Number(
    suite.$?.time || 0
  );

  const totalDuration =
    suiteDurationSeconds > 60
      ? `${Math.floor(
          suiteDurationSeconds / 60
        )}m ${(suiteDurationSeconds % 60).toFixed(0)}s`
      : `${suiteDurationSeconds.toFixed(2)}s`;

  const passPercentageColor =
    Number(passPercentage) >= 90
      ? "#28a745"
      : Number(passPercentage) >= 75
      ? "#ff9800"
      : "#dc3545";

  const collectionUri = process.env.COLLECTION_URI ?? "";
  const teamProject = process.env.TEAM_PROJECT ?? "";
  const buildIdValue = buildId ?? "N/A";
  const buildUrl =
    buildIdValue !== "N/A"
      ? `${collectionUri}${teamProject}/_build/results?buildId=${buildIdValue}`
      : "";

  const artifactsUrl =
    buildIdValue !== "N/A"
      ? `${collectionUri}${teamProject}/_build/results?buildId=${buildIdValue}&view=artifacts`
      : "";

  let html = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8"/>
<title>ANZ Web Automation Report</title>

<style>

body{
    margin:0;
    padding:20px;
    background:#f4f6f9;
    font-family:"Segoe UI",Arial,sans-serif;
}

.container{
    max-width:1600px;
    margin:auto;
}

.header{
    background:#0078d4;
    color:white;
    padding:25px;
    text-align:center;
    border-radius:8px;
    box-shadow:0 2px 8px rgba(0,0,0,0.15);
}

.header h1{
    margin:0;
}

.info-card{
    background:white;
    margin-top:20px;
    padding:15px 20px;
    border-radius:8px;
    box-shadow:0 2px 8px rgba(0,0,0,0.08);
}

.section-title{
    color:#333;
    margin-top:30px;
}

.summary-table,
.results-table{
    width:100%;
    border-collapse:collapse;
    background:white;
    margin-top:15px;
    margin-bottom:25px;
    border-radius:8px;
    overflow:hidden;
    box-shadow:0 2px 8px rgba(0,0,0,0.08);
}

.summary-table th{
    background:#0078d4;
    color:white;
    padding:14px;
}

.summary-table td{
    text-align:center;
    font-size:18px;
    padding:14px;
    font-weight:bold;
}

.results-table th{
    background:#0078d4;
    color:white;
    padding:12px;
}

.results-table td{
    border:1px solid #ddd;
    padding:10px;
    text-align:center;
}

.results-table tr:nth-child(even){
    background:#f8f9fa;
}

.failed-row{
    background:#fff3f3 !important;
}

.pass{
    color:#28a745;
    font-weight:bold;
}

.fail{
    color:#dc3545;
    font-weight:bold;
}

.error-card{
    background:#fff1f1;
    border-left:6px solid #dc3545;
    padding:15px;
    margin-bottom:15px;
    border-radius:5px;
    box-shadow:0 2px 6px rgba(0,0,0,0.08);
}

.error-card h3{
    color:#dc3545;
    margin-top:0;
}

pre{
    white-space:pre-wrap;
    word-wrap:break-word;
    font-family:Consolas, monospace;
}

.footer{
    text-align:center;
    margin-top:40px;
    color:#666;
    font-size:12px;
}

</style>

</head>

<body>

<div class="container">

<div class="header">
<h1>ANZ Web Automation Execution Report</h1>
</div>

<div class="info-card">
<p><strong>Build:</strong>
    <a href="${buildUrl}" target="_blank">${buildIdValue}</a> &nbsp;|&nbsp;
    <a href="${artifactsUrl}" target="_blank">View Artifacts</a>
</p>
<p><strong>Execution Time:</strong> ${executionTime}</p>
</div>

<table class="summary-table">

<tr>
<th>Total Tests</th>
<th>Passed</th>
<th>Failed</th>
<th>Pass Percentage</th>
<th>Total Duration</th>
</tr>

<tr>
<td>${totalTests}</td>

<td style="color:#28a745">
${passedTests}
</td>

<td style="color:#dc3545">
${failedTests}
</td>

<td style="color:${passPercentageColor}">
${passPercentage}%
</td>

<td>
${totalDuration}
</td>

</tr>

</table>

<h2 class="section-title">
Test Results
</h2>

<table class="results-table">

<tr>
<th>Test ID</th>
<th>Test Name</th>
<th>Status</th>
<th>Duration</th>
</tr>
`;

  testcases.forEach((tc: any, index: number) => {
    const testName =
      tc.$?.name || `Test ${index + 1}`;

    const failed = !!tc.failure;

    const duration =
      Number(tc.$?.time || 0).toFixed(2) + "s";

    html += `
<tr class="${failed ? "failed-row" : ""}">

<td>TC-${index + 1}</td>

<td>${testName}</td>

<td class="${failed ? "fail" : "pass"}">
${failed ? "FAIL" : "PASS"}
</td>

<td>${duration}</td>

</tr>
`;
  });




  const summary = {
  totalTests,
  passedTests,
  failedTests,
  passPercentage,
  totalDuration,
  executionTime,
  buildId: buildIdValue,
  buildUrl,
  artifactsUrl
  };

  fs.writeFileSync(
    "reports/email-summary.json",
    JSON.stringify(summary, null, 2)
  );

  fs.writeFileSync(outputHtmlPath, html);

  console.log(
    `Email report generated: ${outputHtmlPath}`
  );

  console.log(
    "Email summary generated: reports/email-summary.json"
  );
}

generateEmailReport(
  "reports/cucumber.xml",
  "reports/email-report.html",
  process.env.BUILD_BUILDID
).catch((error) => {
  console.error(error);
  process.exit(1);
});