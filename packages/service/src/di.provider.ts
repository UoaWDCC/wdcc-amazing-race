import { Logger } from "./infra/Logger";
import { AnswerRepository } from "./repo/answer.repo";
import { LocationRepository } from "./repo/location.repo";
import { TeamRepository } from "./repo/team.repo";

interface DIProviderProps {
  locationRepo: LocationRepository;
  answerRepo: AnswerRepository;
  teamRepo: TeamRepository;
  logger: Logger;
}

export class DIProvider {
  public readonly locationRepo: LocationRepository;
  public readonly answerRepo: AnswerRepository;
  public readonly teamRepo: TeamRepository;
  public readonly logger: Logger;

  private static _instance: DIProvider;

  static getInstance(): DIProvider {
    if (!!this._instance) {
      return this._instance;
    }
  }

  constructor(props: DIProviderProps) {
    this.locationRepo = props.locationRepo;
    this.answerRepo = props.answerRepo;
    this.teamRepo = props.teamRepo;
    this.logger = props.logger;

    DIProvider._instance = this;
  }
}
