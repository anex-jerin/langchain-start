import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import * as fs from 'fs';


const loader = new CheerioWebBaseLoader(
  'https://www.india.gov.in/topics/social-development/other-backward-classes',
  {
    selector: '.result-page',
  }
);



const docs = await loader.load();
let set = docs[0]
console.log(set.pageContent);

fs.writeFile('data.txt', set.pageContent, function (err) {
  if (err) return console.log(err);
  console.log('Wrote Hello World in file helloworld.txt, just check it');
});
// console.log(docs)


