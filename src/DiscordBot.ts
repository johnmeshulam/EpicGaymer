import { Client } from "discord.js";

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
  }

  static getInstance(): DiscordBot {
    if (!DiscordBot.instance) {
      DiscordBot.instance = new DiscordBot();
    }
    return DiscordBot.instance;
  }

  connect(): void {
    this.client
      .login(process.env.DEV_TOKEN)
      .then(() => console.log("Connected to Discord"))
      .catch((error) =>
        console.error(`Could not connect. Error: ${error.message}`)
      );
  }
}
