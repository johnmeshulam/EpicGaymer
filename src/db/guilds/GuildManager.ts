import {
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult
} from "mongodb";
import { CollectionManager } from "../CollectionManager";
import RoleEntry from "../../models/role";
import GuildEntry from "../../models/guild";
import ConfigurationEntry from "../../models/config";

export default class GuildManager extends CollectionManager {
  public constructor() {
    super("guilds");
  }

  public getAll(): Promise<Array<GuildEntry>> {
    return this.getCollection().then((collection) => {
      return collection
        .find({})
        .toArray()
        .then((array) => this.mapDocsToEntities(array));
    });
  }

  public get(identifier: string): Promise<GuildEntry> {
    return this.getCollection().then((collection) => {
      return collection.findOne({ identifier }).then(this.mapDocToEntity);
    });
  }

  public create(
    identifier: string,
    roles: Array<RoleEntry>,
    configuration: Array<ConfigurationEntry>
  ): Promise<boolean> {
    return this.getCollection().then((collection) => {
      return collection
        .insertOne({ identifier, roles, configuration })
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

  public update(guildEntry: GuildEntry): Promise<boolean> {
    return this.getCollection().then((collection) => {
      return collection
        .findOneAndUpdate(
          { identifier: guildEntry.identifier },
          { $set: guildEntry }
        )
        .then((result: FindAndModifyWriteOpResultObject<any>) => {
          if (result.ok === 1) return true;
          return false;
        });
    });
  }
}
