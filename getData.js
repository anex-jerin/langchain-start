import * as fs from 'fs';

import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';

const loader = new PuppeteerWebBaseLoader(
  'https://www.india.gov.in/topics/social-development/other-backward-classes',
  {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
    },
    async evaluate(page) {
      const result = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('.result-page .views-row')
        ).map((x) => ({
          tittle: x.querySelector('.ext-link').textContent,
          details: x.querySelector('.field-content p').textContent,
        }));
      });
      return result;
    },
  }
);

const docs = await loader.load();

// fs.appendFile('file1.json', JSON.stringify(docs), function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });
console.log(docs);
