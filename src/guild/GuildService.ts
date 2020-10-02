import { Channel, Guild, GuildMember, Role } from "discord.js";
import {
  ChannelNotFoundException,
  RoleNotFoundException,
  MemberNotFoundException
} from "../exceptions";

export default class GuildService {
  static getChannel(guild: Guild, name: string): Channel {
    const channel = guild.channels.cache.find(
      (channel) => channel.name === name
    );
    if (!channel) throw new ChannelNotFoundException(name);
    return channel;
  }

  static getRole(guild: Guild, name: string): Role {
    const role = guild.roles.cache.find(
      (role) => role.name.toLowerCase() === name.toLowerCase()
    );
    if (!role) throw new RoleNotFoundException(name);
    return role;
  }

  static getMember(guild: Guild, name: string): GuildMember {
    const member = guild.members.cache.find(
      (member) => member.nickname === name
    );
    if (!member) throw new MemberNotFoundException(name);
    return member;
  }
}
