import RoleService from "./RoleService";
import { RoleNotFoundException } from "../../exceptions";
import { createRoleIdentifier } from "../../textUtils";

export default class AllowedRoles {
  private static roles: Map<string, string>;
  private static service = new RoleService();

  public static hasRole(name: string): boolean {
    return this.roles.has(createRoleIdentifier(name));
  }

  public static getRoleName(name: string): string {
    const identifier = createRoleIdentifier(name);
    const roleName = this.roles.get(identifier);
    if (!roleName) throw new RoleNotFoundException(identifier);
    return roleName;
  }

  public static fetchValues(): Promise<boolean> {
    return this.service.mapValues().then((result) => {
      this.roles = result;
      console.log("Fetched allowed roled from database!");
      return true;
    });
  }
}
