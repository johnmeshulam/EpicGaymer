import { Client } from "discord.js";
import { MessageHandler } from "./commands/MessageHandler";

export class DiscordBot {
  private static instance: DiscordBot;

  private client: Client = new Client();

  private constructor() {
    this.initializeCient();
  }

  private initializeCient(): void {
    if (!this.client) return;

    this.client.on("ready", () => {
      if (this.client.user)
        console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on("message", (msg) => {
      MessageHandler.handle(msg);
    });

    this.client.on("invalidated", () => {
      console.error("Client Invalidated!");
      process.exit();
    });

    this.client.on("rateLimit", (info) => {
      console.error("I have hit my limit! Details:");
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
}
