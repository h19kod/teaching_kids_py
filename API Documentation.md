# 📚 API Documentation

## 🎓 Kids Learning Adventure — FastAPI Backend

وثائق API الشاملة لمشروع التعليم التفاعلي للأطفال

---

## 🔗 معلومات الأساسية

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`
- **API Version**: `1.0.0`

### 📖 وثائق تفاعلية
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

---

## 🔐 المصادقة (Authentication)

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Endpoints

#### POST `/api/auth/login`
تسجيل الدخول للمستخدمين

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "display_name": "Display Name",
    "role": "parent|admin|child",
    "avatar": "🦁",
    "level": 5,
    "xp": 1500,
    "coins": 100,
    "stars": 25
  }
}
```

#### POST `/api/auth/register`
إنشاء حساب جديد

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "password123",
  "display_name": "New User",
  "role": "parent"
}
```

**Response:** نفس استجابة تسجيل الدخول

#### POST `/api/auth/child-login/{child_id}`
تسجيل دخول الطفل (يتطلب مصادقة ولي الأمر)

**Path Parameters:**
- `child_id` (int): معرف الطفل

**Response:**
```json
{
  "access_token": "child_jwt_token",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "username": "child_username",
    "display_name": "Child Name",
    "role": "child",
    "parent_id": 1
  }
}
```

#### GET `/api/auth/me`
الحصول على معلومات المستخدم الحالي

**Response:** معلومات المستخدم الكاملة

#### POST `/api/auth/logout`
تسجيل الخروج

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 👥 المستخدمون (Users)

### GET `/api/users/me`
الحصول على ملف المستخدم الشخصي

**Response:** معلومات المستخدم الكاملة

### PUT `/api/users/me`
تحديث ملف المستخدم الشخصي

**Request Body:**
```json
{
  "display_name": "Updated Name",
  "avatar": "🦊",
  "bio": "My bio"
}
```

### POST `/api/users/me/change-password`
تغيير كلمة المرور

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

### GET `/api/users/children`
الحصول على قائمة الأطفال (لولي الأمر)

**Response:**
```json
[
  {
    "id": 2,
    "username": "child1",
    "display_name": "Child One",
    "avatar": "🦁",
    "level": 3,
    "xp": 500,
    "coins": 50,
    "stars": 10
  }
]
```

### POST `/api/users/children`
إنشاء حساب طفل جديد

**Request Body:**
```json
{
  "username": "newchild",
  "display_name": "New Child",
  "avatar": "🐸"
}
```

### DELETE `/api/users/children/{child_id}`
حذف حساب طفل

**Path Parameters:**
- `child_id` (int): معرف الطفل

### GET `/api/users/` (Admin فقط)
الحصول على قائمة جميع المستخدمين

### GET `/api/users/{user_id}` (Admin فقط)
الحصول على معلومات مستخدم محدد

### PUT `/api/users/{user_id}/toggle-active` (Admin فقط)
تفعيل/إلغاء تفعيل مستخدم

---

## 📚 المواد الدراسية (Subjects)

### GET `/api/subjects/`
الحصول على قائمة المواد الدراسية

**Response:**
```json
[
  {
    "id": 1,
    "name": "Mathematics",
    "name_ar": "الرياضيات",
    "description": "Learn basic math",
    "description_ar": "تعلم الرياضيات الأساسية",
    "icon": "🔢",
    "color": "#3B82F6",
    "order": 1,
    "is_active": true,
    "games_count": 6
  }
]
```

### GET `/api/subjects/{subject_id}`
الحصول على تفاصيل مادة معينة

**Path Parameters:**
- `subject_id` (int): معرف المادة

### GET `/api/subjects/{subject_id}/games`
الحصول على ألعاب مادة معينة

**Response:**
```json
[
  {
    "id": 1,
    "name": "Number Recognition",
    "name_ar": "التعرف على الأرقام",
    "description": "Learn numbers 1-10",
    "description_ar": "تعلم الأرقام 1-10",
    "icon": "🔢",
    "subject_id": 1,
    "game_type": "quiz",
    "difficulty": "easy",
    "order": 1,
    "is_active": true
  }
]
```

---

## 🎮 الألعاب (Games)

### GET `/api/games/`
الحصول على قائمة جميع الألعاب النشطة

**Response:**
```json
[
  {
    "id": 1,
    "name": "Number Recognition",
    "name_ar": "التعرف على الأرقام",
    "description": "Learn numbers 1-10",
    "description_ar": "تعلم الأرقام 1-10",
    "icon": "🔢",
    "subject_id": 1,
    "game_type": "quiz",
    "difficulty": "easy",
    "order": 1,
    "is_active": true,
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "name_ar": "الرياضيات"
    }
  }
]
```

### GET `/api/games/{game_id}`
الحصول على تفاصيل لعبة معينة

### POST `/api/games/play`
بدء لعبة

**Request Body:**
```json
{
  "game_id": 1,
  "difficulty": "easy|medium|hard"
}
```

**Response:**
```json
{
  "session_id": "uuid-session-id",
  "game_data": {
    "questions": [...],
    "time_limit": 300,
    "max_score": 100
  }
}
```

---

## 📈 التقدم (Progress)

### POST `/api/progress/submit`
تسجيل نتيجة اللعبة

**Request Body:**
```json
{
  "game_id": 1,
  "session_id": "uuid-session-id",
  "score": 85,
  "time_seconds": 120,
  "correct_answers": 8,
  "total_answers": 10,
  "difficulty": "easy",
  "xp_earned": 50,
  "coins_earned": 10,
  "stars_earned": 2
}
```

**Response:**
```json
{
  "progress_id": 123,
  "level_up": true,
  "new_level": 6,
  "achievements_unlocked": [
    {
      "id": 1,
      "name": "First Win",
      "icon": "🏆"
    }
  ],
  "total_xp": 1550,
  "total_coins": 110
}
```

### GET `/api/progress/history`
الحصول على سجل التقدم

**Query Parameters:**
- `limit` (int, optional): عدد النتائج (الافتراضي: 20)

**Response:**
```json
[
  {
    "id": 123,
    "game_id": 1,
    "game_name": "Number Recognition",
    "score": 85,
    "time_seconds": 120,
    "correct_answers": 8,
    "total_answers": 10,
    "xp_earned": 50,
    "completed_at": "2024-01-15T10:30:00Z"
  }
]
```

### GET `/api/progress/stats`
الحصول على إحصائيات التقدم

**Response:**
```json
{
  "overall": {
    "games_played": 45,
    "avg_score": 78.5,
    "best_score": 100,
    "total_xp": 1550,
    "total_time_seconds": 5400,
    "correct_answers": 360,
    "total_answers": 450,
    "accuracy": 80.0
  },
  "1": {
    "games_played": 15,
    "avg_score": 85.2,
    "best_score": 100,
    "total_xp": 750,
    "accuracy": 85.0
  }
}
```

---

## 🎯 المهمات (Missions)

### GET `/api/missions/`
الحصول على مهمات المستخدم

**Response:**
```json
[
  {
    "id": 1,
    "mission_id": 1,
    "name": "Daily Player",
    "name_ar": "لاعب يومي",
    "description": "Play 3 games today",
    "description_ar": "الععب 3 ألعاب اليوم",
    "icon": "🎮",
    "mission_type": "daily",
    "xp_reward": 50,
    "coin_reward": 10,
    "star_reward": 1,
    "target_count": 3,
    "current_count": 2,
    "completed": false,
    "claimed": false,
    "reset_at": "2024-01-16T00:00:00Z"
  }
]
```

### POST `/api/missions/{user_mission_id}/claim`
استلام مكافأة المهمة

**Path Parameters:**
- `user_mission_id` (int): معرف مهمة المستخدم

**Response:**
```json
{
  "message": "Mission reward claimed successfully",
  "xp_awarded": 50,
  "coins_awarded": 10,
  "stars_awarded": 1,
  "total_xp": 1600,
  "total_coins": 120,
  "total_stars": 26
}
```

---

## 🏆 الإنجازات (Achievements)

### GET `/api/achievements/`
الحصول على قائمة الإنجازات

**Response:**
```json
[
  {
    "id": 1,
    "name": "First Win",
    "name_ar": "الفوز الأول",
    "description": "Win your first game",
    "description_ar": "فز بأول لعبة",
    "icon": "🏆",
    "requirement_type": "games_won",
    "requirement_value": 1,
    "xp_reward": 100,
    "is_active": true,
    "earned": true,
    "earned_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## 🛍 المكافآت (Rewards)

### GET `/api/rewards/`
الحصول على قائمة المكافآت المتاحة

**Response:**
```json
[
  {
    "id": 1,
    "name": "Golden Crown",
    "name_ar": "التاج الذهبي",
    "description": "A shiny golden crown",
    "description_ar": "تاج ذهبي لامع",
    "icon": "👑",
    "reward_type": "avatar",
    "price_coins": 100,
    "is_active": true,
    "owned": false
  }
]
```

### POST `/api/rewards/buy`
شراء مكافأة

**Request Body:**
```json
{
  "reward_id": 1
}
```

**Response:**
```json
{
  "message": "Reward purchased successfully",
  "inventory_id": 45,
  "coins_spent": 100,
  "remaining_coins": 20
}
```

### GET `/api/rewards/inventory`
الحصول على مخزون المستخدم

**Response:**
```json
[
  {
    "id": 45,
    "reward_id": 1,
    "reward_name": "Golden Crown",
    "reward_icon": "👑",
    "reward_type": "avatar",
    "is_equipped": true,
    "purchased_at": "2024-01-15T11:00:00Z"
  }
]
```

### POST `/api/rewards/inventory/{inventory_id}/equip`
ارتداء/تفعيل مكافأة

**Path Parameters:**
- `inventory_id` (int): معرف عنصر المخزون

---

## 🏅 المتصدرون (Leaderboard)

### GET `/api/leaderboard/global`
التصنيف العالمي

**Query Parameters:**
- `limit` (int, optional): عدد النتائج (الافتراضي: 20)

**Response:**
```json
[
  {
    "rank": 1,
    "user_id": 5,
    "username": "topplayer",
    "display_name": "Top Player",
    "avatar": "🏆",
    "level": 15,
    "score": 5000,
    "xp_gained": 2500,
    "games_played": 150,
    "is_current_user": false
  }
]
```

### GET `/api/leaderboard/subject/{subject_id}`
التصنيف حسب المادة

**Path Parameters:**
- `subject_id` (int): معرف المادة

### GET `/api/leaderboard/weekly`
التصنيف الأسبوعي

---

## 📊 الإحصائيات (Stats)

### GET `/api/stats/overview`
نظرة عامة على الإحصائيات

**Response:**
```json
{
  "total_users": 1250,
  "active_users_today": 85,
  "total_games_played": 15600,
  "total_learning_time_hours": 520,
  "popular_subjects": [
    {"subject_id": 1, "name": "Mathematics", "games_played": 5200},
    {"subject_id": 2, "name": "Science", "games_played": 3800}
  ],
  "engagement_rate": 78.5
}
```

---

## 🌟 الشخصيات (Characters)

### GET `/api/characters/`
الحصول على قائمة الشخصيات

### GET `/api/characters/{character_id}`
الحصول على تفاصيل شخصية

### POST `/api/characters/select`
اختيار شخصية

---

## 📖 القصص (Story)

### GET `/api/story/chapters`
الحصول على قائمة الفصول

### GET `/api/story/chapters/{chapter_id}`
الحصول على تفاصيل الفصل

### POST `/api/story/chapters/{chapter_id}/complete`
إكمال الفصل

---

## 🔔 الإشعارات (Notifications)

### GET `/api/notifications/`
الحصول على قائمة الإشعارات

### POST `/api/notifications/{notification_id}/read`
تعيين الإشعار كمقروء

---

## 📜 الشهادات (Certificates)

### GET `/api/certificates/`
الحصول على قائمة الشهادات

### POST `/api/certificates/generate`
إنشاء شهادة جديدة

### GET `/api/certificates/{certificate_id}/download`
تحميل شهادة PDF

---

## 🤖 التعلم التكيفي (Adaptive)

### GET `/api/adaptive/recommendations`
الحصول على توصيات مخصصة

**Response:**
```json
{
  "recommended_games": [
    {
      "game_id": 5,
      "game_name": "Advanced Addition",
      "reason": "Based on your progress in basic math",
      "difficulty": "medium"
    }
  ],
  "suggested_subjects": [
    {
      "subject_id": 3,
      "subject_name": "Science",
      "reason": "You might enjoy this subject"
    }
  ],
  "learning_path": {
    "current_stage": "Intermediate",
    "next_milestone": "Complete 10 medium difficulty games",
    "progress_percentage": 65
  }
}
```

### POST `/api/adaptive/feedback`
إرسال تغذية راجعة للنظام التكيفي

**Request Body:**
```json
{
  "game_id": 1,
  "difficulty_rating": "easy|medium|hard",
  "enjoyment_rating": 1,
  "feedback_text": "Too easy for me"
}
```

---

## 🚨 أخطاء شائعة

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```
**الحل:** التأكد من إرسال توكن JWT صحيح في الهيدر

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```
**الحل:** التأكد من صلاحيات المستخدم للوصول للمورد

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```
**الحل:** التأكد من صحة المعرّف المُرسل

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
**الحل:** التأكد من جميع الحقول المطلوبة في الطلب

---

## 🔄 أمثلة عملية

### مثال تسجيل دخول كامل
```bash
# 1. تسجيل الدخول
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@kids.com",
    "password": "parent123"
  }'

# 2. الحصول على الألعاب
curl -X GET "http://localhost:8000/api/games/" \
  -H "Authorization: Bearer <token>"

# 3. بدء لعبة
curl -X POST "http://localhost:8000/api/games/play" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": 1,
    "difficulty": "easy"
  }'
```

---

## 📝 ملاحظات هامة

1. **جميع الطلبات** تتطلب توكن JWT باستثناء تسجيل الدخول والتسجيل
2. **الوقت** يستخدم صيغة ISO 8601 UTC
3. **الترقيم** يبدأ من 1 في معظم الاستجابات
4. **اللغة** تدعم العربية والإنجليزية في حقول `name` و `name_ar`
5. **الحدود** معظم الطلبات لها حدود افتراضية (20-100 نتيجة)
6. **الفلترة** يمكن استخدام query parameters للفلترة والترتيب

---

## 🛠 أدوات التطوير

### Postman Collection
يمكن استيراد مجموعة Postman جاهزة من:
```
docs/postman-collection.json
```

### OpenAPI Specification
ملف المواصفات متاح على:
```
http://localhost:8000/openapi.json
```

---

**🎉 تم إعداد الوثائق بنجاح!**
