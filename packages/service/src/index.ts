import * as dotenv from "dotenv";
import { AmazingRaceApp } from "./app";
import { Logger } from "./infra/Logger";

// Load configuration from .env files into process.env
dotenv.config();
const port = parseInt(process.env.PORT) || 9000;

const logger = new Logger();

// Build our express app
const app = new AmazingRaceApp(logger);

// Initialises the app
app.init()
  .then(app => app.listen(port))
  .then(() => {
    logger.info(`Service starting on port ${port}`);
  });
