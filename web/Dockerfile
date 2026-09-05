# Production image for the DayNight Pilot web dashboard.
# A locally cached Node 20 build base keeps local rebuilds available when
# Docker Hub is temporarily unavailable.
FROM daynightpilot-node20-base:latest

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Preserve the cached dependencies but replace every application file.
RUN find /app -mindepth 1 -maxdepth 1 ! -name node_modules -exec rm -rf {} +
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
