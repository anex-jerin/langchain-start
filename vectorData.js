import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Document } from 'langchain/document';
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

// console.log(docs)



const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX); 


await PineconeStore.fromDocuments(
  docs,
  new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
  }),
  {
    pineconeIndex,
  }
);


