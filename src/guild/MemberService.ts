import { GuildMember, Role } from "discord.js";
import { createRoleIdentifier } from "../textUtils";

export default class MemberService {
  static hasRole(member: GuildMember, name: string): boolean {
    const role = member.roles.cache.find(
      (role) => createRoleIdentifier(role.name) === createRoleIdentifier(name)
    );
    if (!role) return false;
    return true;
  }

  static hasMemberRole(member: GuildMember): boolean {
    return this.hasRole(member, "member");
  }

  static giveRole(member: GuildMember, role: Role): void {
    member.roles.add(role);
  }

  static removeRole(member: GuildMember, role: Role): void {
    member.roles.remove(role);
  }
}
