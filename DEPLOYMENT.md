# دليل نشر وتشغيل مشروع شقق وشاليهات مرسى مطروح
# Marsa Matrouh Flats & Chalets - Server Deployment Guide

هذا المشروع تطبيق مستقل تماماً مبني باستخدام **React 19 + Vite + Tailwind CSS v4 + TypeScript**، ومجهز للعمل محلياً أو على أي خادم سحابي (VPS / Cloud Server / Docker).

---

## 1. التشغيل المحلي للتطوير (Local Development)

```bash
# الانتقال لمجلد المشروع
cd marsa-matrouh-flats

# تثبيت الحزم (إن لم تكن مثبتة)
npm install

# تشغيل خادم التطوير المحلي
npm run dev
```

التطبيق سيعمل على: `http://localhost:5173`

---

## 2. رفع المشروع إلى GitHub / GitLab (Git Push)

لرفع المشروع كمستودع مستقل تماماً:

```bash
cd marsa-matrouh-flats

# تهيئة مستودع Git جديد
git init

# إضافة الملفات
git add .
git commit -m "Initial commit: Marsa Matrouh Flats & Chalets project"

# ربط المستودع برابط GitHub الخاص بك (استبدل الرابط برابطك)
git remote add origin https://github.com/YOUR_USERNAME/marsa-matrouh-flats.git

# تغيير الفرع إلى main والرفع
git branch -M main
git push -u origin main
```

---

## 3. النشر على السيرفر باستخدام Docker (الطريقة الموصى بها 🚀)

المشروع يحتوي بالفعل على ملفات `Dockerfile` و `nginx.conf` و `docker-compose.yml`.

### خطوات النشر على خادمك (Ubuntu / Linux VPS):

1. **تسجيل الدخول إلى السيرفر:**
```bash
ssh user@your-server-ip
```

2. **سحب المشروع من GitHub:**
```bash
git clone https://github.com/YOUR_USERNAME/marsa-matrouh-flats.git
cd marsa-matrouh-flats
```

3. **تشغيل الحاوية عبر Docker Compose:**
```bash
# تشغيل التطبيق في الخلفية وبناء الحاوية تلقائياً
docker compose up -d --build
```

4. **التحقق من حالة الحاوية:**
```bash
docker ps
```

التطبيق الآن يعمل مباشرة على المنفذ 80 (`http://your-server-ip`).

> **ملاحظة لتغيير المنفذ:** يمكنك تشغيله على أي منفذ آخر (مثلاً 8080) بتمرير متغير البيئة:
> ```bash
> PORT=8080 docker compose up -d --build
> ```

---

## 4. إعداد نطاق مخصص (Domain Name) وشهادة SSL مجانية (Let's Encrypt)

إذا كان لديك دومين (مثال: `matrouh-flats.com`):

1. قم بتوجيه سجل `A Record` في لوحة تحكم الدومين إلى IP السيرفر الخاص بك.
2. ثبت Certbot على سيرفر Ubuntu:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```
3. إصدار شهادة SSL:
```bash
sudo certbot --nginx -d matrouh-flats.com -d www.matrouh-flats.com
```

---

## 5. النشر المباشر بدون Docker (Traditional Nginx Build)

إذا كنت تفضل بناء الملفات ووضعها في Nginx مباشرة:

```bash
# 1. بناء ملفات الإنتاج
npm run build

# 2. نسخ محتويات مجلد dist إلى مسار Nginx الافتراضي على السيرفر
sudo cp -r dist/* /var/www/html/

# 3. التأكد من إعداد try_files في /etc/nginx/sites-available/default
# try_files $uri $uri/ /index.html;
sudo systemctl reload nginx
```

---

## 6. نشر سريع بنقرة واحدة (Vercel / Netlify / Cloudflare Pages)

- **Vercel**: قم بربط مستودع GitHub الخاص بالمشروع على [vercel.com](https://vercel.com)، وسيتعرف تلقائياً على Vite. اضغط **Deploy**.
- **Netlify**: قم بإنشاء موقع جديد من Git، وحدد Build command: `npm run build` و Publish directory: `dist`.
