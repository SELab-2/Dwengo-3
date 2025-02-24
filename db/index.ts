import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
dotenv.config() // Load the environment variables

async function main() {
    const learning_object = await prisma.learningObject.create({
        data: {
            hruid: "test-hruid",
            uuid: "test-uuid",
            language: "nl",
            title: "Title of the object",
            version: 1,
            available: true,
            content:"test-content"
        }
    });
    console.log(learning_object)
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })