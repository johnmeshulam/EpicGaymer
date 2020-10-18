import { Message } from "discord.js";
import Config from "../db/services/ConfigurationService.ts";
import { RoleChannelHandler } from "./RoleChannelHandler";
import { ModerationChannelHandler } from "./ModerationChannelHandler";

export class MessageHandler {
  static handle(message: Message): void {
    //Currently only handles guild text channels
    if (message.channel.type !== "text") return;
    if (!message.guild) return;
    if (!isCommand(message)) return;

    switch (message.channel.name) {
      case Config.getValue(message.guild, "role-channel"):
        RoleChannelHandler.handleMessage(message);
        break;
      case Config.getValue(message.guild, "moderation-channel"):
        ModerationChannelHandler.handleMessage(message);
        break;
      default:
        break;
    }
  }
}

function isCommand(message: Message): boolean {
  if (!message.guild)
    throw new Error("Tried to analyze a message without a guild!");
  return (
    message.content.length > 1 &&
    message.content[0] === Config.getValue(message.guild, "prefix")
  );
}
