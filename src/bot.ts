import { DiscordBot } from "./DiscordBot";
import { DBManager } from "./db/db";

const bot = DiscordBot.getInstance();

DBManager.getConnection().then(() => {
  bot.connect();
});
