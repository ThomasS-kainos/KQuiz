import { v4 as uuid } from "uuid";
import { debug } from "node:console";

import { Team } from "./team.ts";

class Lobby {
    public teamList: Map<string, Team> = new Map();

    public AddTeam(team: Team) {
        // TODO: Check if team name contains profanity or is offensive
        this.teamList.set(team.id, team);
        debug(`${team.id} added to loby with ${team.name} name`);
    }
}

export const lobbyStore: Lobby = new Lobby();