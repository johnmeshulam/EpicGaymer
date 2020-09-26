import { Message } from "discord.js";
import { parseCommand } from "../textUtils";

export class RoleChannelHandler {
  public static handleMessage(message: Message): void {
    const content = parseCommand(message.content);

    if (content.command === "give") this.giveRoleCommand(message, content.args);
    if (content.command === "revoke") return;
  }

  private static giveRoleCommand(message: Message, args: string): void {
    //check permissions - no == msg and return
    //check if role is requestable - no == reaction and return
    //check if member has role - yes == msg and return
    //give the role - success == msg and return
  }
}
