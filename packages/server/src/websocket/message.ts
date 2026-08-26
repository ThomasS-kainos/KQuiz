export const Message = {
    TeamsUpdate: "teams-update",
    StartGame: "start-game",
    NextQuestion: "next-question",
    ShowAnswer: "show-answer",
    ShowLeaderboard: "show-leaderboard",
} as const;

export type Message = typeof Message[keyof typeof Message];