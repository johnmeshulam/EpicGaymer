import { DiscordBot } from "./DiscordBot";
import { DBManager } from "./db/db";

const bot = DiscordBot.getInstance();

try {
  DBManager.getConnection().then(() => {
    bot.connect();
  });
} catch {
  console.error("Error during bot connection. Terminating program now");
  process.abort();
}
