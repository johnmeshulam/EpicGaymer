import { DiscordBot } from "./DiscordBot";
import { DBManager } from "./db/db";
import { resolve } from "path";

const bot = DiscordBot.getInstance();
bot.connect();
DBManager.getConnection();
