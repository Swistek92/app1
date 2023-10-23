# Etap budowy
FROM node:18 AS builder

# Ustawienie katalogu roboczego
WORKDIR /app

# Skopiowanie plików projektu
COPY . .

# Instalacja zależności
RUN npm install

# Kompilacja TypeScript do JavaScript
RUN npm run build

# Etap uruchomienia
FROM node:18

# Ustawienie katalogu roboczego
WORKDIR /app

# Skopiowanie skompilowanych plików z etapu budowy
COPY --from=builder /app/dist ./dist

# Skopiowanie pliku package.json oraz zainstalowanie tylko zależności produkcyjnych
COPY --from=builder /app/package.json ./
RUN npm install --only=production

# Otwarcie portu, na którym nasłuchuje aplikacja
EXPOSE 8080

# Uruchomienie aplikacji
CMD [ "node", "dist/server.js" ]
