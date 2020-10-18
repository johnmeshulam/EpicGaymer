import { Role } from "discord.js";
import RoleService from "../db/services/RoleService";

export default class RoleEventHandler {
  private static service = new RoleService();

  public static handleDeleteEvent(role: Role) {
    this.service.deleteRole(role);
    //TODO: update rules msg
  }

  public static handleUpdateEvent(role: Role) {
    this.service.updateRole(role);
  }

  public static handleCreateEvent(role: Role) {
    this.service.createRole(role);
  }
}
