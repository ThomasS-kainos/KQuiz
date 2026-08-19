export const Message = {
    TeamsUpdate: "teams-update",
    StartGame: "start-game",
    NextQuestion: "next-question",
    ShowAnswer: "show-answer",
} as const;

export type Message = typeof Message[keyof typeof Message];