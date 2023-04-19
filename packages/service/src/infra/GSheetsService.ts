import {
  GoogleSpreadsheet,
  ServiceAccountCredentials,
} from "google-spreadsheet";
import { Logger } from "./Logger";

/**
 * Service for interacting with the Google Sheets API.
 */
export class GSheetsService {
  private sheetId: string;
  private credentials: ServiceAccountCredentials;
  private logger: Logger;

  constructor(
    sheetId: string,
    credentials: ServiceAccountCredentials,
    logger: Logger
  ) {
    this.sheetId = sheetId;
    this.credentials = credentials;
    this.logger = logger;
  }

  public async init() {
    const doc = new GoogleSpreadsheet(this.sheetId);

    await doc.useServiceAccountAuth(this.credentials);

    await doc.loadInfo();

    this.logger.info(`Ready`, this);
  }
}
