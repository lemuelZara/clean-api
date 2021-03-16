import { MongoClient, Collection } from 'mongodb';

let client: MongoClient;

export const MongoHelper = {
  async connect(uri: string): Promise<void> {
    client = await MongoClient.connect(uri, {
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
