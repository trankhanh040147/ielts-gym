.PHONY: dev build start test lint typecheck build-app cap-sync cap-ios cap-android install clean

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

test:
	npm test

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

build-app:
	npm run build:app

cap-sync:
	npm run cap:sync

cap-ios:
	npm run cap:ios

cap-android:
	npm run cap:android

install:
	npm install

clean:
	rm -rf .next out node_modules/.cache
