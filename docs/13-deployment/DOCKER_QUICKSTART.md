# Docker Quick Start Guide

## Cách chạy VNS PickleTrack trên Docker

---

## 1. Yêu cầu

- Docker Desktop hoặc Docker Engine đã cài đặt
- Docker Compose (thường đi kèm với Docker Desktop)

---

## 2. Cách 1: Chạy bằng Docker Compose (Khuyến nghị)

Đây là cách đơn giản nhất.

### Bước 1: Chạy container

```bash
docker-compose up -d
```

### Bước 2: Truy cập ứng dụng

Mở trình duyệt và truy cập:

```
http://localhost:8080
```

### Bước 3: Dừng container

```bash
docker-compose down
```

---

## 3. Cách 2: Chạy bằng Docker Run (Kéo image từ Docker Hub)

Nếu bạn không muốn dùng Docker Compose:

```bash
docker run -d -p 8080:80 --name vnspickletrack-app thevinhtdmu2004/vnspickletrack-app:latest
```

Sau đó truy cập: `http://localhost:8080`

Để dừng:

```bash
docker stop vnspickletrack-app
docker rm vnspickletrack-app
```

---

## 4. Cách 3: Build và chạy trên máy tính (Phát triển cục bộ)

Nếu bạn muốn build image từ source code trên máy:

### Bước 1: Build image

```bash
docker build -t vnspickletrack-app-local .
```

### Bước 2: Chạy container

```bash
docker run -d -p 8080:80 --name vnspickletrack-local vnspickletrack-app-local
```

### Bước 3: Truy cập ứng dụng

```
http://localhost:8080
```

### Bước 4: Dừng container

```bash
docker stop vnspickletrack-local
docker rm vnspickletrack-local
```

---

## 5. Xem logs

Để xem logs của container:

```bash
docker logs vnspickletrack-app
```

Hoặc theo dõi logs real-time:

```bash
docker logs -f vnspickletrack-app
```

---

## 6. Kiểm tra container đang chạy

```bash
docker ps
```

---

## 7. Cấu hình Docker Compose

File `docker-compose.yml` hiện tại:

- **Image:** `thevinhtdmu2004/vnspickletrack-app:latest` (từ Docker Hub)
- **Container name:** `vnspickletrack-prototype`
- **Port mapping:** `8080:80` (máy tính:container)
- **Restart policy:** `unless-stopped`

Để build từ source thay vì kéo từ Docker Hub, hãy bỏ comment các dòng `build:` trong `docker-compose.yml`.

---

## 8. Troubleshooting

### Port 8080 đã được sử dụng

Thay đổi port trong `docker-compose.yml` hoặc trong lệnh `docker run`:

```bash
docker run -d -p 9090:80 --name vnspickletrack-app thevinhtdmu2004/vnspickletrack-app:latest
```

Sau đó truy cập: `http://localhost:9090`

### Container không khởi động

Kiểm tra logs:

```bash
docker logs vnspickletrack-app
```

### Xóa image cũ

```bash
docker rmi thevinhtdmu2004/vnspickletrack-app:latest
```

Sau đó kéo image mới:

```bash
docker pull thevinhtdmu2004/vnspickletrack-app:latest
```

---

## 9. Tài liệu liên quan

- `Dockerfile` — Cấu hình build image
- `docker-compose.yml` — Cấu hình Docker Compose
- `.github/workflows/docker-ci-cd.yml` — CI/CD workflow tự động build và push