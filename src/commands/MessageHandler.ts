import { Message } from "discord.js";
import Config from "../db/configuration/config";
import { RoleChannelHandler } from "./RoleChannelHandler";
import { ModerationChannelHandler } from "./ModerationChannelHandler";

export class MessageHandler {
  static handle(message: Message): void {
    //Currently only handles guild text channels
    if (message.channel.type !== "text") return;
    if (!isCommand(message)) return;

    switch (message.channel.name) {
      case Config.getValue("role-channel"):
        RoleChannelHandler.handleMessage(message);
        break;
      case Config.getValue("moderation-channel"):
        ModerationChannelHandler.handleMessage(message);
        break;
      default:
        break;
    }
  }
}

function isCommand(message: Message): boolean {
  return (
    message.content.length > 1 &&
    message.content[0] === Config.getValue("prefix")
  );
}
