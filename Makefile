.DEFAULT_GOAL := help
SHELL := /bin/bash
NPM ?= npm

.PHONY: help install clean build dev lint test typecheck check format preview

help:
	@echo "Available targets:"
	@echo "  make install   Install dependencies with $${NPM}"
	@echo "  make build     Type-check and build the production bundle"
	@echo "  make dev       Start the Vite development server"
	@echo "  make preview   Preview the production build"
	@echo "  make lint      Run eslint on src"
	@echo "  make test      Run Jest test suite"
	@echo "  make typecheck Run TypeScript project checks"
	@echo "  make check     Run lint + typecheck + tests"
	@echo "  make format    Run Prettier across the repo"
	@echo "  make clean     Remove node_modules and build artifacts"

install:
	$(NPM) install

clean:
	rm -rf node_modules dist

build:
	$(NPM) run build

dev:
	$(NPM) run dev

preview:
	$(NPM) run preview

lint:
	$(NPM) run lint

test:
	$(NPM) run test

typecheck:
	$(NPM) run typecheck

check:
	$(NPM) run check

format:
	$(NPM) run format
