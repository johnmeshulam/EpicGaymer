export default interface ConfigurationEntry {
  key: string;
  value: string;
}

export const defaultConfiguration: Array<ConfigurationEntry> = [
  {
    key: "prefix",
    value: "+"
  },
  {
    key: "invite",
    value: "http://discordd.gg/tqvWXdA"
  },
  {
    key: "role-channel",
    value: "role-requests"
  },
  {
    key: "moderation-channel",
    value: "moderation"
  },
  {
    key: "game-category",
    value: "game specific channels"
  }
];
