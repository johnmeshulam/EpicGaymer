import { Client } from "discord.js";
import { MessageHandler } from "./commands/MessageHandler";
import Config from "./db/services/ConfigurationService.ts";
import GuildService from "./db/guilds/GuildService";
import RoleEventHandler from "./utils/RoleEventHandler";
import RuleMessageService from "./utils/RuleMessageService";

export class DiscordBot {
  private static instance: DiscordBot;

  private client: Client = new Client();

  private constructor() {
    this.initializeCient();
  }

  private initializeCient(): void {
    if (!this.client) return;

    this.client.on("ready", () => {
      if (this.client.user) {
        console.log(`Logged in as ${this.client.user.tag}!`);
        //TODO: wait for setup to complete before performing operations on that guild
        this.setupGuilds(this.client);
      }
    });

    this.client.on("message", (msg) => {
      MessageHandler.handle(msg);
    });

    this.client.on("roleCreate", (role) => {
      RoleEventHandler.handleCreateEvent(role);
    });

    this.client.on("roleUpdate", (oldRole, newRole) => {
      RoleEventHandler.handleUpdateEvent(newRole);
    });

    this.client.on("roleDelete", (role) => {
      RoleEventHandler.handleDeleteEvent(role);
    });

    this.client.on("invalidated", () => {
      console.error("Client Invalidated!");
      process.exit();
    });

    this.client.on("rateLimit", (info) => {
      console.error("Rate limit! Details:");
      console.error(info);
    });
  }

  static getInstance(): DiscordBot {
    if (!DiscordBot.instance) {
      DiscordBot.instance = new DiscordBot();
    }
    return DiscordBot.instance;
  }

  async connect(): Promise<void> {
    return this.client
      .login(process.env.DEV_TOKEN)
      .then(() => {
        console.log("Connected to Discord");
        return;
      })
      .catch((error) => {
        console.error(`Could not connect. Error: ${error.message}`);
        throw error;
      });
  }

  setupGuilds(client: Client): void {
    const service = new GuildService();
    client.guilds.cache.forEach((guild) => {
      service.get(guild).catch((error) => {
        console.log("Setting up guild " + guild.id);
        service.create(guild).then((success) => {
          Config.fetchValues(guild).then(() => {
            RuleMessageService.update(guild);
            console.log("SETUP DONE");
          });
        });
      });
    });
  }
}
