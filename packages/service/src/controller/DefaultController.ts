import { Controller, Get, Route } from "tsoa";

@Route()
export class DefaultController extends Controller {
  @Get()
  public async get(): Promise<string> {
    return "You have reached the default path of @amazing-race/service";
  }
}
