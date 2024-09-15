# Ce fichier est le fruit de + de 48h de recherches
# contenant npm (un package manager) et alpine (os)
FROM node:18-alpine as base
WORKDIR /app

RUN if [[ $(uname -m) == "aarch64" ]] ; \
    then \
    # aarch64
    # Installation de glibc version 2.26 (les versions antérieurs et ultérieurs ne fonctionnent pas)
    wget https://raw.githubusercontent.com/squishyu/alpine-pkg-glibc-aarch64-bin/master/glibc-2.26-r1.apk ; \
    apk add --no-cache --allow-untrusted --force-overwrite glibc-2.26-r1.apk ; \
    rm glibc-2.26-r1.apk ; \
    else \
    # x86_64
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.28-r0/glibc-2.28-r0.apk ; \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub ; \
    apk add --no-cache --force-overwrite glibc-2.28-r0.apk ; \
    rm glibc-2.28-r0.apk ; \
    fi

# Installation de bun pour installer les dépendances (plus rapide que npm)
RUN npm i -g bun

FROM base as install

# Installation des dépendances
COPY package.json .
RUN bun i

FROM install as build

# Construction de l'application
COPY . .
# Construction du projet
RUN bun run build

# Compilation (voir https://bun.sh/docs/bundler/executables) 
# ------------------------
# Normally, Bun reads and transpiles JavaScript and TypeScript files on import and require. 
# This is part of what makes so much of Bun "just work", but it's not free. 
# It costs time and memory to read files from disk, resolve file paths, parse, 
# transpile, and print source code.
RUN bun build --compile ./server/entry.elysia.js --outfile ./entry.elysia \
    --target=bun --minify --sourcemap

# On utilise une image moins volumineuse (uniquement alpine & bun)
FROM oven/bun:alpine as production
WORKDIR /app

# On récupère les fichiers nécessaires pour l'application
COPY --from=build /app/dist ./dist
COPY --from=build /app/entry.elysia .

ENV PORT=5173
EXPOSE 5173

ENTRYPOINT ["./entry.elysia"]
