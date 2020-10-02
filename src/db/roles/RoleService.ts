import RoleManager from "./RoleManager";

export default class RoleService {
  //TODO: error handling for all of this
  private manager: RoleManager;

  public constructor() {
    this.manager = new RoleManager();
  }

  public mapValues(): Promise<Map<string, string>> {
    let roles = new Map<string, string>();

    return this.manager.getAll().then((allowedroles) => {
      allowedroles.map((element) =>
        roles.set(element.identifier, element.name)
      );
      return roles;
    });
  }
}
