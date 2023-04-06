import { GoogleSpreadsheet } from "google-spreadsheet";

/**
 * Service for interacting with the Google Sheets API.
 */
export class GSheetsService {
  private sheetId: string;
  private clientId: string;
  private secret: string;

  constructor(sheetId: string, clientId: string, secret: string) {
    this.sheetId = sheetId;
    this.clientId = clientId;
    this.secret = secret;
  }

  public async init() {
    const doc = new GoogleSpreadsheet(this.sheetId);

    await doc.useServiceAccountAuth({
      client_email: this.clientId,
      private_key: this.secret,
    });

    await doc.loadInfo();
  }
}
