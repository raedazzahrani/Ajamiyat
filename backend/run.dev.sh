#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Docker Compose..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml up