# # import os
# # import logging
# # import json
# # import random
# # from datetime import datetime, timezone
# # from dotenv import load_dotenv
# # from pymongo import MongoClient
# # from pymongo.errors import PyMongoError
# # from fastapi import FastAPI, HTTPException, Body
# # from fastapi.middleware.cors import CORSMiddleware
# # from pydantic import BaseModel, Field
# # from typing import List, Optional, Any

# # # --- Configuration & Setup ---
# # load_dotenv()
# # logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
# # logger = logging.getLogger(__name__)

# # app = FastAPI()

# # # --- CORS Middleware ---
# # origins = [
# #     "http://localhost",
# #     "http://localhost:3000",
# #     "http://localhost:5173", # Default for Vite
# #     "http://127.0.0.1:5500",
# # ]
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=origins,
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # --- Database Connection ---
# # try:
# #     client = MongoClient(os.getenv("MONGO_URI"))
# #     db = client["mars_game_db"]
# #     games = db["games"]
# #     logger.info("Successfully connected to MongoDB.")
# # except PyMongoError as e:
# #     logger.critical(f"Failed to connect to MongoDB: {e}")
# #     client, db, games = None, None, None

# # # --- Load Game Scenarios ---
# # scenarios_data = []
# # try:
# #     with open("scenarios.json", "r") as f:
# #         scenarios_data = json.load(f)
# #     logger.info(f"Successfully loaded {len(scenarios_data)} scenarios.")
# # except Exception as e:
# #     logger.critical(f"Failed to load scenarios.json: {e}")
# #     scenarios_data = []

# # # --- Pydantic Models for Data Structure ---
# # class PlayerTask(BaseModel):
# #     player_name: str
# #     subtask_id: int
# #     completed: bool = False

# # class Team(BaseModel):
# #     team_name: str
# #     players: List[PlayerTask]
# #     current_scenario_id: Optional[str] = None
# #     round_start_time: Optional[datetime] = None
# #     round_finish_time: Optional[datetime] = None
# #     is_eliminated: bool = False

# # class Game(BaseModel):
# #     id: str = Field(..., alias="_id")
# #     status: str = "lobby"
# #     round_number: int = 0
# #     players_in_lobby: List[str] = []
# #     teams: List[Team] = []
# #     scenarios: List[Any] = [] # To pass scenario data to frontend

# #     class Config:
# #         populate_by_name = True
# #         json_encoders = {datetime: lambda dt: dt.isoformat()}

# # # --- Helper Functions ---
# # def get_game_state_db():
# #     if games is None:
# #         raise HTTPException(status_code=503, detail="Database connection not available.")
# #     game_data = games.find_one({"_id": "single_game"})
# #     if not game_data:
# #         raise HTTPException(status_code=404, detail="Game not found.")
# #     # Dynamically add scenarios data to the state for the frontend
# #     game_data['scenarios'] = scenarios_data
# #     return game_data

# # def get_scenario_by_id(scenario_id: str):
# #     for scenario in scenarios_data:
# #         if scenario["id"] == scenario_id:
# #             return scenario
# #     return None

# # # --- Game Initialization ---
# # def initialize_game():
# #     if games is None: return
# #     game = games.find_one({"_id": "single_game"})
# #     if not game:
# #         games.insert_one({
# #             "_id": "single_game",
# #             "status": "lobby",
# #             "round_number": 0,
# #             "players_in_lobby": [],
# #             "teams": []
# #         })
# #         logger.info("Initialized a new game in the database.")

# # @app.on_event("startup")
# # def on_startup():
# #     initialize_game()

# # # --- Player Endpoints ---
# # @app.post("/api/lobby/join")
# # async def join_lobby(player_name: str = Body(..., embed=True)):
# #     game = get_game_state_db()
# #     if game["status"] != "lobby":
# #         raise HTTPException(status_code=400, detail="Game is not in the lobby phase.")
# #     if player_name in game["players_in_lobby"]:
# #         raise HTTPException(status_code=400, detail="Player with that name already exists in the lobby.")

# #     games.update_one({"_id": "single_game"}, {"$push": {"players_in_lobby": player_name}})
# #     logger.info(f"Player '{player_name}' joined the lobby.")
# #     return {"status": "joined", "player_name": player_name}

# # @app.get("/api/game/state", response_model=Game)
# # async def get_game_state():
# #     return get_game_state_db()

# # @app.get("/api/player/my-task")
# # async def get_my_task(player_name: str):
# #     game = get_game_state_db()
# #     for team in game["teams"]:
# #         for player in team["players"]:
# #             if player["player_name"] == player_name:
# #                 scenario = get_scenario_by_id(team["current_scenario_id"])
# #                 if not scenario:
# #                     raise HTTPException(status_code=404, detail="Scenario data not found for this team.")
# #                 for subtask in scenario["subtasks"]:
# #                     if subtask["id"] == player["subtask_id"]:
# #                         return {
# #                             "main_scenario": scenario["main_scenario"],
# #                             "your_task": subtask["task"],
# #                             "completed": player["completed"]
# #                         }
# #     raise HTTPException(status_code=404, detail=f"Task for player '{player_name}' not found.")

# # @app.post("/api/player/submit-answer")
# # async def submit_answer(player_name: str = Body(...), answer: str = Body(...)):
# #     game = get_game_state_db()
# #     answer = answer.strip()
    
# #     for team_index, team in enumerate(game["teams"]):
# #         for player_index, player in enumerate(team["players"]):
# #             if player["player_name"] == player_name:
# #                 if player["completed"]:
# #                     raise HTTPException(status_code=400, detail="You have already completed your task for this round.")
                
# #                 scenario = get_scenario_by_id(team["current_scenario_id"])
# #                 correct_answer = ""
# #                 for subtask in scenario["subtasks"]:
# #                     if subtask["id"] == player["subtask_id"]:
# #                         correct_answer = subtask["answer"]
# #                         break

# #                 if answer.lower() == correct_answer.lower():
# #                     # Correct answer
# #                     update_path = f"teams.{team_index}.players.{player_index}.completed"
# #                     games.update_one({"_id": "single_game"}, {"$set": {update_path: True}})
# #                     logger.info(f"Player '{player_name}' submitted correct answer.")
                    
# #                     # Check if team is finished
# #                     current_game_state = get_game_state_db()
# #                     team_finished = all(p["completed"] for p in current_game_state["teams"][team_index]["players"])
# #                     if team_finished:
# #                         finish_time_path = f"teams.{team_index}.round_finish_time"
# #                         games.update_one({"_id": "single_game"}, {"$set": {finish_time_path: datetime.now(timezone.utc)}})
# #                         logger.info(f"Team '{team['team_name']}' has completed the round.")

# #                     return {"correct": True, "message": "Answer correct!"}
# #                 else:
# #                     # Incorrect answer
# #                     logger.info(f"Player '{player_name}' submitted incorrect answer.")
# #                     return {"correct": False, "message": "Answer incorrect. Try again."}
                    
# #     raise HTTPException(status_code=404, detail=f"Player '{player_name}' not found in any active team.")

# # # --- Admin Endpoints ---
# # @app.post("/api/admin/create-teams")
# # async def create_teams(num_teams: int = Body(..., embed=True)):
# #     game = get_game_state_db()
# #     if game["status"] != "lobby":
# #         raise HTTPException(status_code=400, detail="Can only create teams while in lobby.")
    
# #     players = game["players_in_lobby"]
# #     random.shuffle(players)
    
# #     if num_teams <= 0 or num_teams > len(players):
# #         raise HTTPException(status_code=400, detail="Invalid number of teams.")

# #     new_teams = [{"team_name": f"Team {chr(65+i)}", "players": [], "is_eliminated": False} for i in range(num_teams)]
# #     for i, player_name in enumerate(players):
# #         team_index = i % num_teams
# #         new_teams[team_index]["players"].append({"player_name": player_name, "subtask_id": 0, "completed": False})

# #     games.update_one({"_id": "single_game"}, {"$set": {"teams": new_teams, "players_in_lobby": []}})
# #     logger.info(f"Created {num_teams} teams from {len(players)} players.")
# #     return {"status": "teams_created", "teams": new_teams}

# # @app.post("/api/admin/start-round")
# # async def start_round():
# #     game = get_game_state_db()
# #     if not scenarios_data:
# #         raise HTTPException(status_code=500, detail="No scenarios loaded.")

# #     new_round_number = game["round_number"] + 1
# #     if new_round_number > len(scenarios_data):
# #         raise HTTPException(status_code=400, detail="No more scenarios available.")
        
# #     scenario_for_round = scenarios_data[new_round_number - 1]
    
# #     updates = {
# #         "status": f"round_{new_round_number}",
# #         "round_number": new_round_number
# #     }
    
# #     for i, team in enumerate(game["teams"]):
# #         if not team["is_eliminated"]:
# #             subtask_ids = [st["id"] for st in scenario_for_round["subtasks"]]
# #             random.shuffle(subtask_ids)
            
# #             for j, player in enumerate(team["players"]):
# #                 updates[f"teams.{i}.players.{j}.subtask_id"] = subtask_ids[j % len(subtask_ids)]
# #                 updates[f"teams.{i}.players.{j}.completed"] = False
            
# #             updates[f"teams.{i}.current_scenario_id"] = scenario_for_round["id"]
# #             updates[f"teams.{i}.round_start_time"] = datetime.now(timezone.utc)
# #             updates[f"teams.{i}.round_finish_time"] = None
            
# #     games.update_one({"_id": "single_game"}, {"$set": updates})
# #     logger.info(f"Round {new_round_number} started with scenario '{scenario_for_round['title']}'.")
# #     return {"status": "round_started", "round": new_round_number}

# # @app.post("/api/admin/end-round")
# # async def end_round(num_to_eliminate: int = Body(..., embed=True)):
# #     game = get_game_state_db()
    
# #     active_teams = [t for t in game["teams"] if not t["is_eliminated"]]
    
# #     def sort_key(team):
# #         if team.get("round_finish_time"):
# #             return (0, team["round_finish_time"] - team["round_start_time"])
# #         return (1, datetime.now(timezone.utc))

# #     active_teams.sort(key=sort_key)
    
# #     if num_to_eliminate < 0:
# #         raise HTTPException(status_code=400, detail="Number to eliminate must be non-negative.")
        
# #     teams_to_eliminate = active_teams[-num_to_eliminate:] if num_to_eliminate > 0 else []

# #     for team_to_elim in teams_to_eliminate:
# #         for i, t in enumerate(game["teams"]):
# #             if t["team_name"] == team_to_elim["team_name"]:
# #                 games.update_one({"_id": "single_game"}, {"$set": {f"teams.{i}.is_eliminated": True}})
# #                 logger.info(f"Team '{t['team_name']}' has been eliminated.")
    
# #     remaining_teams_count = len(active_teams) - len(teams_to_eliminate)
# #     if remaining_teams_count <= 1:
# #         games.update_one({"_id": "single_game"}, {"$set": {"status": "finished"}})
# #         winner = active_teams[0]["team_name"] if remaining_teams_count == 1 else "No winner"
# #         logger.info("Game finished.")
# #         return {"status": "game_finished", "winner": winner}
    
# #     return {"status": "round_ended", "eliminated_teams": [t["team_name"] for t in teams_to_eliminate]}

# # @app.post("/api/game/reset")
# # async def reset_game():
# #     if games is None:
# #         raise HTTPException(status_code=503, detail="Database connection not available.")
# #     games.delete_one({"_id": "single_game"})
# #     initialize_game()
# #     logger.info("Game has been reset to lobby.")
# #     return {"status": "reset"}

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)




import os
import logging
import json
import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from groq import Groq

# --- Configuration & Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# --- CORS Middleware ---
origins = [
    "http://localhost:3000",
    "https://your-frontend-project-name.vercel.app" # Add your live Vercel URL
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database & API Clients ---
try:
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["mars_game_db"]
    games = db["games"]
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    logger.info("Successfully connected to MongoDB and initialized Groq client.")
except Exception as e:
    logger.critical(f"Failed to initialize services: {e}")
    client, db, games, groq_client = None, None, None, None

# --- Load Game Scenarios ---
scenarios_data = []
try:
    with open("scenarios.json", "r", encoding="utf-8") as f:
        scenarios_data = json.load(f)
    logger.info(f"Successfully loaded {len(scenarios_data)} scenarios.")
except Exception as e:
    logger.critical(f"Failed to load scenarios.json: {e}")

# --- Pydantic Models (Updated) ---
class PlayerTask(BaseModel):
    player_name: str
    subtask_id: int
    completed: bool = False
    hints_used: int = 0

class Team(BaseModel):
    team_name: str
    players: List[PlayerTask]
    score: int = 0
    current_scenario_id: Optional[str] = None
    round_start_time: Optional[datetime] = None
    round_finish_time: Optional[datetime] = None
    is_eliminated: bool = False

class Game(BaseModel):
    id: str = Field(..., alias="_id")
    status: str = "lobby"
    round_number: int = 0
    round_duration_seconds: int = 180
    round_end_time: Optional[datetime] = None
    players_in_lobby: List[str] = []
    teams: List[Team] = []
    scenarios: List[Any] = []

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat().replace('+00:00', 'Z')
        }

# --- Game Logic Constants ---
POINTS_PER_ANSWER = 100
HINT_PENALTY = 25

# --- Helper Functions ---
def get_game_state_db():
    if games is None:
        raise HTTPException(status_code=503, detail="Database connection not available.")
    game_data = games.find_one({"_id": "single_game"})
    if not game_data:
        raise HTTPException(status_code=404, detail="Game not found.")
    game_data['scenarios'] = scenarios_data
    return game_data

def get_scenario_by_id(scenario_id: str):
    return next((s for s in scenarios_data if s["id"] == scenario_id), None)

def get_subtask_by_id(scenario, subtask_id: int):
    if scenario and "subtasks" in scenario:
        return next((st for st in scenario["subtasks"] if st["id"] == subtask_id), None)
    return None

# --- Game Initialization ---
def initialize_game():
    if games is None: return
    game_defaults = {
        "_id": "single_game", "status": "lobby", "round_number": 0,
        "round_duration_seconds": 180, "round_end_time": None,
        "players_in_lobby": [], "teams": []
    }
    games.update_one({"_id": "single_game"}, {"$setOnInsert": game_defaults}, upsert=True)
    logger.info("Game initialized or already exists.")

@app.on_event("startup")
def on_startup():
    initialize_game()

# --- Player & Lobby Endpoints ---

@app.get("/api/game/state", response_model=Game)
async def get_game_state():
    return get_game_state_db()

@app.post("/api/lobby/join")
async def join_lobby(player_name: str = Body(..., embed=True)):
    game = get_game_state_db()
    if game["status"] != "lobby":
        raise HTTPException(status_code=400, detail="Game is not in the lobby phase.")
    if player_name in game["players_in_lobby"] or any(p["player_name"] == player_name for t in game.get("teams", []) for p in t["players"]):
        raise HTTPException(status_code=400, detail="Player with that name already exists.")
    games.update_one({"_id": "single_game"}, {"$push": {"players_in_lobby": player_name}})
    return {"status": "joined", "player_name": player_name}

@app.get("/api/player/my-task")
async def get_my_task(player_name: str):
    game = get_game_state_db()
    for team in game["teams"]:
        for player in team["players"]:
            if player["player_name"] == player_name:
                scenario = get_scenario_by_id(team["current_scenario_id"])
                subtask = get_subtask_by_id(scenario, player["subtask_id"])
                if scenario and subtask:
                    return {
                        "main_scenario": scenario["main_scenario"],
                        "your_task": subtask["task"],
                        "completed": player["completed"]
                    }
    raise HTTPException(status_code=404, detail=f"Task for player '{player_name}' not found.")

@app.post("/api/player/submit-answer")
async def submit_answer(player_name: str = Body(...), answer: str = Body(...)):
    game = get_game_state_db()
    answer = answer.strip()
    round_end_time = game.get("round_end_time")

    # First, check if the round has a time limit
    if round_end_time:
        
        round_end_time = round_end_time.replace(tzinfo=timezone.utc)
        
        # Now the comparison will work correctly
        if datetime.now(timezone.utc) > round_end_time:
            raise HTTPException(status_code=400, detail="Time's up! No more answers can be submitted for this round.")
    
    
    for team_index, team in enumerate(game["teams"]):
        for player_index, player in enumerate(team["players"]):
            if player["player_name"] == player_name:
                if player["completed"]:
                    raise HTTPException(status_code=400, detail="You have already completed your task.")
                
                scenario = get_scenario_by_id(team["current_scenario_id"])
                subtask = get_subtask_by_id(scenario, player["subtask_id"])

                if not subtask:
                    raise HTTPException(status_code=404, detail="Assigned subtask could not be found.")

                if answer.lower() == subtask["answer"].lower():
                    score_earned = max(0, POINTS_PER_ANSWER - (player["hints_used"] * HINT_PENALTY))
                    updates = {
                        f"teams.{team_index}.players.{player_index}.completed": True,
                        f"teams.{team_index}.score": team.get("score", 0) + score_earned
                    }
                    games.update_one({"_id": "single_game"}, {"$set": updates})
                    
                    current_game_state = games.find_one({"_id": "single_game"})
                    if all(p["completed"] for p in current_game_state["teams"][team_index]["players"]):
                        games.update_one({"_id": "single_game"}, {"$set": {f"teams.{team_index}.round_finish_time": datetime.now(timezone.utc)}})

                    return {"correct": True, "message": f"Correct! +{score_earned} points."}
                else:
                    try:
                        chat_completion = groq_client.chat.completions.create(
                            messages=[
                                {"role": "system", "content": "You are a cryptic game master. A player gave a wrong answer. Give a very short, clever hint about why their answer is wrong, without revealing the correct one. Be mysterious."},
                                {"role": "user", "content": f"The challenge was: '{subtask['task']}'. The correct answer is '{subtask['answer']}'. The player incorrectly submitted '{answer}'. What hint should I give them?"}
                            ], model="llama-3.1-8b-instant")
                        llm_feedback = chat_completion.choices[0].message.content
                    except Exception as e:
                        logger.error(f"Groq API call for feedback failed: {e}")
                        llm_feedback = "That is not the correct path."
                    return {"correct": False, "message": llm_feedback}
                    
    raise HTTPException(status_code=404, detail=f"Player not found in any active team.")

@app.post("/api/player/get-hint")
async def get_hint(player_name: str = Body(..., embed=True)):
    game = get_game_state_db()
    for team_index, team in enumerate(game["teams"]):
        for player_index, player in enumerate(team["players"]):
            if player["player_name"] == player_name:
                games.update_one({"_id": "single_game"}, {"$inc": {f"teams.{team_index}.players.{player_index}.hints_used": 1}})
                
                scenario = get_scenario_by_id(team["current_scenario_id"])
                subtask = get_subtask_by_id(scenario, player["subtask_id"])
                
                try:
                    chat_completion = groq_client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": "You are a mysterious AI game master on Mars. A player needs a hint. Provide a short, creative, and cryptic hint based on the provided info that guides them but does not give away the answer directly."},
                            {"role": "user", "content": f"The challenge is: '{subtask['task']}'. The answer is '{subtask['answer']}'. The pre-written hints are: {subtask['hints']}. Provide a new hint."}
                        ], model="llama-3.1-8b-instant")
                    hint = chat_completion.choices[0].message.content
                    return {"hint": hint}
                except Exception as e:
                    logger.error(f"Groq API call for hint failed: {e}")
                    raise HTTPException(status_code=503, detail="The AI oracle is currently offline.")
    raise HTTPException(status_code=404, detail="Player not found.")

@app.get("/api/player/report/{player_id}")
async def get_player_report(player_id: str):
    game = get_game_state_db()
    if game["status"] != "finished":
        raise HTTPException(status_code=400, detail="Game is not finished yet.")

    winner_team = next((t for t in game["teams"] if not t["is_eliminated"]), None)
    player_team = next((t for t in game["teams"] if any(p["player_name"] == player_id for p in t["players"])), None)
    
    if not player_team or not winner_team:
        raise HTTPException(status_code=404, detail="Could not generate report for player.")

    summary = f"Player {player_id} was on team '{player_team['team_name']}' which scored {player_team['score']} points. The winning team was '{winner_team['team_name']}' with a score of {winner_team['score']} points. All teams and their final scores were: {[ (t['team_name'], t['score']) for t in game['teams'] ]}."

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are the AI Mission Commander for the 'AI Arena' simulation. The mission has concluded. Write a personalized after-action report for the specified player. Narrate their team's performance and the final outcome in a concise, official-sounding debrief (2-3 paragraphs)."},
                {"role": "user", "content": f"Generate the report for player {player_id} based on this summary: {summary}"}
            ], model="llama-3.1-8b-instant")
        report = chat_completion.choices[0].message.content
        return {"report": report}
    except Exception as e:
        logger.error(f"Groq API call for report failed: {e}")
        raise HTTPException(status_code=503, detail="Report generation failed.")

# --- Admin Endpoints ---

@app.post("/api/admin/create-teams")
async def create_teams(num_teams: int = Body(..., embed=True)):
    game = get_game_state_db()
    if game["status"] != "lobby":
        raise HTTPException(status_code=400, detail="Can only create teams while in lobby.")
    
    players = game["players_in_lobby"]
    random.shuffle(players)
    
    if num_teams <= 0 or num_teams > len(players):
        raise HTTPException(status_code=400, detail="Invalid number of teams.")

    new_teams = [{"team_name": f"Team {chr(65+i)}", "players": [], "score": 0, "is_eliminated": False} for i in range(num_teams)]
    for i, player_name in enumerate(players):
        team_index = i % num_teams
        new_teams[team_index]["players"].append({"player_name": player_name, "subtask_id": 0, "completed": False, "hints_used": 0})

    games.update_one({"_id": "single_game"}, {"$set": {"teams": new_teams, "players_in_lobby": []}})
    return {"status": "teams_created", "teams": new_teams}

@app.post("/api/admin/start-round")
async def start_round():
    game = get_game_state_db()
    
    if game["round_number"] > 0:
        active_teams = [t for t in game["teams"] if not t["is_eliminated"]]
        if len(active_teams) > 1:
            active_teams.sort(key=lambda t: t.get("score", 0))
            team_to_eliminate = active_teams[0]
            games.update_one(
                {"_id": "single_game", "teams.team_name": team_to_eliminate["team_name"]},
                {"$set": {"teams.$.is_eliminated": True}}
            )
            logger.info(f"Team '{team_to_eliminate['team_name']}' has been eliminated with the lowest score.")

    game = games.find_one({"_id": "single_game"})
    remaining_teams = [t for t in game["teams"] if not t["is_eliminated"]]
    if len(remaining_teams) <= 1:
        games.update_one({"_id": "single_game"}, {"$set": {"status": "finished"}})
        winner = remaining_teams[0]['team_name'] if remaining_teams else "N/A"
        return {"status": "game_finished", "winner": winner}
        
    new_round_number = game["round_number"] + 1
    if new_round_number > len(scenarios_data):
        raise HTTPException(status_code=400, detail="No more scenarios available.")
        
    scenario_for_round = scenarios_data[new_round_number - 1]
    round_end = datetime.now(timezone.utc) + timedelta(seconds=game.get("round_duration_seconds", 180))
    
    updates = {
        "status": f"round_{new_round_number}",
        "round_number": new_round_number,
        "round_end_time": round_end
    }
    
    for i, team in enumerate(game["teams"]):
        if not team["is_eliminated"]:
            updates[f"teams.{i}.current_scenario_id"] = scenario_for_round["id"]
            updates[f"teams.{i}.round_finish_time"] = None
            subtask_ids = [st["id"] for st in scenario_for_round["subtasks"]]
            random.shuffle(subtask_ids)
            for j, player in enumerate(team["players"]):
                updates[f"teams.{i}.players.{j}.completed"] = False
                updates[f"teams.{i}.players.{j}.hints_used"] = 0
                updates[f"teams.{i}.players.{j}.subtask_id"] = subtask_ids[j % len(subtask_ids)]
    
    games.update_one({"_id": "single_game"}, {"$set": updates})
    return {"status": "round_started", "round": new_round_number}

@app.post("/api/game/reset")
async def reset_game():
    if games is None:
        raise HTTPException(status_code=503, detail="Database connection not available.")
    games.delete_one({"_id": "single_game"})
    initialize_game()
    return {"status": "reset"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
