import { GSheetsService } from "../infra/gsheets.service";
import { Logger } from "../infra/logger";
import { Location, LocationId, Question, QuestionInputType, QuestionResponse } from "../model/location.model";
import { RepositoryCache } from "./cache";

class LocationRepository {
  private gsheetsService: GSheetsService;
  private logger: Logger;

  private cache: RepositoryCache<Location>;

  constructor(gsheetsService: GSheetsService, logger: Logger) {
    this.gsheetsService = gsheetsService;
    this.logger = logger;

    this.cache = new RepositoryCache<Location>(300);
  }

  public async get(id: LocationId) {
    const locations = await this.getLocations();

    return locations.find((it) => it.id === id);
  }

  public async getByKey(key: string): Promise<Location> {
    const locations = await this.getLocations();
    return locations.find((it) => it.linkKey === key);
  }

  public async getLocationIds(): Promise<LocationId[]> {
    const locations = await this.getLocations();
    return locations.map((it) => it.id);
  }

  private async getLocations(): Promise<Location[]> {
    if (this.cache.isExpired()) {
      const questionsData = await this.gsheetsService.getSheetData("questions");

      const locations = questionsData.map((it) => {
        const q = new Question(it["Question"], QuestionInputType.TEXT, QuestionResponse.DELAYED, "", 3);
        const loc = new Location({
          question: q,
          id: it["LocationId"],
          linkKey: it["LocationKey"],
          hint1: it["Hint1"],
          ...(!!it["Hint2"] && { hint2: it["Hint2"] }),
        });

        return loc;
      });

      this.cache.resetCache(locations);
    }
    return this.cache.getData();
  }
}

export { LocationRepository };
