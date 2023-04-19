import { GSheetsService } from "../infra/GSheetsService";
import { Logger } from "../infra/Logger";
import { Location, LocationId } from "../model/location.model";

class LocationRepository {
  private gsheetsService: GSheetsService;
  private logger: Logger;

  constructor(gsheetsService: GSheetsService, logger: Logger) {
    this.gsheetsService = gsheetsService;
    this.logger = logger;
  }

  public async get(id: LocationId): Promise<Location> {
    return null;
  }

  public async getByKey(key: string): Promise<Location> {
    return null;
  }
}

export { LocationRepository };
