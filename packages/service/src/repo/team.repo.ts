import { GSheetsService } from "../infra/gsheets.service";
import { Logger } from "../infra/logger";
import { Team, TeamId } from "../model/team.model";
import { RepositoryCache } from "./cache";

class TeamRepository {
  private gsheetsService: GSheetsService;
  private logger: Logger;

  private cache: RepositoryCache<Team>;

  constructor(gsheetsService: GSheetsService, logger: Logger, cacheLifetime: number) {
    this.gsheetsService = gsheetsService;
    this.logger = logger;

    this.cache = new RepositoryCache<Team>(cacheLifetime);
  }

  public async getByKey(key: string): Promise<Team> {
    const teams = await this.getTeams();
    return teams.find((it) => it.key === key);
  }

  private async getTeams() {
    if (this.cache.isExpired()) {
      const teamsData = await this.gsheetsService.getSheetData("teams");

      const teams = teamsData.map((teamRow) => {
        const path = [];
        for (let i = 1; i <= 9; i++) {
          const locationIdKey = `${i}`;
          if (!!teamRow[locationIdKey]) {
            path.push(teamRow[locationIdKey]);
          }
        }
        return new Team(teamRow["TeamId"], teamRow["TeamKey"], path);
      });

      this.cache.resetCache(teams);
    }

    return this.cache.getData();
  }
}

export { TeamRepository };
