# Build docker
Generate .env files
```
cp .env.dist .env
```

Build Docker:
```
docker-compose build

```

Copy container data to host folder
```
docker-compose run app npm install
docker-compose run app npm run build
```

Start docker
```
docker-compose up -d
```

# After docker config update

```
docker-compose build
docker-compose up -d
```
