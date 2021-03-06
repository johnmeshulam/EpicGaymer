import ConfigurationEntry from "./config";
import RoleEntry from "./role";

export default interface GuildEntry {
  identifier: string;
  roles: Array<RoleEntry>;
  configuration: Array<ConfigurationEntry>;
  rules: RulesEntry;
}

export interface RulesEntry {
  channel: string;
  messageId: string;
}
