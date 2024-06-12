FROM oven/bun:latest

WORKDIR /app

COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
COPY package.json bun.lockb ./

RUN bun i

COPY . .

RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "start"]
