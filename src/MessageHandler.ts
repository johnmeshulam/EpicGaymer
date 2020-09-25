import { DMChannel, Message } from "discord.js";
import Config from "./config";

export class MessageHandler {
  static handle(message: Message): void {
    //Currently only handles server text channels
    if (message.channel.type !== "text") return;
    if (!isCommand(message)) return;

    if (message.channel.name === Config.getValue("role-channel"))
      console.log("Works!"); //TODO handle in role file
  }
}

function isCommand(message: Message): boolean {
  return (
    message.content.length > 1 &&
    message.content[0] === Config.getValue("prefix")
  );
}
