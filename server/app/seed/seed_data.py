from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.subject import Subject
from app.models.game import Game
from app.models.achievement import Achievement
from app.models.mission import Mission
from app.models.reward import Reward
from app.models.story import StoryChapter


def seed_subjects(db: Session):
    subjects = [
        Subject(id=1, name="English Kingdom", name_ar="مملكة الإنجليزية", world_type="english",
                icon="📚", color="#3b82f6", bg_gradient="from-blue-500 to-indigo-600",
                description="Master the English language through fun adventures!", order=1),
        Subject(id=2, name="Math Kingdom", name_ar="مملكة الرياضيات", world_type="math",
                icon="🔢", color="#f59e0b", bg_gradient="from-yellow-400 to-orange-500",
                description="Conquer numbers and equations!", order=2),
        Subject(id=3, name="Science Lab", name_ar="مختبر العلوم", world_type="science",
                icon="🔬", color="#10b981", bg_gradient="from-green-400 to-emerald-600",
                description="Discover the wonders of science!", order=3),
        Subject(id=4, name="Space Galaxy", name_ar="مجرة الفضاء", world_type="space",
                icon="🚀", color="#8b5cf6", bg_gradient="from-purple-500 to-pink-600",
                description="Explore the universe and beyond!", order=4),
    ]
    for s in subjects:
        if not db.query(Subject).filter(Subject.id == s.id).first():
            db.add(s)
    db.commit()


def seed_games(db: Session):
    games = [
        Game(id=1, name="Word Builder", name_ar="بناء الكلمات", subject_id=1, game_type="quiz",
             thumbnail="📝", description="Build words from letters", xp_per_win=20, coin_reward=10, order=1),
        Game(id=2, name="Spelling Bee", name_ar="مسابقة التهجئة", subject_id=1, game_type="spelling",
             thumbnail="🐝", description="Spell words correctly", xp_per_win=25, coin_reward=12, order=2),
        Game(id=3, name="Grammar Quest", name_ar="مغامرة القواعد", subject_id=1, game_type="quiz",
             thumbnail="✏️", description="Learn grammar rules", xp_per_win=30, coin_reward=15, order=3),
        Game(id=4, name="Reading Race", name_ar="سباق القراءة", subject_id=1, game_type="reading",
             thumbnail="📖", description="Read and comprehend passages", xp_per_win=35, coin_reward=18, order=4),
        Game(id=5, name="Vocabulary Vault", name_ar="خزينة المفردات", subject_id=1, game_type="memory",
             thumbnail="🔑", description="Learn new vocabulary words", xp_per_win=20, coin_reward=10, order=5),
        Game(id=6, name="Story Builder", name_ar="بناء القصة", subject_id=1, game_type="creative",
             thumbnail="📚", description="Create your own stories", xp_per_win=40, coin_reward=20, order=6),

        Game(id=7, name="Number Blaster", name_ar="ضارب الأرقام", subject_id=2, game_type="quiz",
             thumbnail="💥", description="Blast through number challenges", xp_per_win=20, coin_reward=10, order=1),
        Game(id=8, name="Fraction Fun", name_ar="متعة الكسور", subject_id=2, game_type="puzzle",
             thumbnail="🍕", description="Master fractions with pizza!", xp_per_win=25, coin_reward=12, order=2),
        Game(id=9, name="Times Tables", name_ar="جداول الضرب", subject_id=2, game_type="memory",
             thumbnail="✖️", description="Memorize multiplication tables", xp_per_win=30, coin_reward=15, order=3),
        Game(id=10, name="Geometry Explorer", name_ar="مستكشف الهندسة", subject_id=2, game_type="puzzle",
             thumbnail="📐", description="Explore shapes and angles", xp_per_win=35, coin_reward=18, order=4),
        Game(id=11, name="Math Maze", name_ar="متاهة الرياضيات", subject_id=2, game_type="maze",
             thumbnail="🌀", description="Solve equations to escape the maze", xp_per_win=40, coin_reward=20, order=5),
        Game(id=12, name="Algebra Attack", name_ar="هجوم الجبر", subject_id=2, game_type="quiz",
             thumbnail="⚡", description="Solve algebraic equations", xp_per_win=45, coin_reward=22, order=6),

        Game(id=13, name="Animal Kingdom", name_ar="مملكة الحيوانات", subject_id=3, game_type="quiz",
             thumbnail="🦁", description="Discover amazing animals", xp_per_win=20, coin_reward=10, order=1),
        Game(id=14, name="Plant Power", name_ar="قوة النباتات", subject_id=3, game_type="quiz",
             thumbnail="🌱", description="Learn about plants and nature", xp_per_win=25, coin_reward=12, order=2),
        Game(id=15, name="Body Systems", name_ar="أجهزة الجسم", subject_id=3, game_type="puzzle",
             thumbnail="🫀", description="Explore the human body", xp_per_win=30, coin_reward=15, order=3),
        Game(id=16, name="Weather Wizard", name_ar="ساحر الطقس", subject_id=3, game_type="quiz",
             thumbnail="⛅", description="Understand weather patterns", xp_per_win=25, coin_reward=12, order=4),
        Game(id=17, name="Chemistry Lab", name_ar="مختبر الكيمياء", subject_id=3, game_type="experiment",
             thumbnail="⚗️", description="Virtual chemistry experiments", xp_per_win=40, coin_reward=20, order=5),
        Game(id=18, name="Ecosystem Explorer", name_ar="مستكشف النظام البيئي", subject_id=3, game_type="quiz",
             thumbnail="🌍", description="Discover ecosystems", xp_per_win=35, coin_reward=18, order=6),

        Game(id=19, name="Planet Hop", name_ar="قفز الكواكب", subject_id=4, game_type="adventure",
             thumbnail="🪐", description="Hop between planets", xp_per_win=25, coin_reward=12, order=1),
        Game(id=20, name="Star Mapper", name_ar="رسام النجوم", subject_id=4, game_type="puzzle",
             thumbnail="⭐", description="Map the night sky constellations", xp_per_win=30, coin_reward=15, order=2),
        Game(id=21, name="Rocket Builder", name_ar="بناء الصاروخ", subject_id=4, game_type="builder",
             thumbnail="🚀", description="Design and launch rockets", xp_per_win=45, coin_reward=22, order=3),
        Game(id=22, name="Black Hole Mystery", name_ar="لغز الثقب الأسود", subject_id=4, game_type="quiz",
             thumbnail="🕳️", description="Unravel space mysteries", xp_per_win=40, coin_reward=20, order=4),
        Game(id=23, name="Asteroid Dodge", name_ar="تجنب الكويكبات", subject_id=4, game_type="action",
             thumbnail="☄️", description="Dodge asteroids in space", xp_per_win=35, coin_reward=18, order=5),
        Game(id=24, name="Galaxy Quest", name_ar="رحلة المجرة", subject_id=4, game_type="adventure",
             thumbnail="🌌", description="Journey across the galaxy", xp_per_win=50, coin_reward=25, order=6),
    ]
    for g in games:
        if not db.query(Game).filter(Game.id == g.id).first():
            db.add(g)
    db.commit()


def seed_achievements(db: Session):
    achievements = [
        Achievement(name="First Steps", name_ar="الخطوات الأولى", icon="👶", rarity="common",
                    condition_type="games_played", condition_value=1, xp_reward=50, coin_reward=20,
                    description="Play your first game"),
        Achievement(name="Game Starter", name_ar="بداية اللعب", icon="🎮", rarity="common",
                    condition_type="games_played", condition_value=5, xp_reward=75, coin_reward=30,
                    description="Play 5 games"),
        Achievement(name="Gamer", name_ar="لاعب", icon="🕹️", rarity="uncommon",
                    condition_type="games_played", condition_value=25, xp_reward=150, coin_reward=60,
                    description="Play 25 games"),
        Achievement(name="XP Hunter", name_ar="صياد XP", icon="⚡", rarity="common",
                    condition_type="xp_total", condition_value=100, xp_reward=50, coin_reward=20,
                    description="Earn 100 XP"),
        Achievement(name="XP Master", name_ar="سيد XP", icon="💫", rarity="uncommon",
                    condition_type="xp_total", condition_value=500, xp_reward=100, coin_reward=50,
                    description="Earn 500 XP"),
        Achievement(name="XP Legend", name_ar="أسطورة XP", icon="🌟", rarity="rare",
                    condition_type="xp_total", condition_value=2000, xp_reward=250, coin_reward=100,
                    description="Earn 2000 XP"),
        Achievement(name="Level 5 Hero", name_ar="بطل المستوى 5", icon="🦸", rarity="uncommon",
                    condition_type="level_reached", condition_value=5, xp_reward=200, coin_reward=80,
                    description="Reach level 5"),
        Achievement(name="Level 10 Champion", name_ar="بطل المستوى 10", icon="🏆", rarity="rare",
                    condition_type="level_reached", condition_value=10, xp_reward=500, coin_reward=200,
                    description="Reach level 10"),
        Achievement(name="Star Collector", name_ar="جامع النجوم", icon="⭐", rarity="common",
                    condition_type="stars_total", condition_value=10, xp_reward=75, coin_reward=30,
                    description="Collect 10 stars"),
        Achievement(name="Coin Millionaire", name_ar="مليونير العملات", icon="💰", rarity="rare",
                    condition_type="coins_total", condition_value=1000, xp_reward=300, coin_reward=150,
                    description="Earn 1000 coins"),
    ]
    for a in achievements:
        if not db.query(Achievement).filter(Achievement.name == a.name).first():
            db.add(a)
    db.commit()


def seed_missions(db: Session):
    missions = [
        Mission(name="Daily Gamer", name_ar="لاعب اليوم", icon="🎮",
                mission_type="daily", reset_type="daily",
                condition_type="play_games", target_count=3,
                xp_reward=50, coin_reward=20, star_reward=1,
                description="Play 3 games today"),
        Mission(name="Perfect Score", name_ar="نتيجة مثالية", icon="🎯",
                mission_type="daily", reset_type="daily",
                condition_type="score_perfect", target_count=1,
                xp_reward=75, coin_reward=30, star_reward=2,
                description="Get a perfect score in any game"),
        Mission(name="Weekly Champion", name_ar="بطل الأسبوع", icon="🏆",
                mission_type="weekly", reset_type="weekly",
                condition_type="play_games", target_count=15,
                xp_reward=200, coin_reward=80, star_reward=5,
                description="Play 15 games this week"),
        Mission(name="English Master", name_ar="سيد الإنجليزية", icon="📚",
                mission_type="daily", reset_type="daily",
                condition_type="play_subject", target_count=2, subject_id=1,
                xp_reward=60, coin_reward=25, star_reward=1,
                description="Play 2 English games"),
        Mission(name="Math Wizard", name_ar="ساحر الرياضيات", icon="🔢",
                mission_type="daily", reset_type="daily",
                condition_type="play_subject", target_count=2, subject_id=2,
                xp_reward=60, coin_reward=25, star_reward=1,
                description="Play 2 Math games"),
    ]
    for m in missions:
        if not db.query(Mission).filter(Mission.name == m.name).first():
            db.add(m)
    db.commit()


def seed_rewards(db: Session):
    rewards = [
        Reward(name="Lion Frame", name_ar="إطار الأسد", icon="🦁", reward_type="avatar_frame",
               cost_coins=100, rarity="common", description="A majestic lion frame"),
        Reward(name="Rainbow Trail", name_ar="مسار قوس قزح", icon="🌈", reward_type="trail",
               cost_coins=150, rarity="uncommon", description="Leave a rainbow trail"),
        Reward(name="Gold Crown", name_ar="التاج الذهبي", icon="👑", reward_type="accessory",
               cost_coins=300, rarity="rare", description="Wear the gold crown"),
        Reward(name="Space Background", name_ar="خلفية الفضاء", icon="🌌", reward_type="background",
               cost_coins=200, rarity="uncommon", description="Space themed background"),
        Reward(name="Dragon Badge", name_ar="شارة التنين", icon="🐉", reward_type="badge",
               cost_gems=5, rarity="epic", description="The rare dragon badge"),
        Reward(name="Star Theme", name_ar="ثيم النجوم", icon="⭐", reward_type="theme",
               cost_coins=250, rarity="uncommon", description="Starry theme for your profile"),
    ]
    for r in rewards:
        if not db.query(Reward).filter(Reward.name == r.name).first():
            db.add(r)
    db.commit()


def seed_story_chapters(db: Session):
    chapters = [
        StoryChapter(subject_id=1, title="The Magic Library", title_ar="المكتبة السحرية",
                     content="Once upon a time, in the heart of the English Kingdom, there was a magical library...",
                     content_ar="كان يا ما كان، في قلب مملكة الإنجليزية، كانت هناك مكتبة سحرية...",
                     illustration="📚", order=1, unlock_xp=0, xp_reward=30),
        StoryChapter(subject_id=1, title="The Word Wizard", title_ar="ساحر الكلمات",
                     content="The young hero discovered a wizard who could transform words into spells...",
                     content_ar="اكتشف البطل الشاب ساحراً يمكنه تحويل الكلمات إلى تعاويذ...",
                     illustration="🧙", order=2, unlock_xp=100, xp_reward=40),
        StoryChapter(subject_id=2, title="The Number Dragon", title_ar="تنين الأرقام",
                     content="In the Math Kingdom, a fearsome dragon guarded the treasure of numbers...",
                     content_ar="في مملكة الرياضيات، كان تنين مخيف يحرس كنز الأرقام...",
                     illustration="🐉", order=1, unlock_xp=0, xp_reward=30),
        StoryChapter(subject_id=3, title="The Science Forest", title_ar="غابة العلوم",
                     content="Deep in the Science Lab forest, mysterious experiments awaited...",
                     content_ar="في أعماق غابة مختبر العلوم، كانت تجارب غامضة بانتظار...",
                     illustration="🌿", order=1, unlock_xp=0, xp_reward=30),
        StoryChapter(subject_id=4, title="Journey to Mars", title_ar="رحلة إلى المريخ",
                     content="The young astronaut was ready to embark on the greatest space adventure...",
                     content_ar="كان رائد الفضاء الشاب مستعداً للشروع في أعظم مغامرة فضائية...",
                     illustration="🚀", order=1, unlock_xp=0, xp_reward=30),
    ]
    for ch in chapters:
        if not db.query(StoryChapter).filter(StoryChapter.title == ch.title).first():
            db.add(ch)
    db.commit()


def seed_users(db: Session):
    users_data = [
        {"username": "admin", "email": "admin@kids.com", "password": "admin123", "role": "admin",
         "display_name": "Admin", "avatar": "👑", "xp": 9999, "level": 50, "coins": 9999, "gems": 999},
        {"username": "parent1", "email": "parent@kids.com", "password": "parent123", "role": "parent",
         "display_name": "Parent User", "avatar": "👨‍👩‍👧", "xp": 500, "level": 5, "coins": 200, "gems": 10},
    ]
    parent_id = None
    for ud in users_data:
        if not db.query(User).filter(User.email == ud["email"]).first():
            u = User(
                username=ud["username"],
                email=ud["email"],
                hashed_password=get_password_hash(ud["password"]),
                role=ud["role"],
                display_name=ud["display_name"],
                avatar=ud["avatar"],
                xp=ud.get("xp", 0),
                level=ud.get("level", 1),
                coins=ud.get("coins", 0),
                gems=ud.get("gems", 0),
                is_active=True,
            )
            db.add(u)
            db.flush()
            if ud["role"] == "parent":
                parent_id = u.id

    db.commit()

    parent = db.query(User).filter(User.email == "parent@kids.com").first()
    if parent:
        children_data = [
            {"username": "child_ali", "display_name": "Ali", "avatar": "🦁", "xp": 250, "level": 3, "coins": 80},
            {"username": "child_sara", "display_name": "Sara", "avatar": "🦋", "xp": 180, "level": 2, "coins": 60},
        ]
        for cd in children_data:
            if not db.query(User).filter(User.username == cd["username"]).first():
                child = User(
                    username=cd["username"],
                    display_name=cd["display_name"],
                    avatar=cd["avatar"],
                    role="child",
                    parent_id=parent.id,
                    xp=cd.get("xp", 0),
                    level=cd.get("level", 1),
                    coins=cd.get("coins", 0),
                    is_active=True,
                )
                db.add(child)
        db.commit()


def run_all_seeds(db: Session):
    print("🌱 Seeding subjects...")
    seed_subjects(db)
    print("🎮 Seeding games...")
    seed_games(db)
    print("🏆 Seeding achievements...")
    seed_achievements(db)
    print("🎯 Seeding missions...")
    seed_missions(db)
    print("🛍 Seeding rewards...")
    seed_rewards(db)
    print("📖 Seeding story chapters...")
    seed_story_chapters(db)
    print("👥 Seeding users...")
    seed_users(db)
    print("✅ All seeds complete!")
