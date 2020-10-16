import { Guild, Message } from "discord.js";
import Config from "../db/configuration/config";
import RoleService from "../db/roles/RoleService";
import Roles from "../db/roles/roles";
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

      if (GuildService.hasRole(message.guild, name)) {
        if (AllowedRoles.hasRole(name)) {
          message.reply(this.roleExistsText);
          return;
        }
        message.reply(this.roleExistsInServerText);
        //TODO reactions for yes no
        return;
      }

      if (AllowedRoles.hasRole(name)) {
        message.reply(this.roleIsRequestableButDeletedText(name));
        //TODO: reactions for yes no
        return;
      }

      this.RoleService.add(name).then((success) => {
        if (!success) {
          message.react("⚠");
          return;
        }

        Roles.fetchValues().then((done) => {
          //TODO: swap this out for update rules msg
          GuildService.createRole(guild, name).then((role) => {
            if (!role) {
              message.react("⚠");
              return;
            }

            GuildService.createChannel(guild, name).then((channel) => {
              if (!channel) {
                message.react("⚠");
                return;
              }
              message.react("👍");
              return;
            });
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

      //TODO: handle serrors and make this pretty
      GuildService.deleteRole(guild, name).then((success) => {
        GuildService.deleteChannel(guild, name).then((success) => {
          if (AllowedRoles.hasRole(name)) {
            this.RoleService.delete(name).then((success) => {
              Roles.fetchValues().then((done) => {
                //TODO: swap this out for update rules msg
                message.react("👍");
                return;
              });
            });
          } else {
            message.react("👍");
            return;
          }
        });
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
    ).toString()} type \`${Config.getValue("prefix")}accept\` to accept.`;
  }

  private static noPermissionsText =
    "You do not have permission to perform this command!";

  private static roleExistsText = "This role already exists!";

  private static roleExistsInServerText =
    "It seems like this role already exists! Do you want to allow requesting it?";

  private static roleIsRequestableButDeletedText(name: string): string {
    return `It seems like this role (or a smililarly named role) is already requestable. Proceeding will deny requesting of the other role(/s) and add the role  ${name} to the server. Continue?`;
  }

  private static noRoleText = "Could not find that role!";
}
