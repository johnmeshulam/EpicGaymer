import {
  Guild,
  Channel,
  GuildChannel,
  GuildMember,
  Role,
  TextChannel,
  Message
} from "discord.js";
import Config from "../db/services/ConfigurationService.ts";
import {
  ChannelNotFoundException,
  RoleNotFoundException,
  MemberNotFoundException,
  NotFoundException
} from "../exceptions";

export default class GuildService {
  static getTextChannel(guild: Guild, name: string): TextChannel {
    const channel = guild.channels.cache.find(
      (channel) => channel.name === name
    );
    if (!channel) throw new ChannelNotFoundException(name);
    if (channel instanceof TextChannel) return channel;
    throw new TypeError("Channel is not a text channel!");
  }

  static getMessage(channel: TextChannel, messageId: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      channel.messages
        .fetch(messageId)
        .then((message) => resolve(message))
        .catch((err) => reject(new NotFoundException("message", messageId)));
    });
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
      parent: this.getTextChannel(guild, category),
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

  static deleteRole(guild: Guild, name: string): Promise<Role> {
    try {
      return this.getRole(guild, name)
        .delete()
        .then((role) => {
          return role;
        })
        .catch((error) => {
          throw new Error(
            `Error while deleting role ${name} from guild ${guild.name}`
          );
        });
    } catch (error) {
      return new Promise((resolve, reject) => {
        resolve(undefined);
      });
    }
  }

  static deleteChannel(guild: Guild, name: string): Promise<Channel> {
    const channelName: string = name.replace(/\s+/g, "-").toLowerCase();

    try {
      return this.getTextChannel(guild, channelName)
        .delete()
        .then((channel) => {
          return channel;
        })
        .catch((error) => {
          throw new Error(
            `Error while deleting channel ${name} from guild ${guild.name}`
          );
        });
    } catch (error) {
      return new Promise((resolve, reject) => {
        resolve(undefined);
      });
    }
  }
}
