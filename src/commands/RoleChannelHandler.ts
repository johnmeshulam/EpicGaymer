import { Message, Guild, Role } from "discord.js";
import { request } from "http";
import Config from "../db/configuration/config";
import RoleService from "../db/roles/RoleService";
import GuildService from "../guild/GuildService";
import MemberService from "../guild/MemberService";
import { parseCommand } from "../textUtils";

export class RoleChannelHandler {
  static roleService = new RoleService();

  public static handleMessage(message: Message): void {
    const content = parseCommand(message.content);
    switch (content.command.toLowerCase()) {
      case "accept":
        this.acceptRulesCommand(message);
        break;
      case "give":
        this.giveRoleCommand(message, content.args);
        break;
      case "revoke":
        this.revokeRoleCommand(message, content.args);
        break;
      default:
        break;
    }
  }

  private static giveRoleCommand(message: Message, name: string): void {
    try {
      if (!message.member || !message.guild) return;

      if (!MemberService.hasMemberRole(message.member)) {
        message.reply(this.needToAcceptText(message.guild));
        return;
      }

      if (!name) {
        message.reply(this.needRoleNameMessage);
        return;
      }

      if (!GuildService.hasRole(message.guild, name)) {
        message.reply(this.roleNotFoundMessage(message.guild));
        return;
      }

      const role = GuildService.getRole(message.guild, name);
      this.roleService.isRequestable(role.id).then((requestable) => {
        if (!requestable) {
          message.react("🚫");
          return;
        } else {
          if (!message.member) return;
          if (MemberService.hasRole(message.member, role)) {
            message.reply(this.alreadyHasRoleText(role));
            return;
          }

          MemberService.giveRole(message.member, role).then(() =>
            message.react("👍")
          );
        }
      });
    } catch (error) {
      message.react("⚠");
      console.error(error.message);
      console.error(error.stack);
    }
  }

  private static revokeRoleCommand(message: Message, name: string) {
    try {
      if (!message.member || !message.guild) return;

      if (!MemberService.hasMemberRole(message.member)) {
        message.reply(this.needToAcceptText(message.guild));
        return;
      }

      if (!GuildService.hasRole(message.guild, name)) {
        message.reply(this.roleNotFoundMessage(message.guild));
        return;
      }

      const role = GuildService.getRole(message.guild, name);

      if (!MemberService.hasRole(message.member, role)) {
        message.reply(this.doesNotHaveRoleText(role));
        return;
      }

      this.roleService.isRequestable(role.id).then((requestable) => {
        if (!requestable) {
          message.react("🚫");
          return;
        } else {
          if (!message.member) return;
          MemberService.removeRole(message.member, role).then(() =>
            message.react("👍")
          );
        }
      });
    } catch (error) {
      message.react("⚠");
      console.error(error.message);
      console.log(error.stack);
    }
  }

  private static acceptRulesCommand(message: Message) {
    try {
      if (!message.member || !message.guild) return;

      if (MemberService.hasMemberRole(message.member)) {
        message.reply(this.alreadyAcceptedText);
        return;
      }

      const memberRole = GuildService.getRole(message.guild, "member");

      MemberService.giveRole(message.member, memberRole).then(() =>
        message.react("👍")
      );
    } catch (error) {
      message.react("⚠");
      console.error(error.message);
    }
  }

  private static needRoleNameMessage =
    "Please type the name of the role you are requesting!";

  private static roleNotFoundMessage(guild: Guild) {
    return `Could not find that role! Please check ${GuildService.getChannel(
      guild,
      "rules"
    ).toString()} for a list of available roles!`;
  }

  private static needToAcceptText(guild: Guild): string {
    return `Please accept the rules before using commannds! After reading ${GuildService.getChannel(
      guild,
      "rules"
    ).toString()} type \`${Config.getValue("prefix")}accept\` to accept.`;
  }

  private static alreadyHasRoleText(role: Role): string {
    return `You already have the role ${role.name}!`;
  }

  private static doesNotHaveRoleText(role: Role): string {
    return `You do not have the role ${role.name}!`;
  }

  private static alreadyAcceptedText = "You have already accepted the rules!";
}
