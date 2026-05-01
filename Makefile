# =========================
# BACKEND
# =========================

up-backend:
	docker compose -f docker-compose.backend.yml up -d --build

down-backend:
	docker compose -f docker-compose.backend.yml down

down-backend-clean-volumes:
	docker compose -f docker-compose.backend.yml down -v


# =========================
# FRONTEND
# =========================

up-frontend:
	docker compose -f docker-compose.frontend.yml up -d --build

down-frontend:
	docker compose -f docker-compose.frontend.yml down
