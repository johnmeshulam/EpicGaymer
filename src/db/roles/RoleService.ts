import { Role, Guild } from "discord.js";
import { RoleNotFoundException } from "../../exceptions";
import RoleEntry from "../../models/role";
import { createRoleString } from "../../utils/textUtils";
import GuildService from "../guilds/GuildService";

export default class RoleService {
  private service: GuildService;

  public constructor() {
    this.service = new GuildService();
  }

  public getAllRoles(guild: Guild): Promise<Array<RoleEntry>> {
    return this.service.get(guild).then((entry) => {
      return entry.roles;
    });
  }

  public getRole(guild: Guild, identifier: string): Promise<RoleEntry> {
    return this.service.get(guild).then((entry) => {
      const role = entry.roles.find((role) => role.identifier === identifier);
      if (!role) throw new RoleNotFoundException(identifier);
      return role;
    });
  }

  public async createRole(
    role: Role,
    requestable: boolean = false
  ): Promise<boolean> {
    const guildEntry = await this.service.get(role.guild);

    guildEntry.roles.push({
      identifier: role.id,
      requestable: requestable,
      displayName: role.name,
      name: createRoleString(role.name)
    });

    return this.service.update(guildEntry).then((success) => {
      return success;
    });
  }

  public async updateRole(role: Role, requestable?: boolean): Promise<boolean> {
    const guildEntry = await this.service.get(role.guild);

    const updateIndex = guildEntry.roles.findIndex(
      (roleItem) => roleItem.identifier === role.id
    );
    guildEntry.roles[updateIndex].displayName = role.name;
    guildEntry.roles[updateIndex].name = createRoleString(role.name);

    if (!(requestable === undefined))
      guildEntry.roles[updateIndex].requestable = requestable;

    return this.service.update(guildEntry).then((success) => {
      return success;
    });
  }

  public async deleteRole(role: Role): Promise<boolean> {
    const guildEntry = await this.service.get(role.guild);
    guildEntry.roles.splice(
      guildEntry.roles.findIndex((roleItem) => roleItem.identifier === role.id),
      1
    );

    return this.service.update(guildEntry).then((success) => {
      return success;
    });
  }

  public isRequestable(role: Role): Promise<boolean> {
    return this.getRole(role.guild, role.id).then((role) => {
      return role.requestable;
    });
  }
}
