import { MongoClient, Collection } from 'mongodb';

let client: MongoClient;

export const MongoHelper = {
  async connect(): Promise<void> {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },
  async disconnect(): Promise<void> {
    await client.close();
  },
  getCollection(name: string): Collection {
    return client.db().collection(name);
  },
  mapping(collection: any): any {
    const { _id: id, ...collectionWithoutId } = collection;

    const collectionFormatted = { id, ...collectionWithoutId };

    return collectionFormatted;
  }
};
