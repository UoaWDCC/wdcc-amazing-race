import { loggers } from "winston";
import { LocationId } from "./location.model";

type TeamId = string;
class Team {
  public readonly id: TeamId;
  public readonly key: string;
  public readonly path: LocationId[];

  constructor(id: TeamId, key: string, path: LocationId[]) {
    this.id = id;
    this.key = key;
    this.path = path;
  }

  /**
   * Returns the next best location ID to visit.
   */
  getNextLocationId(completed: Set<LocationId>): LocationId {
    for (let pathId of this.path) {
      if (completed.has(pathId)) continue;

      return pathId;
    }

    if (this.path.length === 0) {
      return null;
    }
    return this.path[-1];
  }
}

export { Team, TeamId };
