source .env
# export NEW_RELIC_API_KEY=<INSERT-API-KEY-HERE>

// Run the application and the collector with docker compose
docker-compose -f ./docker-compose.yaml up --build