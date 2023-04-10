import { GSheetsService } from "../infra/GSheetsService";
import { Logger } from "../infra/Logger";

class LocationRepository {
  private gsheetsService: GSheetsService;
  private logger: Logger;

  constructor(gsheetsService: GSheetsService, logger: Logger) {
    this.gsheetsService = gsheetsService;
    this.logger = logger;
  }
}

export {
  LocationRepository
}