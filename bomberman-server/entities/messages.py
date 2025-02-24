from pydantic import BaseModel

class JoinMessage(BaseModel):
    action: str
    playerName: str

class MoveMessage(BaseModel):
    action: str
    dx: int
    dy: int

class PlaceBombMessage(BaseModel):
    action: str

class BombExplodedMessage(BaseModel):
    action: str
    playerName: str
    x: int
    y: int

class DieMessage(BaseModel):
    action: str 
    playerName: str

class RequestSpawnsMessage(BaseModel):
    action: str
