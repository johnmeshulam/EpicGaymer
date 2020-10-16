import { Guild, GuildChannel, GuildMember, Role } from "discord.js";
import Config from "../db/configuration/config";
import {
  ChannelNotFoundException,
  RoleNotFoundException,
  MemberNotFoundException
} from "../exceptions";

export default class GuildService {
  static getChannel(guild: Guild, name: string): GuildChannel {
    const channel = guild.channels.cache.find(
      (channel) => channel.name === name
    );
    if (!channel) throw new ChannelNotFoundException(name);
    return channel;
  }

  static hasRole(guild: Guild, name: string): boolean {
    try {
      this.getRole(guild, name);
      return true;
    } catch (e) {
      return false;
    }
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

  static createRole(guild: Guild, name: string): Promise<Role> {
    const color = Math.floor(Math.random() * 16777215).toString(16);

    return guild.roles.create({
      data: {
        name: name,
        color: color,
        hoist: false,
        position: 5, //TODO: smarter positioning
        permissions: "CHANGE_NICKNAME",
        mentionable: true
      }
    });
  }

  static createChannel(guild: Guild, name: string): Promise<GuildChannel> {
    const category: string = Config.getValue(guild, "game-category");
    const channelName: string = name.replace(/\s+/g, "-").toLowerCase();

    return guild.channels.create(channelName, {
      type: "text",
      parent: this.getChannel(guild, category),
      permissionOverwrites: [
        {
          id: this.getRole(guild, name).id,
          allow: ["VIEW_CHANNEL"]
        },
        {
          id: guild.roles.everyone.id,
          deny: ["VIEW_CHANNEL"]
        }
      ],
      position: 1
    });
  }

  static deleteRole(guild: Guild, name: string): Promise<boolean> {
    try {
      return this.getRole(guild, name)
        .delete()
        .then((role) => {
          return true;
        })
        .catch((error) => {
          console.log(`Failed to delete role ${name} from guild!`);
          return false;
        });
    } catch (error) {
      console.log(error.message);
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
  }

  static deleteChannel(guild: Guild, name: string): Promise<boolean> {
    const channelName: string = name.replace(/\s+/g, "-").toLowerCase();
    try {
      return this.getChannel(guild, channelName)
        .delete()
        .then((channel) => {
          return true;
        })
        .catch((error) => {
          console.log(`Failed to delete channel ${channelName} from guild!`);
          return false;
        });
    } catch (error) {
      console.log(error.message);
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
  }
}
