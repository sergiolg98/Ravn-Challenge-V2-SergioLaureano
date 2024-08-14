# REST API - An Sports Store

- By: Sergio Laureano
- Based on: Ravn-Challenge-V2 Tiny Store
- Official Documentation: You can refer to the official documentation for this project here: [API - Sports Store](https://documenter.getpostman.com/view/4148176/2sA3s6EUu6)
---------------------------

## Tech Stack

- Node.js, Typescript, Prisma, Postgres for the REST API.
- Localstack to emulate locally AWS Services needed as S3 Bucket to store images.
- Redis to keep token keys, to implement a sign-out strategy based on blacklisting tokens.
- This project is meant to be built with Docker to ensure all versions and requirements are satisfied. All Docker files are ready to build the image and containers.

## Project Description

- This is Node.js project with Typescript to build a REST API for an Sports Store.
- The project follows **Clean Architecture** style separating the core business part from the infrastructure and the routes which uses Express.

## Documentation

- Official documentation: [API - Sports Store](https://documenter.getpostman.com/view/4148176/2sA3s6EUu6)


## Instructions to run 

(Important) Be sure to have Docker installed on your machine first.
After you have the project in your machine:

1. Install dependencies with ``` npm install ```
2. Change permissions of localstack init file.

```sh
chmod +x ./.localstack/.init/buckets.sh
```

3. Build up the containers. The project is ready to run the migrations for Postgres DB and seeds basic data.
```sh
docker-compose up --build -d
```

- To stop the project you just need to run: 
```sh
docker-compose down
```

## About testing

- We have covered our repositories which carry the most important operations in this project. Here you can see a printscreen of the full coverage results:

![Code coverage](https://i.ibb.co/JypBr5s/coverage-ravn-challenge-sergio.png)
