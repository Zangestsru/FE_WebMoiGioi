# --- GIAI ĐOẠN 1: BUILD ---
FROM node:20-alpine AS builder
WORKDIR /app
# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Build code thành file tĩnh (thư mục dist)
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- GIAI ĐOẠN 2: RUN ---
FROM node:20-alpine
WORKDIR /app
# Cài đặt công cụ 'serve' để chạy web tĩnh
RUN npm install -g serve
# Chỉ lấy thư mục dist từ builder (GĐ1)
COPY --from=builder /app/dist ./dist
# Mở port 80
EXPOSE 80
# Lệnh "bật công tắc" để chạy ứng dụng
ENTRYPOINT ["serve", "-s", "dist", "-l", "80"]
