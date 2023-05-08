import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';




const loader = new CheerioWebBaseLoader(
  'https://www.india.gov.in/topics/social-development/other-backward-classes',
  {
    selector: '.result-page',
  }
);

const rawDocs = await loader.load();



const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const docs = await textSplitter.splitDocuments(rawDocs)



const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
);



console.log(vectorStore)



