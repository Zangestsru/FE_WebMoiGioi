# --- GIAI ĐOẠN 1: BUILD ---
FROM node:22 AS builder
WORKDIR /app
# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Build code thành file tĩnh (thư mục dist)
COPY . .
RUN npm run build

# --- GIAI ĐOẠN 2: RUN ---
FROM node:22-bookworm-slim
WORKDIR /app
# Cài đặt công cụ 'serve' để chạy web tĩnh
RUN npm install -g serve
# Chỉ lấy thư mục dist từ builder (GĐ1)
COPY --from=builder /app/dist ./dist
# Mở port 80
EXPOSE 80
# Lệnh "bật công tắc" để chạy ứng dụng
ENTRYPOINT ["serve", "-s", "dist", "-l", "80"]
