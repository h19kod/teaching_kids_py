# 📦 Installation Guide

## 🎓 Kids Learning Adventure — Python Edition

دليل التثبيت الشامل لمشروع التعليم التفاعلي للأطفال المبني بـ **FastAPI + React + Tailwind CSS**

---

## 📋 المتطلبات الأساسية

### النظام
- **Windows 10/11** (موصى به)
- **macOS** 10.15+ 
- **Linux** (Ubuntu 18.04+)

### البرامج المطلوبة
- **Python** 3.10 أو أحدث
- **Node.js** 18.0 أو أحدث
- **npm** 8.0 أو أحدث (يأتي مع Node.js)
- **Git** (لتحميل المشروع)

---

## 🔧 التحقق من المتطلبات

### التحقق من Python
```bash
python --version
# أو
python3 --version
# يجب أن يكون 3.10+
```

### التحقق من Node.js
```bash
node --version
# يجب أن يكون 18.0+
npm --version
# يجب أن يكون 8.0+
```

### التحقق من Git
```bash
git --version
```

---

## 📥 خطوات التثبيت

### 1️⃣ تحميل المشروع
```bash
# استنساخ المستودع
git clone <repository-url>
cd teaching_kids_py
```

### 2️⃣ تثبيت Backend (FastAPI)

#### الدخول لمجلد السيرفر
```bash
cd server
```

#### إنشاء بيئة افتراضية
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### تثبيت الحزم
```bash
pip install -r requirements.txt
```

#### ملف requirements.txt يحتوي على:
```
fastapi==0.104.1              # إطار العمل الرئيسي
uvicorn[standard]==0.24.0     # خادم الويب
sqlalchemy==2.0.23           # ORM للقاعدة البيانات
alembic==1.12.1              # ترحيل القاعدة البيانات
pydantic==2.5.0              # التحقق من البيانات
pydantic-settings==2.1.0     # إعدادات التطبيق
python-jose[cryptography]==3.3.0  # JWT tokens
passlib[bcrypt]==1.7.4       # تشفير كلمات المرور
python-multipart==0.0.6      # رفع الملفات
apscheduler==3.10.4          # جدولة المهام
reportlab==4.0.7             # إنشاء PDF
websockets==12.0             # WebSocket support
aiofiles==23.2.1             # الملفات غير المتزامنة
httpx==0.25.2                # HTTP client
python-dotenv==1.0.0         # متغيرات البيئة
Pillow==10.1.0               # معالجة الصور
```

### 3️⃣ تثبيت Frontend (React)

#### الدخول لمجلد العميل
```bash
cd ../client
```

#### تثبيت الحزم
```bash
npm install
```

#### ملف package.json يحتوي على:

**الاعتماديات الرئيسية:**
- `react@^18.2.0` - مكتبة الواجهة الأمامية
- `react-dom@^18.2.0` - DOM rendering
- `react-router-dom@^6.20.0` - التوجيه
- `axios@^1.6.2` - طلبات HTTP
- `zustand@^4.4.7` - إدارة الحالة
- `react-hot-toast@^2.4.1` - الإشعارات
- `lucide-react@^0.294.0` - الأيقونات
- `recharts@^2.10.1` - المخططات البيانية
- `framer-motion@^10.16.16` - الرسوم المتحركة
- `react-i18next@^13.5.0` - التدويل
- `i18next@^23.7.6` - التدويل
- `clsx@^2.0.0` - أسماء الكلاسات الديناميكية

**اعتماديات التطوير:**
- `@vitejs/plugin-react@^4.2.1` - Vite plugin
- `vite@^5.0.8` - أداة البناء
- `tailwindcss@^3.3.6` - CSS framework
- `autoprefixer@^10.4.16` - CSS post-processing
- `postcss@^8.4.32` - CSS processing

---

## 🚀 تشغيل التطبيق

### الطريقة السريعة (ملفات الباتش)

#### تشغيل Backend
```bash
# من المجلد الرئيسي
start_backend.bat
```

#### تشغيل Frontend
```bash
# من المجلد الرئيسي
start_frontend.bat
```

### الطريقة اليدوية

#### 1️⃣ تشغيل Backend
```bash
cd server
# تفعيل البيئة الافتراضية
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# تشغيل الخادم
uvicorn app.main:app --reload --port 8000
```

#### 2️⃣ تشغيل Frontend (في نافذة جديدة)
```bash
cd client
npm run dev
```

---

## 🌐 الوصول للتطبيق

بعد تشغيل كلا الجزئين:

- **الواجهة الأمامية**: http://localhost:5173
- **الواجهة الخلفية**: http://localhost:8000
- **وثائق API**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **فحص الصحة**: http://localhost:8000/health

---

## 🔑 بيانات الدخول الافتراضية

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|-------------------|-------------|
| 👑 مدير النظام | admin@kids.com | admin123 |
| 👨‍👩‍👧 ولي أمر | parent@kids.com | parent123 |
| 🧒 طفل | من لوحة ولي الأمر | بدون كلمة مرور |

---

## 🗄️ إعداد القاعدة البيانات

القاعدة البيانات تُنشأ تلقائياً عند أول تشغيل للـ Backend:

- **النوع**: SQLite
- **الموقع**: `server/kids_learning.db`
- **الجداول**: 15 جدول (يتم إنشاؤها تلقائياً)
- **البيانات الأولية**: تُضاف تلقائياً (مستخدمين، ألعاب، مواد، مهمات...)

---

## ⚙️ الإعدادات المتقدمة

### متغيرات البيئة (server/.env)
```env
# إعدادات التطبيق
APP_NAME="Kids Learning Adventure"
DEBUG=True
SECRET_KEY=your-secret-key-here

# إعدادات القاعدة البيانية
DATABASE_URL=sqlite:///./kids_learning.db

# إعدادات CORS
ALLOWED_ORIGINS=["http://localhost:5173"]

# إعدادات JWT
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
```

### إعدادات Tailwind CSS (client/tailwind.config.js)
- دعم الوضع الداكن
- تصميم متجاوب
- ألوان مخصصة للأطفال

---

## 🔧 حل المشاكل الشائعة

### مشاكل Python
```bash
# مشكلة تفعيل البيئة الافتراضية (Windows)
venv\Scripts\activate

# إذا لم يعمل، جرب:
venv\Scripts\activate.bat

# مشكلة في تثبيت الحزم
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### مشاكل Node.js
```bash
# مسح الـ cache
npm cache clean --force

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### مشاكل المنافذ
```bash
# تغيير منفذ Backend
uvicorn app.main:app --reload --port 8001

# تغيير منفذ Frontend (في client/vite.config.js)
server: {
  port: 3000
}
```

### مشاكل الصلاحيات (Windows)
```bash
# تشغيل PowerShell كمسؤول
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📱 المتطلبات للنشر

### للنشر على Vercel (Frontend)
```bash
cd client
npm run build
# نشر مجلد dist
```

### للنشر على Railway/Heroku (Backend)
```bash
cd server
# إضافة Procfile
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 🔄 التحديث والصيانة

### تحديث Backend
```bash
cd server
git pull
pip install -r requirements.txt --upgrade
```

### تحديث Frontend
```bash
cd client
git pull
npm install
npm run build
```

### نسخ احتياطي للقاعدة البيانات
```bash
cd server
cp kids_learning.db kids_learning_backup.db
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من المتطلبات الأساسية
2. اتبع خطوات حل المشاكل
3. تحقق من الـ console logs في المتصفح
4. تحقق من terminal output للـ Backend
5. راجع وثائق API: http://localhost:8000/api/docs

---

## ✅ التحقق من التثبيت

بعد التثبيت، تأكد من:

- [ ] Backend يعمل على http://localhost:8000
- [ ] Frontend يعمل على http://localhost:5173
- [ ] وثائق API متاحة على http://localhost:8000/api/docs
- [ ] تسجيل الدخول يعمل مع البيانات الافتراضية
- [ ] الألعاب تظهر وتعمل
- [ ] القاعدة البيانات أُنشئت بنجاح

---

**🎉 مبروك! تم تثبيت المشروع بنجاح.**
