# Dwengo-3

## Rolverdeling

Projectleider: Martijn </br>
Technische lead: Sviatoslav </br>
Testen: Rico </br>
Verslagen schrijven: Jeffrey </br>
Communicatie klant: Jona </br>
Backend verantwoordelijke: Robin </br>
Systeembeheerder: Jasper </br>

# Project overview

## Tech stack

**Frontend**: React, we hebben allemaal al ervaring met React </br>
**Backend**: Prisma, ExpressJS, Docker, idem</br>
**Databank**: PostgreSQL, idem. Ook omdat het relationeel gedeelte sterk zal worden gebruikt

Database scheme is available on: <br>
https://sel2-3.ugent.be/schemaspy/relationships.html

To inspect the scheme, please use [UGent VPN](vpn.ugent.be)

# Installation guide

## Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js (v18+)](https://nodejs.org/en/download)
- [dotenv-cli](https://www.npmjs.com/package/dotenv-cli)

---

## 1. Clone the repository

```bash
git clone git@github.com:SELab-2/Dwengo-3.git
cd Dwengo-3
```

---

## 2. Set up PostgreSQL with Docker

Run the following command to start a PostgreSQL database container:

```bash
read -sp "Postgres password: " password && echo \
              && sudo docker run --name docker_db \
                  --restart always \
                  -e POSTGRES_USER=postgres \
                  -e POSTGRES_PASSWORD=$password \
                  -e POSTGRES_DB=dwengo_db \
                  -p 5432:5432 -d postgres

# start the database for tests:
sudo docker run --name integration_tests_prisma \
                  --restart always \
                  -e POSTGRES_USER=postgres \
                  -e POSTGRES_PASSWORD=password \
                  -e POSTGRES_DB=dwengo_test_db \
                  -p 5433:5432 -d postgres
```

Confirm the database is running:

```bash
sudo docker ps -a
```

---

## 3. Redis store

Set up the redis container used to store sessions:

```bash
sudo docker run -d --name <a name> -p 6379:6379 redis
```

## 4. Configure the environment

Create a `.env` file in the root directory and add the following:

```
DATABASE_URL="postgresql://postgres:<your_password>@172.17.0.1:5432/dwengo_db"
```

Replace `<your_password>` with the password you set when running the `docker` command.

---

## 5. Install dependencies & Prisma

Install dependencies for both the server and client, generate the Prisma client and apply the migrations:

```bash
./install.sh
./prisma.sh migrate dev
```

Change `dev` to `deploy` to apply the migrations to the production database.

---

---

## 6. Synchronize the database

Run the following command to synchronize your local database with Dwengo database:

```bash
cd db
npm run start:sync
```

Add the script to pm2 for automatic synchronization at midnight

---

---

## 7. Run the development servers

- **Start the server:**

```bash
cd server
npm run start
```

- **Start the client:**

```bash
cd client
npm run start
```

The React app should now be running at [http://localhost:3000](http://localhost:3000) <br>
The Express server typically runs at [http://localhost:3001](http://localhost:3001)

You can change the ports in the `.env` file, if the ports are not configured the default ports are given above.

---

## 8. Verifying setup

- Ensure the database container is running:

```bash
sudo docker ps -a
```

- Confirm the Prisma client is generated:

```bash
ls db/node_modules/.prisma
```

- Check the server and client logs for errors.

---

## Troubleshooting

- **Database connection errors:**
  Ensure your `.env` file has the correct database URL and the Docker container is running.

- **Prisma errors:**
  Run this to re-generate the client:

  ```bash
  ./prisma.sh migrate dev
  ```

- **Port conflicts:**
  Adjust the ports in the respective config files for the server and client if necessary.
