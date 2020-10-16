import { Role } from "discord.js";
import { Collection } from "discord.js";
import RoleEntry from "../../models/role";
import RoleManager from "./RoleManager";

export default class RoleService {
  //TODO: error handling for all of this
  private manager: RoleManager;

  public constructor() {
    this.manager = new RoleManager();
  }

  public create(role: Role): Promise<boolean> {
    return this.manager
      .create(role.id, role.name)
      .then((success) => {
        return success;
      })
      .catch((error) => {
        console.error(`Problem adding role ${role.name} to the database!`);
        console.log(error.stack);
        return false;
      });
  }

  public delete(role: Role): Promise<boolean> {
    return this.manager
      .delete(role.id)
      .then((success) => {
        return success;
      })
      .catch((error) => {
        console.error(`Problem deleting role ${role.name} from the database!`);
        console.log(error.stack);
        return false;
      });
  }

  public isRequestable(identifier: string): Promise<boolean> {
    return this.manager.get(identifier).then((role) => {
      return role.requestable;
    });
  }
}
