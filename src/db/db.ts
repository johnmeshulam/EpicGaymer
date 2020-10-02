import { MongoClient, MongoClientOptions } from "mongodb";

const CONNECTION_OPTIONS: MongoClientOptions = {
  useUnifiedTopology: true
};

class DBClientManager {
  private static instance: DBClientManager;

  private DB_NAME = "bot-data";
  private uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@epicgaymerdata.wzl59.mongodb.net/${this.DB_NAME}?retryWrites=true&w=majority`;
  private client: MongoClient;

  private constructor() {
    this.client = new MongoClient(this.uri, CONNECTION_OPTIONS);
  }

  public static getInstance() {
    if (!DBClientManager.instance) {
      DBClientManager.instance = new DBClientManager();
    }
    return DBClientManager.instance;
  }

  public async getConnection(): Promise<MongoClient> {
    if (!this.client.isConnected()) return this.connect();
    return this.client;
  }

  public async connect() {
    console.log("Connecting to database");
    try {
      if (!this.client.isConnected()) {
        this.client = await MongoClient.connect(this.uri, CONNECTION_OPTIONS);
        console.log("Connected to database!");
      }
    } catch (error) {
      console.error(`Error while connecting to database: ${error}`);
    }
    return this.client;
  }

  public disconnect(): void {
    if (!this.client.isConnected()) return;
    this.client.close().then(() => {
      console.log("Disconnected from database");
    });
  }
}

export const DBManager = DBClientManager.getInstance();
