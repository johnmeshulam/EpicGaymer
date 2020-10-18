import { Role } from "discord.js";
import RoleService from "../db/services/RoleService";
import RuleMessageService from "./RuleMessageService";

export default class RoleEventHandler {
  private static service = new RoleService();

  public static handleDeleteEvent(role: Role) {
    this.service.deleteRole(role);
    RuleMessageService.update(role.guild);
  }

  public static handleUpdateEvent(role: Role) {
    this.service.updateRole(role);
  }

  public static handleCreateEvent(role: Role) {
    this.service.createRole(role);
  }
}
