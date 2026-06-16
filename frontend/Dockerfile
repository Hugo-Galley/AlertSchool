FROM node:20-alpine
WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie du code
COPY . .

# On expose le port 8081 (utilisé par Expo Metro bundler)
EXPOSE 8081

# Lancement d'Expo en mode développement
CMD ["npx", "expo", "start"]
