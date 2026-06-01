# 🎓 Kids Learning Adventure — Python Edition

مشروع تعليمي تفاعلي للأطفال مبني بـ **FastAPI + React + Tailwind CSS**

---

## 🏗 هيكل المشروع

```
teaching_kids_py/
├── client/                  ← React 18 + Vite + Tailwind CSS
│   └── src/
│       ├── pages/           ← 12 صفحة
│       ├── components/      ← Layout + مكونات مشتركة
│       ├── store/           ← Zustand (Auth State)
│       └── lib/             ← Axios API client
│
├── server/
│   └── app/
│       ├── main.py          ← FastAPI entry point
│       ├── core/            ← Config + JWT + Dependencies
│       ├── models/          ← 15 SQLAlchemy model
│       ├── schemas/         ← Pydantic DTOs
│       ├── api/routes/      ← 15 مجموعة API
│       ├── services/        ← Business Logic
│       ├── db/              ← Database session
│       └── seed/            ← Seed data (users, games, missions...)
│
├── start_backend.bat        ← تشغيل السيرفر
└── start_frontend.bat       ← تشغيل الواجهة
```

---

## 🚀 طريقة التشغيل

### المتطلبات
- **Python** 3.10+
- **Node.js** 18+

### الخطوات

**1 — تشغيل الـ Backend (FastAPI):**
```bash
# انقر مرتين على:
start_backend.bat

# أو يدوياً:
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**2 — تشغيل الـ Frontend (React):**
```bash
# انقر مرتين على:
start_frontend.bat

# أو يدوياً:
cd client
npm install
npm run dev
```

**3 — افتح المتصفح:**
- 🌐 الواجهة: http://localhost:5173
- 📚 API Docs: http://localhost:8000/api/docs

---

## 🔑 بيانات الدخول

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| 👑 Admin | admin@kids.com | admin123 |
| 👨‍👩‍👧 Parent | parent@kids.com | parent123 |
| 🧒 Child | من لوحة ولي الأمر | بدون كلمة مرور |

---

## ✨ الميزات

| الميزة | التقنية |
|--------|---------|
| 🔐 JWT Auth + Child Login | FastAPI + python-jose |
| 🗄 Database (15 جدول) | SQLAlchemy + SQLite |
| 🎮 24 لعبة تعليمية | 4 مواد × 6 ألعاب |
| 🤖 التعلم التكيفي | AdaptiveService |
| 🎯 مهمات يومية/أسبوعية | APScheduler |
| 🏆 نظام إنجازات | AchievementService |
| 🛍 متجر المكافآت | RewardService |
| 📖 القصص التعليمية | StoryChapter Model |
| 🏅 المتصدرون | SQLAlchemy Aggregation |
| 📊 الإحصائيات | Statistics Model |
| 🎓 شهادات PDF | ReportLab |
| 🌙 الوضع الداكن | Tailwind dark: |
| 🌐 i18n عربي/إنجليزي | react-i18next |
| 📱 Responsive | Tailwind CSS |

---

## 📡 API Endpoints

| Module | Prefix |
|--------|--------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Subjects | `/api/subjects` |
| Games | `/api/games` |
| Progress | `/api/progress` |
| Adaptive | `/api/adaptive` |
| Missions | `/api/missions` |
| Rewards | `/api/rewards` |
| Achievements | `/api/achievements` |
| Story | `/api/story` |
| Characters | `/api/characters` |
| Leaderboard | `/api/leaderboard` |
| Stats | `/api/stats` |
| Notifications | `/api/notifications` |
| Certificates | `/api/certificates` |
