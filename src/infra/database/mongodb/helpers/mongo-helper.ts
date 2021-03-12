import { MongoClient } from 'mongodb';

let client: MongoClient;

export const MongoHelper = {
  async connect(): Promise<void> {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },
  async disconnect(): Promise<void> {
    await client.close();
  }
};
