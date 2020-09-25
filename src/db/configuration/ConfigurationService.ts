import ConfigurationManager from "./ConfigurationManger";

export default class ConfigurationService {
  //TODO: error handling for all of this
  private manager: ConfigurationManager;

  public constructor() {
    this.manager = new ConfigurationManager();
  }

  public mapValues(): Promise<Map<string, string>> {
    let config = new Map<string, string>();

    return this.manager.getAll().then((options) => {
      options.map((element) => config.set(element.key, element.value));
      return config;
    });
  }

  public getValue(key: string): Promise<string> {
    return this.manager.get(key).then((result) => {
      return result.value;
    });
  }

  public setValue(key: string, value: string): Promise<boolean> {
    return this.manager.update(key, value).then((result) => {
      return result;
    });
  }
}
