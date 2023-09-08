import { GSheetsService } from "../infra/gsheets.service";
import { Logger } from "../infra/logger";
import { LocationId } from "../model/location.model";
import { LocationRepository } from "./location.repo";

const ANSWERS_SHEET_NAME = "answers";

class AnswerRepository {
  private gsheetsService: GSheetsService;
  private locationRepo: LocationRepository;
  private logger: Logger;

  constructor(gsheetsService: GSheetsService, locationRepo: LocationRepository, logger: Logger) {
    this.gsheetsService = gsheetsService;
    this.locationRepo = locationRepo;
    this.logger = logger;
  }

  public async getTeamCompletedIds(teamId: string): Promise<Set<LocationId>> {
    const answers = await this.gsheetsService.getSheetData(ANSWERS_SHEET_NAME);
    const locIds = await this.locationRepo.getLocationIds();

    const answerRow = answers.find((it) => it["TeamId"] === teamId);
    if (!answerRow) {
      return null;
    }

    // Add all location ID's to completed if an answer was provided
    const completed = new Set<LocationId>();
    locIds.forEach((it) => {
      const answer = answerRow[it];
      if (!!answer) {
        completed.add(it);
      }
    });

    return completed;
  }

  public async addAnswer(teamId: string, locationId: string, answer: string): Promise<boolean> {
    const sheet = await this.gsheetsService.getSheetData(ANSWERS_SHEET_NAME);
    const row = sheet.find((it) => it["TeamId"] === teamId);

    const otherTeamsCompletion = sheet
      .filter(it => it["TeamId"] !== "TestIgnore")
      .map(it => it[locationId])
      .filter(it => !it);

    if (!row) {
      return null;
    }

    const currTime = new Date().toLocaleString('en-NZ', { hour: 'numeric', minute: 'numeric', timeZone: "Pacific/Auckland" });

    row[locationId] = `${currTime}: ${answer}`;
    row.save();

    // If all other teams have completed this QR code return true
    return otherTeamsCompletion.length <= 1;
    
  }
}

export { AnswerRepository };
