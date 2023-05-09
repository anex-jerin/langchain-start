import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { config } from 'dotenv';
config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

const docs = await textSplitter.splitDocuments(rawDocs);

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
  })
);

console.log(vectorStore);
