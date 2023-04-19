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

@Route("question")
export class TeamLoginController extends Controller {
  @Get("{linkKey}")
  public async get(@Path() linkKey: string, @Query() teamKey?: string): Promise<Question> {
    const { locationRepo, teamRepo, answerRepo, logger } = DIProvider.getInstance();

    const location = await locationRepo.getByKey(linkKey);

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
    if (answers.find((val) => val === location.id)) {
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

  @Post("{linkKey}")
  public async post(@Path() linkKey: string, @Body() body: Answer): Promise<any> {
    const { locationRepo, teamRepo, answerRepo, logger } = DIProvider.getInstance();
    const location = await locationRepo.getByKey(linkKey);

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
