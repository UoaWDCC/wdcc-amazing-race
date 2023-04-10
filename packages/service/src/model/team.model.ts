import { LocationId } from "./location.model"

type TeamId = string;

class Team {
  public readonly id: TeamId;
  public readonly key: string
  public readonly path: LocationId[]

  constructor(id: TeamId, key: string, path: LocationId[]) {
    this.id = id;
    this.key = key;
    this.path = path;
  }

  /**
   * Returns the next best location ID to visit.
   */
  getNextLocationId(completed: LocationId[]): LocationId {
    // TODO: Implement
    return "";
  }
}

export {
  Team
}