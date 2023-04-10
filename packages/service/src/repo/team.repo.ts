import { GSheetsService } from "../infra/GSheetsService";
import { Logger } from "../infra/Logger";
import { Team, TeamId } from "../model/team.model";

class TeamRepository {
  private gsheetsService: GSheetsService;
  private logger: Logger;

  constructor(gsheetsService: GSheetsService, logger: Logger) {
    this.gsheetsService = gsheetsService;
    this.logger = logger;
  }
  
  // TOOD: Implement

  public async get(id: TeamId): Promise<Team> {
    return null;
  }

  public async getByKey(key: string): Promise<Team> {
    return null;
  }
}

export {
  TeamRepository
}