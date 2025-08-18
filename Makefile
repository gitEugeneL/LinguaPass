build:
	docker compose build --no-cache

up:
	docker-compose up --build

down:
	docker-compose down
	
down-remove-all:
	docker-compose down -v
