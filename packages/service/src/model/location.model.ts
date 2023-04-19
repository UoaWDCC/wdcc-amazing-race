export enum QuestionInputType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  LONG_TEXT = "LONG_TEXT",
}

export enum QuestionResponse {
  IMMEDIATE = "IMMEDIATE",
  DELAYED = "DELAYED",
}

class Question {
  public readonly text: string;
  public readonly inputType: QuestionInputType;
  public readonly response: QuestionResponse;
  public readonly answer: any;
  public readonly allowedGuesses: number;
  public readonly linkKey: string;

  constructor(
    text: string,
    inputType: QuestionInputType,
    response: QuestionResponse,
    answer: any,
    allowedGuesses: number
  ) {
    this.text = text;
    this.inputType = inputType;
    this.response = response;
    this.answer = answer;
    this.allowedGuesses = allowedGuesses;
  }

  compareAnswer(theirAnswer: any): boolean {
    // TODO: Support different primitive rather than just converting to string
    return `${theirAnswer}` === `${this.answer}`;
  }
}

type LocationId = string;
interface LocationProps {
  id: LocationId;
  linkKey: string;
  question: Question;
  hint1: string;
  hint2?: string;
}

class Location {
  public readonly id: LocationId;
  public readonly question: Question;
  public readonly linkKey: string;
  private readonly hint1: string;
  private readonly hint2?: string;

  constructor({ id, question, hint1, hint2, linkKey }: LocationProps) {
    this.id = id;
    this.linkKey = linkKey;

    this.question = question;
    this.hint1 = hint1;
    this.hint2 = hint2;
  }

  getHints(): string[] {
    if (!!this.hint2) {
      return [this.hint1, this.hint2];
    }

    return [this.hint1];
  }
}

export { Location, LocationId, Question, QuestionResponse, QuestionInputType };
