import { Message, Guild } from "discord.js";
import Config from "../../config";
import GuildService from "../../guild/GuildService";
import MemberService from "../../guild/MemberService";
import AllowedRoles from "../../roles";
import { parseCommand } from "../../textUtils";

export class RoleChannelHandler {
  public static handleMessage(message: Message): void {
    const content = parseCommand(message.content);
    switch (content.command.toLowerCase()) {
      case "accept":
        this.acceptRulesCommand(message);
        break;
      case "give":
        this.giveRoleCommand(message, content.args);
        break;
      default:
        break;
    }
  }

  private static giveRoleCommand(message: Message, name: string): void {
    try {
      if (!message.member || !message.guild) return; //Need this for strong types even though its checked before

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

      if (!AllowedRoles.hasRole(name)) {
        message.react("🚫");
        return;
      }

      if (MemberService.hasRole(message.member, name)) {
        message.reply(this.alreadyHasRoleText(name));
        return;
      }

      MemberService.giveRole(
        message.member,
        GuildService.getRole(message.guild, name)
      );
      message.react("👍");
    } catch (error) {
      message.react("⚠");
      console.error(error.message);
    }
  }

  private static acceptRulesCommand(message: Message) {
    try {
      if (!message.member || !message.guild) return;

      if (MemberService.hasMemberRole(message.member)) {
        message.reply(this.alreadyAcceptedText);
        return;
      }

      MemberService.giveRole(
        message.member,
        GuildService.getRole(message.guild, "member")
      );
      message.react("👍");
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
    return `Please accept the rules before requesting a game role! After reading ${GuildService.getChannel(
      guild,
      "rules"
    ).toString()} type \`${Config.getValue("prefix")}accept\` to accept.`;
  }

  private static alreadyHasRoleText(name: string): string {
    return `You already have the role ${AllowedRoles.getRoleName(name)}!`;
  }

  private static alreadyAcceptedText = "You have already accepted the rules!";
}
