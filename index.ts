import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
    const learning_object = await prisma.learning_objects.create({
        data: {
            hruid: "test-hruid",
            uuid: "test-uuid",
            id: "test-id",
            language: "nl",
            title: "Title of the object",
            version: 1,
            available: true,
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