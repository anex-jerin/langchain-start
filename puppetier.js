
import * as fs from 'fs'
import puppeteer from 'puppeteer';

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://www.india.gov.in/topics/social-development/other-backward-classes'
  );

  const name = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.result-page .views-row')).map(
      (x) => ({
        tittle: x.querySelector('.ext-link').textContent,
        details: x.querySelector('.field-content p').textContent,
        more: x.querySelector('.ext-link').getAttribute('href'),
      })
    );
  });

  console.log(name);

  fs.appendFile('file1.json', JSON.stringify(name), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  // always close the browser
  await browser.close();
}

start();
