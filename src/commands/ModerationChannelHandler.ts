import { Guild, Message } from "discord.js";
import Config from "../db/configuration/config";
import RoleService from "../db/roles/RoleService";
import GuildService from "../guild/GuildService";
import MemberService from "../guild/MemberService";
import AllowedRoles from "../db/roles/roles";
import { parseCommand } from "../textUtils";

export class ModerationChannelHandler {
  private static RoleService = new RoleService();

  public static handleMessage(message: Message): void {
    const content = parseCommand(message.content);
    switch (content.command.toLowerCase()) {
      case "addrole":
        this.addRoleCommand(message, content.args);
        break;
      default:
        break;
    }
  }

  public static async addRoleCommand(message: Message, name: string) {
    try {
      if (!message.member || !message.guild) return;

      if (!MemberService.hasMemberRole(message.member)) {
        message.reply(this.needToAcceptText(message.guild));
        return;
      }

      if (!message.member.permissions.has("MANAGE_ROLES")) {
        message.reply(this.noPermissionsText);
        return;
      }

      if (GuildService.hasRole(message.guild, name)) {
        message.reply(this.roleExistsInServerText);
        return;
      }

      if (AllowedRoles.hasRole(name)) {
      }

      GuildService.createRole(message.guild, name).then((role) => {
        if (!role) {
          message.react("⚠");
          return;
        }
      });

      //TODO: create channel, set channel perms, update DB, fetch DB
    } catch (error) {
      message.react("⚠");
      console.error(error.message);
      console.log(error.stack);
    }
  }

  private static needToAcceptText(guild: Guild): string {
    return `Please accept the rules before using commannds! After reading ${GuildService.getChannel(
      guild,
      "rules"
    ).toString()} type \`${Config.getValue("prefix")}accept\` to accept.`;
  }

  private static noPermissionsText =
    "You do not have permission to perform this command!";

  private static roleExistsInServerText =
    "It seems like this role already exists! Do you want to allow requesting it?";
}
