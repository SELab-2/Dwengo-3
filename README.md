# Dwengo-3

## Rolverdeling
Projectleider: Martijn </br>
Technische lead: Sviatoslav </br>
Testen: Rico </br>
Verslagen schrijven: Jeffrey </br>
Communicatie klant: Jona </br>
Backend verantwoordelijke: Robin </br>
Systeembeheerder: Jasper </br>

## Tech stack
**Frontend**: React, we hebben allemaal al ervaring met React. </br>
**Backend**: ExpressJS, idem</br>
**Databank**: PostgreSQL, idem. Ook omdat het relationeel gedeelte sterk zal worden gebruikt</br>

# Installation guide

## Prerequisites
Ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js (v18+)](https://nodejs.org/en/download)
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
                  -e POSTGRES_USER=postgres \
                  -e POSTGRES_PASSWORD=$password \
                  -e POSTGRES_DB=dwengo_db \
                  -p 5432:5432 -d postgres
```

Confirm the database is running:
```bash
sudo docker ps -a
```

---

## 3. Configure the environment
Create a `.env` file in the root directory and add the following:
```
DATABASE_URL="postgresql://postgres:<your_password>@172.17.0.1:5432/dwengo_db"
```
Replace `<your_password>` with the password you set when running the `docker` command.

---

## 4. Install dependencies
Install dependencies for both the server and client:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## 5. Set up Prisma
Generate the Prisma client in the `db` folder:
```bash
cd ../server
npx prisma generate --schema ../db/prisma/schema.prisma
```

Apply migrations:
```bash
cd ../db
npx prisma migrate dev
```

---

## 6. Run the development servers

- **Start the server:**
```bash
cd ../server
npm run start
```

- **Start the client:**
```bash
cd ../client
npm run start
```

The React app should now be running at [http://localhost:3001](http://localhost:3001)  
The Express server typically runs at [http://localhost:3000](http://localhost:3000)

You can change the ports in the `.env` file, if the ports are not configured the default ports are given above.

---

## 7. Verifying setup
- Ensure the database container is running:
```bash
sudo docker ps -a
```
- Confirm the Prisma client is generated:
```bash
ls ../db/node_modules/.prisma
```
- Check the server and client logs for errors.

---

## Troubleshooting
- **Database connection errors:**  
  Ensure your `.env` file has the correct database URL and the Docker container is running.

- **Prisma errors:**  
  Run this to re-generate the client:
  ```bash
  npx prisma generate
  ```
  
- **Port conflicts:**  
  Adjust the ports in the respective config files for the server and client if necessary.
