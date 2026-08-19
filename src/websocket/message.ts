export const Message = {
    TeamsUpdate: "teams-update",
    StartGame: "start-game",
    NextQuestion: "next-question",
} as const;

export type Message = typeof Message[keyof typeof Message];