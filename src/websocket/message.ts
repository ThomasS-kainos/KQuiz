export const Message = {
    TeamsUpdate: "teams-update"
} as const;

export type Message = typeof Message[keyof typeof Message];