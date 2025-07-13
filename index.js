
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  let timeStamps = [];

  for (let i = 0; i <= 100;) {
    if (timeStamps.length > 0) {
      await page.waitForSelector('a.morelink');
      await page.click('a.morelink');
    }
    const timeStamps30 = await page.$$eval('span.age', rows =>
      rows.map(row => row.getAttribute('title'))
    );
    timeStamps = [...timeStamps, ...timeStamps30];
    i = timeStamps.length;
  }
    timeStamps = timeStamps.slice(0, 101);

    const timeStampsToDate = timeStamps.map(ts => {
    const [iso, unix] = ts.split(' ');
    return new Date(unix * 1000);
  })

  const timeStampsSorted = [...timeStampsToDate].sort((a, b) => b - a);

  for(let i = 0; i < timeStampsToDate.length; i++) {
    if (timeStampsToDate[i] !== timeStampsSorted[i]) {
      console.log(`${i} ${timeStampsToDate[i]} not = ${timeStampsSorted[i]}`)
      return;
    }
  }
    console.log('sorted from newest to oldest')
  }

(async () => {
  await sortHackerNewsArticles();
})();

 
