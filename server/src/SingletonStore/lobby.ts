
import { debug } from "node:console";

import { Team } from "./team.ts";
import { broadcast } from "../websocket/clients.ts";
import { Message } from "../websocket/message.ts";

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
            teamIcon: team.teamIcon,
            joinTime: team.joinTime
        }));
    }

    public getTeamById(teamId: string): Team | undefined {
        return this.teamList.get(teamId);
    }

    private broadcastTeams() {
        broadcast({ type: Message.TeamsUpdate });
    }
}

export const lobbyStore: Lobby = new Lobby();