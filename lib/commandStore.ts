// Simple in-memory store for demo purposes
// In production, use Redis or a database
type Command = {
    type: 'NAVIGATE' | 'PREFILL_FORM' | 'UPDATE_CART';
    payload: any;
    timestamp: number;
};

// Map call_id to list of commands
const commandStore: Record<string, Command[]> = {};

export const addCommand = (callId: string, command: Command) => {
    if (!commandStore[callId]) {
        commandStore[callId] = [];
    }
    commandStore[callId].push(command);
};

export const getCommands = (callId: string) => {
    const commands = commandStore[callId] || [];
    // Clear commands after reading (consume them)
    if (commands.length > 0) {
        commandStore[callId] = [];
    }
    return commands;
};
