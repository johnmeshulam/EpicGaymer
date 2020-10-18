import { Guild, Message, PermissionResolvable } from "discord.js";
import Config from "../db/services/ConfigurationService.ts";
import RoleService from "../db/services/RoleService";
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
      case "allow":
        this.allowOrDenyRoleCommand(message, content.args, true);
        break;
      case "deny":
        this.allowOrDenyRoleCommand(message, content.args, false);
        break;
      default:
        break;
    }
  }

  public static async allowOrDenyRoleCommand(
    message: Message,
    name: string,
    allow: boolean
  ) {
    if (!message.member || !message.guild) return;
    let guild = message.guild;

    if (!this.premissionCheck(message, "MANAGE_ROLES")) return;

    if (!GuildService.hasRole(guild, name)) {
      message.reply(this.noRoleText);
      return;
    }

    const role = await GuildService.getRole(guild, name);
    const currentState = await this.roleService.isRequestable(role);

    if (allow === currentState) {
      if (allow) message.reply(this.alreadyAllowedText);
      else message.reply(this.alreadyDeniedText);
      return;
    }

    this.roleService
      .updateRequestable(role, allow)
      .then((success) => {
        message.react("👍");
        return;
      })
      .catch((error) => {
        message.react("⚠");
        return;
      });
  }

  public static async addRoleCommand(message: Message, name: string) {
    if (!message.member || !message.guild) return;
    let guild = message.guild;

    if (!this.premissionCheck(message, "MANAGE_ROLES")) return;

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
  }

  public static async deleteRoleCommand(message: Message, name: string) {
    if (!message.member || !message.guild) return;
    let guild = message.guild;

    if (!this.premissionCheck(message, "MANAGE_ROLES")) return;

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
  }

  private static premissionCheck(
    message: Message,
    permissions: PermissionResolvable
  ): boolean {
    if (!message.member || !message.guild) return false;

    if (!MemberService.hasMemberRole(message.member)) {
      message.reply(this.needToAcceptText(message.guild));
      return false;
    }

    if (!message.member.permissions.has(permissions)) {
      message.reply(this.noPermissionsText);
      return false;
    }

    return true;
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

  private static alreadyAllowedText = "This role is already allowed!";

  private static alreadyDeniedText = "This role is already denied!";
}
