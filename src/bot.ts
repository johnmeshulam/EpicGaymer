import { DiscordBot } from "./DiscordBot";
import { DBManager } from "./db/db";
import Config from "./db/configuration/config";
import AllowedRoles from "./db/roles/roles";

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
  await AllowedRoles.fetchValues();
  await bot.connect();
}
