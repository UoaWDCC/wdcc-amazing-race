import express, { json } from "express";
import { RegisterRoutes } from "./swagger/routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.json";
import { GSheetsService } from "./infra/GSheetsService";

export class AmazingRaceApp {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configure();
  }

  /**
   * Starts the server on the `port` specified.
   */
  public async start(port: number) {
    try {
      await this.buildServices();

      this.app.listen(port, () => {
        console.log("Service starting on port:", port);
      });
    } catch (e: any) {
      console.error("Failed to start service due to", e);
    }
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
    const gsheetsService = new GSheetsService("", "", "");
    await gsheetsService.init();
  }
}
