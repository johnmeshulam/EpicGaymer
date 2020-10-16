import { GuildMember, Role } from "discord.js";

export default class MemberService {
  static hasRole(member: GuildMember, role: Role): boolean {
    if (member.roles.cache.has(role.id)) return true;
    return false;
  }

  static hasMemberRole(member: GuildMember): boolean {
    //TODO: make member role name variable
    const memberRole = member.roles.cache.find(
      (role) => role.name.toLowerCase() === "member"
    );
    if (memberRole) return true;
    return false;
  }

  static giveRole(member: GuildMember, role: Role): Promise<void> {
    return member.roles.add(role).then(() => {
      return;
    });
  }

  static removeRole(member: GuildMember, role: Role): Promise<void> {
    return member.roles.remove(role).then(() => {
      return;
    });
  }
}
