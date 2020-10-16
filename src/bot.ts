import { DiscordBot } from "./DiscordBot";
import { DBManager } from "./db/db";
import Config from "./db/configuration/config";

const bot = DiscordBot.getInstance();

try {
  init();
} catch {
  console.error("Error during bot initiaization. Terminating program now");
  process.abort();
}

async function init() {
  await DBManager.getConnection();
  await Config.fetchValues();
  await bot.connect();
}
