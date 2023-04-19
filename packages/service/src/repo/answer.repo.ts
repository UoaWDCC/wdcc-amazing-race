import { GSheetsService } from "../infra/GSheetsService";
import { Logger } from "../infra/Logger";

class AnswerRepository {
  private gsheetsService: GSheetsService;
  private logger: Logger;

  constructor(gsheetsService: GSheetsService, logger: Logger) {
    this.gsheetsService = gsheetsService;
    this.logger = logger;
  }

  public async getTeamCompletedIds(teamId: string): Promise<string[]> {
    return [];
  }

  public async addAnswer(teamId: string, locationId: string, answer: string) {
    return null;
  }
}

export { AnswerRepository };
