import { DeleteWriteOpResultObject, InsertOneWriteOpResult } from "mongodb";
import { createRoleIdentifier as createRoleName } from "../../textUtils";
import { CollectionManager } from "../CollectionManager";
import RoleEntry from "../../models/role";

export default class RoleManager extends CollectionManager {
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

  public get(identifier: string): Promise<RoleEntry> {
    return this.getCollection().then((collection) => {
      return collection.findOne({ identifier }).then(this.mapDocToEntity);
    });
  }

  public create(
    identifier: string,
    displayName: string,
    requestable: boolean = true
  ): Promise<boolean> {
    const name = createRoleName(displayName);

    return this.getCollection().then((collection) => {
      return collection
        .insertOne({ identifier, requestable, name, displayName })
        .then((result: InsertOneWriteOpResult<any>) => {
          if (result.result.ok === 1) return true;
          return false;
        });
    });
  }

  public delete(identifier: string): Promise<boolean> {
    //TODO: find out why this returns true when the object did not exist
    return this.getCollection().then((collection) => {
      return collection
        .deleteOne({ identifier })
        .then((result: DeleteWriteOpResultObject) => {
          if (result.result.ok === 1) return true;
          return false;
        });
    });
  }
}
