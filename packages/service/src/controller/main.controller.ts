import { Controller, Get, Post, Path, Query, Route, Body } from "tsoa";
import { DIProvider } from "../di.provider";
import { QuestionInputType } from "../model/location.model";

interface Question {
  /**
   * The question text.
   */
  text: string;

  /**
   * The type of answer we're expecting (e.g. number or text).
   */
  type: QuestionInputType;
}

interface Answer {
  /**
   * The team key (4 characters) to identify the team submitting the answer.
   */
  teamKey: string;

  /**
   * The answer provided.
   */
  answer: string;
}

interface Hint {
  /**
   * The ID of the next location the team has to visit.
   */
  nextLocationId: string;

  /**
   * Hints to point the team to the next location.
   */
  hints: string[];

  photoHintUrl: string;
}

@Route("question")
export class AmazingRaceController extends Controller {
  /**
   * @param teamKey The team's key (4 characters).
   * @returns the hint to the next location for a provided team.
   */
  @Get("")
  public async getHint(@Query() teamKey?: string): Promise<Hint> {
    const { locationRepo, answerRepo, teamRepo, logger } = DIProvider.getInstance();

    const team = await teamRepo.getByKey(teamKey);

    if (!team) {
      this.setStatus(401);
      return;
    }

    const locationsVisited = await answerRepo.getTeamCompletedIds(team.id);
    const nextLocationId = team.getNextLocationId(locationsVisited);

    const nextLocation = await locationRepo.get(nextLocationId);

    logger.info(`Team: ${team.id} requested hints for Location: ${nextLocation.id}`, this);

    return {
      nextLocationId: nextLocation.id,
      hints: nextLocation.getHints(),
      photoHintUrl: nextLocation.photoHintUrl,
    };
  }

  /**
   * @param locationKey The key (4 characters) identifying the location that was accessed.
   * @param teamKey The team's key (4 characters).
   * @returns The question the team needs to answer at this location.
   */
  @Get("{locationKey}")
  public async getLocationQuestion(@Path() locationKey: string, @Query() teamKey?: string): Promise<Question> {
    const { locationRepo, teamRepo, answerRepo, logger } = DIProvider.getInstance();

    const location = await locationRepo.getByKey(locationKey);

    // Invalid location key
    if (!location) {
      this.setStatus(404);
      return;
    }

    const team = await teamRepo.getByKey(teamKey);

    // Invalid team key
    if (!team) {
      this.setStatus(401);
      return;
    }

    const answers = await answerRepo.getTeamCompletedIds(team.id);

    // Location was already completed
    if (answers.has(location.id)) {
      this.setStatus(409);
      return;
    }

    // Team skipped a location which is not allowed
    if (team.getNextLocationId(answers) != location.id) {
      this.setStatus(403);
      return;
    }

    logger.info(`Team: ${team.id} requested question for Location: ${location.id}`, this);

    return {
      text: location.question.text,
      type: location.question.inputType,
    };
  }

  /**
   * @param locationKey The key (4 characters) identifying the location that was accessed.
   * @param body
   */
  @Post("{locationKey}")
  public async submitAnswer(@Path() locationKey: string, @Body() body: Answer): Promise<any> {
    const { locationRepo, teamRepo, answerRepo, logger } = DIProvider.getInstance();
    const location = await locationRepo.getByKey(locationKey);

    // Invalid location key
    if (!location) {
      this.setStatus(404);
      return;
    }

    const team = await teamRepo.getByKey(body.teamKey);

    // Invalid team key
    if (!team) {
      this.setStatus(401);
      return;
    }

    logger.info(`Team: ${team.id}, Location: ${location.id}, Answer: "${body.answer}"`, this);

    const isLastTeam = await answerRepo.addAnswer(team.id, location.id, body.answer);
    if (isLastTeam) {
      logger.info(`Team: ${team.id} is the last team at Location: ${location.id}`);
    }
    
    this.setStatus(200);
    return {
      isLastTeam
    };
  }
}
