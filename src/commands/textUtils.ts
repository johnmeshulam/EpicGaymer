export function parseCommand(
  content: string
): { command: string; args: string } {
  return {
    command: content.substring(1, content.indexOf(" ")),
    args: content.substring(content.indexOf(" ") + 1)
  };
}
