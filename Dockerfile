# --- GIAI ĐOẠN 1: BUILD ---
FROM node:20-alpine AS builder
WORKDIR /app
# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Build code thành file tĩnh (thư mục dist)
COPY . .

# Đón nhận các biến build-time từ GitHub Actions
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FACEBOOK_APP_ID

# Đưa vào môi trường build của Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_FACEBOOK_APP_ID=$VITE_FACEBOOK_APP_ID

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
