from typing import Callable, Dict, Awaitable

CommandHandler = Callable[[str], Awaitable[None]]

class CommandDispatcher:
    def __init__(self):
        self.handlers: Dict[str, CommandHandler] = {}

    def register(self, action: str, handler: CommandHandler) -> None:
        self.handlers[action] = handler

    async def dispatch(self, data: str) -> None:
        if ":" in data:
            parts = data.split(":", 1)
            action = parts[0]
        else:
            action = data
        if action in self.handlers:
            await self.handlers[action](data)
        else:
            print(f"Unhandled action: {action}")
