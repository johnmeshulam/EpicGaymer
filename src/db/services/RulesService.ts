import { Guild } from "discord.js";
import { RulesEntry } from "../../models/guild";
import GuildService from "../guilds/GuildService";

export default class RulesService {
  private service: GuildService;

  public constructor() {
    this.service = new GuildService();
  }

  public getRules(guild: Guild): Promise<RulesEntry> {
    return this.service.get(guild).then((entry) => {
      return entry.rules;
    });
  }

  public async updateMessageId(guild: Guild, newId: string): Promise<boolean> {
    const guildEntry = await this.service.get(guild);

    guildEntry.rules.messageId = newId;

    return this.service.update(guildEntry).then((success) => {
      return success;
    });
  }

  public async updateChannel(
    guild: Guild,
    newChannelName: string
  ): Promise<boolean> {
    const guildEntry = await this.service.get(guild);

    guildEntry.rules.channel = newChannelName;

    return this.service.update(guildEntry).then((success) => {
      return success;
    });
  }
}
