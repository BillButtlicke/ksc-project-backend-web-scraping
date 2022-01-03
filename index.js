const cheerio = require("cheerio");
const fs = require("fs");
const express = require("express");
const json2csv = require("json2csv").Parser;
const axios = require("axios");
const app = express();
const urls = [
  "https://in.indeed.com/viewjob?jk=9eb9007330e17352&tk=1fo5rhfa1r2ak802&from=mobhp_jobfeed",
  "https://in.indeed.com/viewjob?jk=3f1e8383c1444b3d&tk=1fo63g1jn3d1p002&from=mobhp_jobfeed",
];
let indeedData = [];
function getJobs() {
  urls.forEach((url) => {
    axios(url).then((response) => {
      let html = response.data;
      let $ = cheerio.load(html);

      const title = $(
        'div[class="jobsearch-JobInfoHeader-title-container "] > h1'
      ).text();
      const salary = $(
        'div[class="jobsearch-JobMetadataHeader-item "] > span'
      ).text();
      const companyName = $(
        'div[class="jobsearch-CompanyInfoWithoutHeaderImage"] '
      ).text();
      indeedData.push({
        title,
        salary,
        companyName,
      });
      const j2cp = new json2csv();
      const csv = j2cp.parse(indeedData);
      return fs.writeFileSync("./indeed.csv", csv, "utf-8");
    });
  });
}
getJobs();

app.listen("3001", function () {
  console.log("Server running in port 3001");
});

module.exports = getJobs;
