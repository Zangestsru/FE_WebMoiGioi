# --- GIAI ĐOẠN 1: BUILD ---
FROM node:22 AS builder
WORKDIR /app
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
