.PHONY: up down help

up: ## Bring up the cluster and deploy Istio & Flagger
	@cd cluster && ./up.sh

down: ## Tear down the cluster
	@cd cluster && ./down.sh

help: ## Display help menu
	@echo "Usage:"
	@echo "  make up   - Create cluster and deploy Istio & Flagger"
	@echo "  make down - Tear down the cluster"
