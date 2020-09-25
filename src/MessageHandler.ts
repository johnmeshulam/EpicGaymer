import { Message } from "discord.js";
import Config from "./config";

export class MessageHandler {
  static handle(message: Message): void {
    if (!isCommand(message)) return;

    //this message is a valid command
  }
}

function isCommand(message: Message): boolean {
  return (
    message.content.length > 1 &&
    message.content[0] === Config.getValue("prefix")
  );
}
