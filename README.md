# Start the app locally

Note: The present google api project is in testing phase so according to google only users permitted by developer can access the full functionality of the product untill the api project is verified by the google itself.

clone the repository.

for the backend

```sh
cd apps/api

# with node
npm run build
node dist/index.js

#with bun
bun src/index.ts

```

for front end on seperate terminal

```sh
cd apps/web

npm run dev
#or
bun run dev

```

# using docker

for backend

```sh
cd apps/api
docker build -t backend .  #create the image
docker run -d -p 8081:8081 backend  #run container
```

for front end

```sh
cd apps/web
docker build -t frontend .
docker run -d -p 3000:3000 frontend
```

# To run build

```sh
npm run build
```
