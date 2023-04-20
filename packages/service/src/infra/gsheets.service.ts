import { GoogleSpreadsheet, ServiceAccountCredentials } from "google-spreadsheet";
import { Logger } from "./logger";

/**
 * Service for interacting with the Google Sheets API.
 */
export class GSheetsService {
  private sheetId: string;
  private credentials: ServiceAccountCredentials;
  private logger: Logger;

  private doc: GoogleSpreadsheet;

  constructor(sheetId: string, credentials: ServiceAccountCredentials, logger: Logger) {
    this.sheetId = sheetId;
    this.credentials = credentials;
    this.logger = logger;
  }

  public async init() {
    const doc = new GoogleSpreadsheet(this.sheetId);

    await doc.useServiceAccountAuth(this.credentials);

    await doc.loadInfo();

    this.doc = doc;

    this.logger.info(`Ready`, this);
  }

  public async getSheetData(sheetId: string) {
    return await this.doc.sheetsByTitle[sheetId].getRows();
  }
}
