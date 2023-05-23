import { PineconeClient } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
  }),
  { pineconeIndex }
);


const model = new OpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.9,
});
const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
  k: 1,
  returnSourceDocuments: false,
});
const response = await chain.call({ query: '' });
console.log(response);

