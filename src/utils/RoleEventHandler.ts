import { Role } from "discord.js";
import RoleService from "../db/services/RoleService";
import RuleMessageService from "./RuleMessageService";

export default class RoleEventHandler {
  private static service = new RoleService();
  private static locked = false;

  public static handleDeleteEvent(role: Role) {
    if (!this.locked) {
      this.service.deleteRole(role);
      RuleMessageService.update(role.guild);
    }
  }

  public static handleUpdateEvent(role: Role) {
    if (!this.locked) this.service.updateRole(role);
  }

  public static handleCreateEvent(role: Role) {
    if (!this.locked) this.service.createRole(role);
  }

  public static lock() {
    this.locked = true;
  }

  public static unlock() {
    this.locked = false;
  }
}
