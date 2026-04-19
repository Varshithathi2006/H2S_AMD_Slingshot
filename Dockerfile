FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install dependencies, including devDependencies for the build step
RUN npm ci
COPY . .
# Generate Prisma client before building Next.js
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Next.js standalone output includes the server and minimal node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT 3000
# Ensure we pick up the generated Prisma client if it's outside the node_modules
COPY --from=builder /app/lib/generated ./lib/generated

CMD ["node", "server.js"]

