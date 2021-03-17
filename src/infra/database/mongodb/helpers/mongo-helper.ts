import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();

    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri);
    }

    return this.client.db().collection(name);
  },

  mapping: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;

    return { id: _id, ...collectionWithoutId };
  }
};
