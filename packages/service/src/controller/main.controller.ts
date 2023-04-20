import { Controller, Get, Post, Path, Query, Route, Body } from "tsoa";
import { DIProvider } from "../di.provider";
import { QuestionInputType, QuestionResponse } from "../model/location.model";

interface Question {
  text: string;
  type: QuestionInputType;
  response: QuestionResponse;
}

interface Answer {
  teamKey: string;
  answer: string;
}

interface Hint {
  nextLocationId: string;
  hints: string[];
}

@Route("question")
export class AmazingRaceController extends Controller {
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
    };
  }

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
      response: location.question.response,
    };
  }

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

    await answerRepo.addAnswer(team.id, location.id, body.answer);

    this.setStatus(200);
    return;
  }
}
