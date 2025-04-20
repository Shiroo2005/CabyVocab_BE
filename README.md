# 🚀 AstroVocab - Ứng dụng học từ vựng

AstroVocab là ứng dụng học từ vựng có phân quyền người dùng (`free` / `premium`), xác minh email qua link hoặc mã, và giới hạn tính năng linh hoạt.

---

## 🧠 Sơ đồ kiến trúc hệ thống

<img src="./diagram.png" alt="Sơ đồ kiến trúc hệ thống" width="700"/>

---

## 🔧 Biến môi trường `.env`

Tạo file `.env` ở thư mục gốc theo mẫu dưới đây:

```env
# Database
DB_NAME=your_db_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_PORT=3306
DB_HOST=localhost

# Server URL
HOST_URL=http://localhost:8081

# JWT
JWT_ACCESS_SECRET=dcsxdsckm0qwsa%@,csk_sacm.1cm
JWT_REFRESH_SECRET=ascqwfeqf212e32_DSXKMDS92e3P$_*@!c,rdwk1

JWT_ACCESS_EXPIRE_TIME=15m
JWT_REFRESH_EXPIRE_TIME=7d

# Email
RESEND_API_KEY=re_dgTGCpsg_L7kKahscVMwF5R1uQA8uHDVB
FROM_EMAIL=noreply@astrovocab.id.vn
```
