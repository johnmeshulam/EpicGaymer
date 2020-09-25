import ConfigurationService from "./db/configuration/ConfigurationService";

export default class Config {
  private static options: Map<string, string>;
  private static service = new ConfigurationService();

  public static getValue(key: string) {
    return this.options.get(key);
  }

  public static fetchValues(): void {
    this.service.mapValues().then((result) => {
      this.options = result;
      console.log("Fetched config values from database!");
    });
  }
}
