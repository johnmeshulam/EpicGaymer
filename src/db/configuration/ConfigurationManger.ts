import {
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult
} from "mongodb";

import { CollectionManager } from "../CollectionManager";
import ConfigurationEntry from "../../models/config";

export default class ConfigurationManager extends CollectionManager {
  public constructor() {
    super("configuration");
  }

  public getAll(): Promise<Array<ConfigurationEntry>> {
    return this.getCollection().then((collection) => {
      return collection
        .find({})
        .toArray()
        .then((array) => this.mapDocsToEntities(array));
    });
  }

  public get(key: string): Promise<ConfigurationEntry> {
    return this.getCollection().then((collection) => {
      return collection.findOne({ key: key }).then(this.mapDocToEntity);
    });
  }

  public update(key: string, newValue: string): Promise<boolean> {
    return this.getCollection().then((collection) => {
      return collection
        .findOneAndUpdate({ key: key }, { $set: { key, value: newValue } })
        .then((result: FindAndModifyWriteOpResultObject<any>) => {
          if (result.ok === 1) return true;
          return false;
        });
    });
  }

  public create(key: string, value: string): Promise<boolean> {
    return this.getCollection().then((collection) => {
      return collection
        .insertOne({ key, value })
        .then((result: InsertOneWriteOpResult<any>) => {
          if (result.result.ok === 1) return true;
          return false;
        });
    });
  }

  public delete(key: string): Promise<boolean> {
    return this.getCollection().then((collection) => {
      return collection
        .deleteOne({ key: key })
        .then((result: DeleteWriteOpResultObject) => {
          if (result.result.ok === 1) return true;
          return false;
        });
    });
  }
}
