import { v4 as uuid } from "uuid";

export class Team {
    public id: string = uuid();
    public name: string;

    public joinTime: number = Date.now();

    constructor(name: string) {
        this.name = name;
    }
}