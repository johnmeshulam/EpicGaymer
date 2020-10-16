import { Guild, Message } from "discord.js";
import Config from "../db/configuration/ConfigurationService.ts";
import RoleService from "../db/roles/RoleService";
import GuildService from "../utils/GuildService";
import MemberService from "../utils/MemberService";
import { parseCommand } from "../utils/textUtils";

export class ModerationChannelHandler {
  private static roleService = new RoleService();

  public static handleMessage(message: Message): void {
    const content = parseCommand(message.content);
    switch (content.command.toLowerCase()) {
      case "addrole":
        this.addRoleCommand(message, content.args);
        break;
      case "delrole":
        this.deleteRoleCommand(message, content.args);
        break;
      default:
        break;
    }
  }

  public static async addRoleCommand(message: Message, name: string) {
    try {
      if (!message.member || !message.guild) return;
      let guild = message.guild;

      if (!MemberService.hasMemberRole(message.member)) {
        message.reply(this.needToAcceptText(message.guild));
        return;
      }

      if (!message.member.permissions.has("MANAGE_ROLES")) {
        message.reply(this.noPermissionsText);
        return;
      }

      if (GuildService.hasRole(guild, name)) {
        message.reply(this.roleExistsText);
        return;
      }

      GuildService.createRole(guild, name).then((role) => {
        if (!role) {
          message.react("⚠");
          return;
        }

        this.roleService.createRole(role, true).then((success) => {
          GuildService.createChannel(guild, name).then((channel) => {
            if (!channel) {
              message.react("⚠");
              return;
            }

            //TODO: update the rules mesage here
            message.react("👍");
            return;
          });
        });
      });
    } catch (error) {
      message.react("⚠");
      console.error(error.message);
      console.log(error.stack);
    }
  }

  public static async deleteRoleCommand(message: Message, name: string) {
    try {
      if (!message.member || !message.guild) return;
      let guild = message.guild;

      if (!MemberService.hasMemberRole(message.member)) {
        message.reply(this.needToAcceptText(message.guild));
        return;
      }

      if (!message.member.permissions.has("MANAGE_ROLES")) {
        message.reply(this.noPermissionsText);
        return;
      }

      if (!GuildService.hasRole(guild, name)) {
        message.reply(this.noRoleText);
        return;
      }

      GuildService.deleteRole(guild, name)
        .then((role) => {
          this.roleService.deleteRole(role).then((success) => {
            GuildService.deleteChannel(guild, name)
              .then((channel) => {
                //TODO: update the rules message here
                message.react("👍");
                return;
              })
              .catch((error) => {
                message.react("⚠");
                return;
              });
          });
        })
        .catch((error) => {
          message.react("⚠");
          return;
        });
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
    ).toString()} type \`${Config.getValue(
      guild,
      "prefix"
    )}accept\` to accept.`;
  }

  private static noPermissionsText =
    "You do not have permission to perform this command!";

  private static roleExistsText = `This role already exists! If you want to allow requesting it, use \`+allow <roleName>\``;

  private static noRoleText = "Could not find that role!";
}
