import express from 'express';
import { getLearningPathByIdDomain, getAllLearningPathsDomain } from '../domain/learningPath.domain';

const router = express.Router();

router.get('/all', async (request, response) => {
    // Get all learning paths
    try {
        const learningPaths = await getAllLearningPathsDomain();
        response.json({ message: "succes", data: learningPaths });
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
            response.json({ message: "error", data: error.message });
        } else {
            response.status(500).send('An unknown error occurred');
        }
    }
});

router.get('/:id', async (request, response) => {
    // Get learning path by id
    try {
        const learningPath = await getLearningPathByIdDomain(request.params.id);
        response.json({ message: "succes", data: learningPath });
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
            response.json({ message: "error", data: error.message });
        } else {
            response.status(500).send('An unknown error occurred');
        }
    }
});



export default router;