import express, { json } from "express";
import { RegisterRoutes } from "./swagger/routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.json";
import { GSheetsService } from "./infra/gsheets.service";
import * as gsheetsServiceAccountCredentials from "./private_keys/gsheets_sa_cred.json";
import { Logger } from "./infra/logger";
import { DIProvider } from "./di.provider";
import { LocationRepository } from "./repo/location.repo";
import { AnswerRepository } from "./repo/answer.repo";
import { TeamRepository } from "./repo/team.repo";
import cors from "cors";

export class AmazingRaceApp {
  private app: express.Application;
  private logger: Logger;
  private diProvider: DIProvider;

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

    this.app.use(cors());

    // Support swagger docs at "<url:port>/swagger"
    this.app.use("/swagger", swaggerUi.serve, async (req: express.Request, res: express.Response) => {
      return res.send(swaggerUi.generateHTML(swaggerSpec));
    });

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

    const cacheLifetime = isNaN(process.env.CACHE_LIFETIME as any) ? 60 : parseInt(process.env.CACHE_LIFETIME);
    const locationRepo = new LocationRepository(gsheetsService, this.logger, cacheLifetime);
    // TODO: Replace DI Provider with IOC framework
    this.diProvider = new DIProvider({
      locationRepo: locationRepo,
      answerRepo: new AnswerRepository(gsheetsService, locationRepo, this.logger),
      teamRepo: new TeamRepository(gsheetsService, this.logger, cacheLifetime),
      logger: this.logger,
    });
  }
}
