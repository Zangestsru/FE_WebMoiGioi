# --- GIAI ĐOẠN 1: BUILD ---
FROM node:22 AS builder
WORKDIR /app

# Nhận biến từ CI build-args và expose cho Vite (bake vào JS bundle lúc build)
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_BASE_URL
ARG VITE_REGISTER_BG_IMAGE
ARG VITE_FACEBOOK_APP_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_REGISTER_BG_IMAGE=$VITE_REGISTER_BG_IMAGE
ENV VITE_FACEBOOK_APP_ID=$VITE_FACEBOOK_APP_ID

# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Build code thành file tĩnh (thư mục dist)
COPY . .
RUN npm run build

# --- GIAI ĐOẠN 2: RUN VỚI NGINX ---
FROM nginx:alpine
# Copy file tĩnh (kết quả của GĐ1) vào thư mục web mặc định của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy file cấu hình Nginx do chúng ta tự viết đè lên cấu hình mặc định
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
