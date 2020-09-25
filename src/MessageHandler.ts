import { Message } from "discord.js";

import { DBManager } from "./db/db";

export class MessageHandler {
  static handle(message: Message): void {
    if (!isCommand(message)) return;

    //this message is a valid command
  }
}

function isCommand(message: Message): boolean {
  return message.content.length > 1 && message.content[0] === "+";
}
