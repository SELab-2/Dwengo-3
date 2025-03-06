import * as dotenv from 'dotenv'
import {PrismaClient} from '@prisma/client'
import {syncDatabases} from "./syncDatabase";
import cron from 'node-cron';

dotenv.config({path: "../.env"});
const prisma = new PrismaClient()

async function main() {
    cron.schedule('0 0 * * *', async () => {
        await syncDatabases(prisma);
        console.log('\nRunning database sync at midnight...');
    }, {runOnInit: true});
}

main()