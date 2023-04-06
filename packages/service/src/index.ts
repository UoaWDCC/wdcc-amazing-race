import { AmazingRaceApp } from "./app";

const app = new AmazingRaceApp();

// Start the HTTP server
app.start(parseInt(process.env.PORT) || 9000);
