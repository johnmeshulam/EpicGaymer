import { Guild, Collection } from "discord.js";
import { GuildNotFoundException, NotFoundException } from "../../exceptions";
import GuildService from "../guilds/GuildService";
import ConfigurationEntry from "../../models/config";

export default class Config {
  private static options: Collection<
    string,
    Array<ConfigurationEntry>
  > = new Collection();
  private static service = new GuildService();

  public static getValue(guild: Guild, key: string): string {
    const configOptions = this.options.get(guild.id);
    if (!configOptions) throw new GuildNotFoundException(guild.name);
    const found = configOptions.find((option) => option.key === key);
    if (!found) throw new NotFoundException("config option", key);
    return found.value;
  }

  public static async fetchValues(guild: Guild): Promise<void> {
    this.service.get(guild).then((entry) => {
      this.options.delete(guild.id);
      this.options.set(guild.id, entry.configuration);
    });
  }

  public static async fetchAllValues(): Promise<void> {
    this.service.getAll().then((result) => {
      for (let element of result) {
        this.options.set(element.identifier, element.configuration);
      }
      console.log("Fetched config values from database!");
    });
  }
}
