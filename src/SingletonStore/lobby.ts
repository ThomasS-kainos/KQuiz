import { v4 as uuid } from "uuid";
import { debug } from "node:console";

import { Team } from "./team.ts";
import { broadcast } from "../websocket/clients.ts";

class Lobby {
    public teamList: Map<string, Team> = new Map();

    public AddTeam(team: Team) {
        // TODO: Check if team name contains profanity or is offensive
        this.teamList.set(team.id, team);
        debug(`${team.id} added to loby with ${team.name} name`);
        this.broadcastTeams();
    }

    public RemoveTeam(teamId: string): boolean {
        const removed = this.teamList.delete(teamId);
        if (removed) {
            this.broadcastTeams();
        }
        return removed;
    }

    public getTeams() {
        return Array.from(this.teamList.values()).map(team => ({
            id: team.id,
            name: team.name,
            joinTime: team.joinTime
        }));
    }

    private broadcastTeams() {
        broadcast({ type: "teams-update", teams: this.getTeams() });
    }
}

export const lobbyStore: Lobby = new Lobby();