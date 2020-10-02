import { Message } from "discord.js";
import Config from "./config";
import { RoleChannelHandler } from "./commands/channels/RoleChannelHandler";

export class MessageHandler {
  static handle(message: Message): void {
    //Currently only handles guild text channels
    if (message.channel.type !== "text") return;
    if (!isCommand(message)) return;

    switch (message.channel.name) {
      case Config.getValue("role-channel"):
        RoleChannelHandler.handleMessage(message);
    }
  }
}

function isCommand(message: Message): boolean {
  return (
    message.content.length > 1 &&
    message.content[0] === Config.getValue("prefix")
  );
}
