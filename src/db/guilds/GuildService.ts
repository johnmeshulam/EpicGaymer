import { Guild } from "discord.js";
import { GuildNotFoundException } from "../../exceptions";
import { defaultConfiguration } from "../../models/config";
import GuildEntry from "../../models/guild";
import RoleEntry from "../../models/role";
import { createRoleString } from "../../utils/textUtils";
import GuildManager from "./GuildManager";

export default class GuildService {
  private manager: GuildManager;

  public constructor() {
    this.manager = new GuildManager();
  }

  public getAll(): Promise<Array<GuildEntry>> {
    return this.manager.getAll();
  }

  public get(guild: Guild): Promise<GuildEntry> {
    return this.manager.get(guild.id).then((entry) => {
      if (!entry) throw new GuildNotFoundException(guild.name);
      return entry;
    });
  }

  public async create(guild: Guild): Promise<boolean> {
    const identifier = guild.id;
    let roles: Array<RoleEntry> = [];
    const configuration = defaultConfiguration;

    guild.roles.cache.forEach((role) => {
      roles.push({
        identifier: role.id,
        requestable: false,
        displayName: role.name,
        name: createRoleString(role.name)
      });
    });

    return this.manager
      .create(identifier, roles, configuration)
      .then((success) => {
        return success;
      })
      .catch((error) => {
        return false;
      });
  }

  public delete(guild: Guild): Promise<boolean> {
    return this.manager
      .delete(guild.id)
      .then((success) => {
        return success;
      })
      .catch((error) => {
        console.error(
          `Problem deleting guild ${guild.name} from the database!`
        );
        console.log(error.stack);
        return false;
      });
  }

  public update(guildEntry: GuildEntry): Promise<boolean> {
    return this.manager
      .update(guildEntry)
      .then((success) => {
        return success;
      })
      .catch((error) => {
        console.error(`Problem updating guild ${guildEntry.identifier}!`);
        console.log(error.stack);
        return false;
      });
  }
}