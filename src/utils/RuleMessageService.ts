import { Guild } from "discord.js";
import Config from "../db/services/ConfigurationService.ts";
import RoleService from "../db/services/RoleService";
import RulesService from "../db/services/RulesService";
import GuildService from "./GuildService";

export default class RuleMessageService {
  public static async update(guild: Guild): Promise<void> {
    const channel = GuildService.getTextChannel(guild, "rules");
    const content = await this.generate(guild);
    const service = new RulesService();
    const messageId = await (await service.getRules(guild)).messageId;

    GuildService.getMessage(channel, messageId)
      .then((message) => {
        message.edit(content);
      })
      .catch((error) => {
        channel.send(content).then((sentMessage) => {
          if (!sentMessage.guild) return;
          service.updateMessageId(sentMessage.guild, sentMessage.id);
        });
      });
  }

  private static generate(guild: Guild): Promise<string> {
    const service = new RoleService();
    let content = this.startContent;

    return service.getAllRoles(guild).then((roles) => {
      for (const role of roles) {
        if (role.requestable) content = content.concat("✅" + role.displayName);
      }
      content = content.concat(this.endContent(guild));
      return content;
    });
  }

  private static startContent =
    "The current list of supported game roles: \n\n";

  private static endContent(guild: Guild): string {
    const prefix = Config.getValue(guild, "prefix");
    return `\nTo accept the rules, type \`${prefix}accept\` in \`#role-requests\`
  To request a game role, type \`${prefix}give <ROLENAME>\`
  To remove a game role, type \`${prefix}revoke <ROLENAME>\``;
  }
}
