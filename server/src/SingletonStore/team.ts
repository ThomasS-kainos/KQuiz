import { v4 as uuid } from "uuid";

export class Team {
    // Unique identifier for the team (Maybe could change to snowflake ID in the future)
    public id: string = uuid();

    //Team visuals
    public name: string;
    public teamIcon: string;

    public joinTime: number = Date.now();

    public correctAnswers: number = 0;
    public incorrectAnswers: number = 0;

    constructor(name: string, teamIcon?: string) {
        this.name = name;
        this.teamIcon = teamIcon || "https://api.dicebear.com/6.x/initials/svg?seed=" + name;
    }
}