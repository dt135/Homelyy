# Homelyy Deployment Guide

Tai lieu nay dung cho setup production/demo hien tai:

- VPS Ubuntu 24.04
- Nginx serve frontend static
- PM2 run backend Node.js
- MongoDB Atlas
- Cloudinary
- Domain + HTTPS qua Duck DNS va Let's Encrypt

## 1. Thu muc tren VPS

- Project source: `/var/www/Homelyy`
- Frontend build output dang duoc serve: `/var/www/homelyy`
- Nginx config: `/etc/nginx/sites-available/homelyy`

## 2. Bien moi truong

### Backend

File: `/var/www/Homelyy/backend/.env`

```env
NODE_ENV=production
PORT=4000
CLIENT_URL=https://homelyy.duckdns.org
CORS_ALLOWED_ORIGINS=https://homelyy.duckdns.org
MONGODB_URI=your_mongodb_atlas_uri
DB_NAME=homelyy
AUTO_SEED=false
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend

File: `/var/www/Homelyy/frontend/.env.production`

```env
VITE_API_BASE_URL=/api
```

## 3. Deploy lan dau

### Cai package he thong

```bash
apt update && apt upgrade -y
apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2
```

### Clone repo

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/dt135/Homelyy.git Homelyy
```

### Cai backend

```bash
cd /var/www/Homelyy/backend
npm install --omit=dev
```

Tao `backend/.env`, sau do chay:

```bash
pm2 start src/server.js --name homelyy-backend
pm2 save
pm2 startup
```

Neu `pm2 startup` in ra mot lenh them, copy va chay lenh do, roi chay lai:

```bash
pm2 save
```

### Cai frontend

```bash
cd /var/www/Homelyy/frontend
npm install
npm run build
mkdir -p /var/www/homelyy
cp -r dist/* /var/www/homelyy/
```

### Cau hinh Nginx

File: `/etc/nginx/sites-available/homelyy`

```nginx
server {
    listen 80;
    server_name homelyy.duckdns.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name homelyy.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/homelyy.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/homelyy.duckdns.org/privkey.pem;

    root /var/www/homelyy;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Bat site:

```bash
ln -s /etc/nginx/sites-available/homelyy /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 4. HTTPS voi Let's Encrypt

Neu `certbot --nginx` gap loi encoding, dung cach da ap dung:

```bash
apt install -y certbot python3-certbot-nginx
systemctl stop nginx
certbot certonly --standalone -d homelyy.duckdns.org --email your_email@example.com --agree-tos --no-eff-email
systemctl start nginx
systemctl restart nginx
```

Kiem tra renew:

```bash
certbot renew --dry-run
```

## 5. Deploy lai sau khi sua code

### Neu chi sua frontend

```bash
ssh root@163.227.231.17
cd /var/www/Homelyy
git pull origin main
cd frontend
npm install
npm run build
rm -rf /var/www/homelyy/*
cp -r dist/* /var/www/homelyy/
systemctl restart nginx
```

### Neu chi sua backend

```bash
ssh root@163.227.231.17
cd /var/www/Homelyy
git pull origin main
cd backend
npm install --omit=dev
pm2 restart homelyy-backend
pm2 logs homelyy-backend --lines 30
```

### Neu sua ca frontend va backend

```bash
ssh root@163.227.231.17
cd /var/www/Homelyy
git pull origin main

cd /var/www/Homelyy/backend
npm install --omit=dev
pm2 restart homelyy-backend

cd /var/www/Homelyy/frontend
npm install
npm run build
rm -rf /var/www/homelyy/*
cp -r dist/* /var/www/homelyy/

systemctl restart nginx
```

## 6. Lenh kiem tra nhanh

```bash
pm2 status
pm2 logs homelyy-backend --lines 30
systemctl status nginx
curl https://homelyy.duckdns.org/api/health
```

## 7. Khi nao can doi env

Chi can sua env khi thay doi:

- domain
- MongoDB URI
- Cloudinary credentials
- JWT secret
- ten database

Neu chi sua giao dien hoac logic app thong thuong thi khong can sua env.
