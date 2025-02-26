import express from 'express';
import { createAssignmentDomain, getAllAssignmentsByClassIdDomain, getAllAssignmentsByGroupIdDomain, getAllAssignmentsByTeacherIdDomain, getAllAssignmentsByUserIdDomain, getAssignmentByIdDomain } from '../domain_layer/assignment.domain';

const router = express.Router();

router.get('/all', async (request, response) => {
    const {classId, userId, groupId, teacherId} = request.query;
    try {
        let assignments;
        if (classId != null) assignments = getAllAssignmentsByClassIdDomain(String(classId));
        else if (userId != null) assignments = getAllAssignmentsByUserIdDomain(String(userId));
        else if (groupId != null) assignments = getAllAssignmentsByGroupIdDomain(String(userId));
        else if (teacherId != null) assignments = getAllAssignmentsByTeacherIdDomain(String(teacherId));
        else throw Error('/assignments/all need ?classId=id or ?userId=id or ?teacherId=id or ?groupId=id');
        response.json({ message: "succes", data: assignments });
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).json({ message: "error", data: error.message});
        } else {
            response.status(500).send('An unknown error occurred');
        }
    }
});

router.get('/:id', async (request, response) => {
    try {
        const assignment = await getAssignmentByIdDomain(request.params.id);
        response.json({ message: "succes", data: assignment});
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).json({ message: "error", data: error.message});
        } else {
            response.status(500).send('An unknown error occurred');
        }
    }
});

router.post('/', async (request, response) => {
    try {
        const assignment = await createAssignmentDomain(request.body);
        response.json({ message: "succes", data: assignment});
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).json({ message: "error", data: error.message});
        } else {
            response.status(500).send('An unknown error occurred');
        }
    }
});

export default router;