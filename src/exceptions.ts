export class NotFoundException extends Error {
  public readonly type: string;
  public readonly name: string;

  constructor(type: string, value: string) {
    super(`Could not find the ${type} ${value}`);
    this.type = type;
    this.name = value;
  }
}

export class RoleNotFoundException extends NotFoundException {
  constructor(roleName: string) {
    super("role", roleName);
  }
}

export class ChannelNotFoundException extends NotFoundException {
  constructor(channelName: string) {
    super("channel", channelName);
  }
}

export class MemberNotFoundException extends NotFoundException {
  constructor(memberName: string) {
    super("member", memberName);
  }
}
