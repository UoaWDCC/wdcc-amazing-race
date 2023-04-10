import express, { json } from "express";
import { RegisterRoutes } from "./swagger/routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.json";
import { GSheetsService } from "./infra/GSheetsService";
import * as gsheetsServiceAccountCredentials from "./private_keys/gsheets_sa_cred.json";
import { Logger } from "./infra/Logger";

export class AmazingRaceApp {
  private app: express.Application;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.app = express();
    this.configure();
  }

  /**
   * Initialises the express server with all dependencies and returns the underlying Application.
   */
  public async init(): Promise<express.Application> {
    try {
      await this.buildServices();
    } catch (e: any) {
      console.error("Failed to start service due to", e);
    }

    return this.app;
  }

  /**
   * Configures the app instance.
   */
  private configure() {
    // Support JSON
    this.app.use(json());

    // Support swagger docs at "<url:port>/swagger"
    this.app.use(
      "/swagger",
      swaggerUi.serve,
      async (req: express.Request, res: express.Response) => {
        return res.send(swaggerUi.generateHTML(swaggerSpec));
      }
    );

    // Configure all controllers
    RegisterRoutes(this.app);
  }

  /**
   * Build HTTP services.
   */
  private async buildServices() {
    const gsheetsService = new GSheetsService(
      process.env.DATASTORE_SPREADSHEET_ID,
      gsheetsServiceAccountCredentials,
      this.logger
    );
    await gsheetsService.init();
  }
}
