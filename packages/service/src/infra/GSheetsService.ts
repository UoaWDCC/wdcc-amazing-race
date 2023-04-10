import { GoogleSpreadsheet, ServiceAccountCredentials } from "google-spreadsheet";

/**
 * Service for interacting with the Google Sheets API.
 */
export class GSheetsService {
  private sheetId: string;
  private credentials: ServiceAccountCredentials;

  constructor(sheetId: string, credentials: ServiceAccountCredentials) {
    this.sheetId = sheetId;
    this.credentials = credentials;
  }

  public async init() {
    const doc = new GoogleSpreadsheet(this.sheetId);

    await doc.useServiceAccountAuth(this.credentials);

    await doc.loadInfo();
  }
}
