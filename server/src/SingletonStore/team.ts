import { v4 as uuid } from "uuid";

export class Team {
    public id: string = uuid();
    public name: string;

    public joinTime: number = Date.now();

    public correctAnswers: number = 0;
    public incorrectAnswers: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}