import uuid
import random
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.game import Game
from app.models.subject import Subject


QUESTION_BANKS: Dict[str, List[Dict[str, Any]]] = {
    "english": [
        {"q": "What is the plural of 'cat'?", "options": ["cats", "cates", "cat's", "catz"], "answer": 0},
        {"q": "Choose the correct spelling:", "options": ["beautifull", "beautiful", "beutiful", "beautifull"], "answer": 1},
        {"q": "What is the opposite of 'happy'?", "options": ["sad", "glad", "angry", "tired"], "answer": 0},
        {"q": "Fill in: 'She ___ to school every day.'", "options": ["go", "goes", "going", "gone"], "answer": 1},
        {"q": "Which is a noun?", "options": ["run", "quickly", "apple", "beautiful"], "answer": 2},
        {"q": "What letter comes after 'D'?", "options": ["E", "F", "C", "B"], "answer": 0},
        {"q": "How many vowels are in 'elephant'?", "options": ["2", "3", "4", "5"], "answer": 1},
    ],
    "math": [
        {"q": "What is 7 × 8?", "options": ["54", "56", "58", "52"], "answer": 1},
        {"q": "What is 15 + 27?", "options": ["40", "41", "42", "43"], "answer": 2},
        {"q": "What is 100 ÷ 4?", "options": ["20", "24", "25", "30"], "answer": 2},
        {"q": "What is the square root of 81?", "options": ["7", "8", "9", "10"], "answer": 2},
        {"q": "What is 3²?", "options": ["6", "8", "9", "12"], "answer": 2},
        {"q": "What is 50% of 80?", "options": ["30", "35", "40", "45"], "answer": 2},
        {"q": "What is 13 - 7?", "options": ["5", "6", "7", "8"], "answer": 1},
    ],
    "science": [
        {"q": "What is the closest star to Earth?", "options": ["Alpha Centauri", "The Sun", "Sirius", "Betelgeuse"], "answer": 1},
        {"q": "How many planets are in our solar system?", "options": ["7", "8", "9", "10"], "answer": 1},
        {"q": "What gas do plants breathe in?", "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], "answer": 2},
        {"q": "What is the chemical symbol for water?", "options": ["WA", "HO", "H2O", "W2O"], "answer": 2},
        {"q": "Which animal is the largest?", "options": ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], "answer": 1},
        {"q": "What organ pumps blood?", "options": ["Lung", "Brain", "Heart", "Liver"], "answer": 2},
    ],
    "space": [
        {"q": "What planet is known as the Red Planet?", "options": ["Venus", "Mars", "Jupiter", "Saturn"], "answer": 1},
        {"q": "What is a light-year?", "options": ["A year of light", "Distance light travels in one year", "A bright year", "A unit of time"], "answer": 1},
        {"q": "How many moons does Earth have?", "options": ["0", "1", "2", "3"], "answer": 1},
        {"q": "What galaxy is Earth in?", "options": ["Andromeda", "Triangulum", "Milky Way", "Whirlpool"], "answer": 2},
        {"q": "Who was the first human on the Moon?", "options": ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], "answer": 1},
    ],
}


class GameService:

    @staticmethod
    def generate_questions(game: Game, subject: Subject, difficulty: int, count: int = 5) -> List[Dict[str, Any]]:
        world = subject.world_type.lower()
        bank = QUESTION_BANKS.get(world, QUESTION_BANKS["math"])
        questions = random.sample(bank, min(count, len(bank)))
        result = []
        for i, q in enumerate(questions):
            result.append({
                "id": i + 1,
                "question": q["q"],
                "options": q["options"],
                "correct_index": q["answer"],
                "difficulty": difficulty,
                "points": 10 + (difficulty * 5),
            })
        return result

    @staticmethod
    def start_game(db: Session, game_id: int, difficulty: int) -> Dict[str, Any]:
        game = db.query(Game).filter(Game.id == game_id, Game.is_active == True).first()
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        subject = db.query(Subject).filter(Subject.id == game.subject_id).first()
        questions = GameService.generate_questions(game, subject, difficulty)
        return {
            "session_id": str(uuid.uuid4()),
            "game_id": game.id,
            "game_name": game.name,
            "subject": subject.name,
            "questions": questions,
            "time_limit": game.time_limit_seconds,
            "difficulty": difficulty,
            "xp_per_win": game.xp_per_win,
        }
