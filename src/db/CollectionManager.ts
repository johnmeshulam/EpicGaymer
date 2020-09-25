import { Collection } from "mongodb";
import { DBManager } from "./db";

export class CollectionManager {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection(): Promise<Collection<any>> {
    return DBManager.getConnection().then((client) => {
      return client.db().collection(this.collectionName);
    });
  }

  protected mapDocToEntity = (document: any | null): any => {
    if (!!document) {
      const { _id, ...rest } = document;
      return {
        id: _id,
        ...rest
      };
    }
    return null;
  };

  protected mapDocsToEntities = (documents: any) =>
    documents.map(({ _id, ...rest }: any) => ({ id: _id, ...rest }));
}
