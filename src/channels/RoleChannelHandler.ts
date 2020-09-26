import { Message } from "discord.js";
import { parseCommand } from "../common/textUtils";

export class RoleChannelHandler {
  public static handleMessage(message: Message): void {
    console.log(parseCommand(message.content));
  }
}
