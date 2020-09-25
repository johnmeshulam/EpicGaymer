import { DeleteWriteOpResultObject, InsertOneWriteOpResult } from "mongodb";

import { CollectionManager } from "../CollectionManager";
import RoleEntry from "../../models/role";

export class ConfigurationManager extends CollectionManager {
  public constructor() {
    super("roles");
  }

  public getAll(): Promise<Array<RoleEntry>> {
    return this.getCollection().then((collection) => {
      return collection
        .find({})
        .toArray()
        .then((array) => this.mapDocsToEntities(array));
    });
  }

  public get(name: string): Promise<RoleEntry> {
    return this.getCollection().then((collection) => {
      return collection
        .findOne({ identifier: createIdentifier(name) })
        .then(this.mapDocToEntity);
    });
  }

  public create(name: string): Promise<boolean> {
    const identifier = createIdentifier(name);

    return this.getCollection().then((collection) => {
      return collection
        .insertOne({ name, identifier })
        .then((result: InsertOneWriteOpResult<any>) => {
          if (result.result.ok === 1) return true;
          return false;
        });
    });
  }

  public delete(name: string): Promise<boolean> {
    return this.getCollection().then((collection) => {
      return collection
        .deleteOne({ identifier: createIdentifier(name) })
        .then((result: DeleteWriteOpResultObject) => {
          if (result.result.ok === 1) return true;
          return false;
        });
    });
  }
}

function createIdentifier(name: string): string {
  return name.toLowerCase().replace(/\s/g, "");
}
