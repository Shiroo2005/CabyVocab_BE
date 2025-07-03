# 🚀 Capyvocab - Ứng dụng học từ vựng

Capyvocab là ứng dụng học từ vựng dành cho Android, có các tính năng: học từ vựng theo chủ đề; ôn tập lại các từ đã học; giao lưu với người dùng khác qua cộng đồng; thử thách bản thân với các bài test do chính người dùng tạo ra; tạo các bài test để người dùng khác làm.

---

## 🧠 Sơ đồ kiến trúc hệ thống

<img src="./diagram.png" alt="Sơ đồ kiến trúc hệ thống" width="700"/>


---

### 🐳 Cài đặt bằng Docker

## 🔧Clone code về tạo `.env`

Tạo file `.env` ở thư mục gốc theo mẫu dưới đây:

```env
# Database
DB_NAME=CABYVOCAB
DB_USERNAME=user
DB_PASSWORD=user001
DB_PORT=3307
DB_HOST=localhost

#URL
HOST_URL=http://localhost:8081
HOST_FE=htpp://10.0.2.2:8081

##JWT
JWT_ACCESS_SECRET=dcsxdsckm0qwsa%@,csk_sacm.1cm
JWT_REFRESH_SECRET=ascqwfeqf212e32_DSXKMDS92e3P$_*@!c,rdwk1


JWT_ACCESS_EXPIRE_TIME=1d
JWT_REFRESH_EXPIRE_TIME=7d

#EMAIL
RESEND_API_KEY=re_dgTGCpsg_L7kKahscVMwF5R1uQA8uHDVB
FROM_EMAIL=noreply@astrovocab.id.vn

#VNPAY
VNPAY_TMnCode=9E7HMEQ7
VNPAY_SecretKey=FC52YAR0TS03CVGB8NKE4X61XNXB3069
VNPAY_HOST=https://sandbox.vnpayment.vn

#OAUTH

#GOOGLE
GOOGLE_CLIENT_ID=220849696417-2hglvrn054910d53dii2dt5bqfp24mdm.apps.googleusercontent.com
```

---

## Chạy chương trình

Mở terminal và gõ: <b>docker compose up -d</b>
