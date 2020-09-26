import ConfigurationService from "./db/configuration/ConfigurationService";

export default class Config {
  private static options: Map<string, string>;
  private static service = new ConfigurationService();

  public static getValue(key: string): string {
    const value = this.options.get(key);
    if (value) return value;
    throw new Error(`Could not get config value for key ${key}`); //TODO throw custom exception
  }

  public static fetchValues(): void {
    this.service.mapValues().then((result) => {
      this.options = result;
      console.log("Fetched config values from database!");
    });
  }
}
