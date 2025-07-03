# Sử dụng Node.js làm base image
FROM node:20

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript
RUN npm run build

# Chạy ứng dụng từ thư mục đã biên dịch
CMD ["node", "dist/index.js"]
