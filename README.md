# An Sports Store

- By: Sergio Laureano
- Based on: Ravn-Challenge-V2 Tiny Store
---------------------------

## Tech Stack

- Node.js, Typescript, Prisma, Postgres
- The project can be built up with Docker to ensure all versions and requirements are satisfied.

## Project Description

- This is Node.js project with Typescript to build a REST API for an Sports Store.
- The project follows Clean Architecture style separating the core business part from the infrastructure and the routes which uses Express.
- This will be continued ...

## Instructions to run 

(Important) Be sure to have Docker installed on your machine first.
- Clone the project
- Run the command to build the containers. The project is ready to run the basic migrations.
```sh
docker-compose up --build -d
```

- To stop the project you just need to run: 
```sh
docker-compose down
```

## Pending tasks

- [ ] Add Prettier.
- [ ] Add ESLint.
- [ ] Add Jest for testing.
- [ ] Generate Postman documentation.