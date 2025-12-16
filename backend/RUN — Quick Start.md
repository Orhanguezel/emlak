

# Şifre sorar
mysql -u root -p

ADMIN_EMAIL="admin@site.com" ADMIN_PASSWORD="SüperGizli!" bun run db:seed


cd /var/www/emlak/backend

rm -rf dist .tsbuildinfo
bun run build

ALLOW_DROP=true bun run db:seed
# veya
ALLOW_DROP=true node dist/db/seed/index.js



# BACKEND klasörüne geç
cd /var/www/emlak/backend

# Production build’i zaten aldıysan tekrar şart değil, yoksa:
bun install --no-save
bun run build

# PM2 ile BUN interpreter kullanarak başlat
PORT=8083 pm2 start dist/index.js \
  --name emlak-backend \
  --cwd /var/www/emlak/backend \
  --interpreter "$(command -v bun)" \
  --update-env

pm2 save
pm2 logs emlak-backend --lines 50




mkdir -p dist/db/seed/sql
cp -f src/db/seed/sql/*.sql dist/db/seed/sql/


cd ~/Documents/emlak   # doğru klasör
git status                    # ne değişmiş gör
git add -A
git commit -m "mesajın"
git pull --rebase origin main
git push origin main



-- 1. Yeni veritabanını oluştur (örnek: emlak)
CREATE DATABASE `emlak` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Uygulama kullanıcısını oluştur / şifresini ayarla
-- (hem localhost hem 127.0.0.1 hem de istersen % için)
CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED BY 'app';
CREATE USER IF NOT EXISTS 'app'@'127.0.0.1' IDENTIFIED BY 'app';
CREATE USER IF NOT EXISTS 'app'@'%' IDENTIFIED BY 'app';

-- 3. Yetkileri ver
GRANT ALL PRIVILEGES ON `emlak`.* TO 'app'@'localhost';
GRANT ALL PRIVILEGES ON `emlak`.* TO 'app'@'127.0.0.1';
GRANT ALL PRIVILEGES ON `emlak`.* TO 'app'@'%';

FLUSH PRIVILEGES;

-- (İleride şifreyi değiştirmek istersen)
-- ALTER USER 'app'@'localhost' IDENTIFIED BY 'yeniSifre';
-- ALTER USER 'app'@'127.0.0.1' IDENTIFIED BY 'yeniSifre';
-- ALTER USER 'app'@'%' IDENTIFIED BY 'yeniSifre';



```sh
pm2 flush


cd /var/www/emlak
git fetch --prune
git reset --hard origin/main

cd backend
bun run build

# çalışan süreç kesilmeden reload
pm2 reload ecosystem.config.cjs --env production

# gerekirse log izle
pm2 logs emlak-backend --lines 100

```

cd /var/www/emlak

git fetch origin
git reset --hard origin/main
git clean -fd   # (untracked dosyaları da siler, istersen)




