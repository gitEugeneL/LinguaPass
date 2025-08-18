build-backend:
	docker compose -f docker-compose.backend.yml build --no-cache

up-backend:
	docker compose -f docker-compose.backend.yml up --build

down-backend:
	docker compose -f docker-compose.backend.yml down

down-backend-clean-volumens:
	docker compose -f docker-compose.backend.yml down -v


build-frontend:
	docker compose -f docker-compose.frontend.yml build --no-cache
	
up-frontend:
	docker compose -f docker-compose.frontend.yml up
	
down-frontend:
	docker compose -f docker-compose.frontend.yml down
	