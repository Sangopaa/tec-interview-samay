export function generateRequestId(): string {
  return crypto.randomUUID?.() || 
    Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
}
