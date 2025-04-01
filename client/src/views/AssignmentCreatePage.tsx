import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { Box, Button, Divider, Grid2, List, ListItem, ListItemText, TextField, Typography, useTheme } from "@mui/material";
import BasicSelect from "../components/BasicSelect";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useState } from "react";

const keywords: string[] = [
    'AI',
    'Programmeren',
    'Data Science',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'Reinforcement Learning',
];

const learningPaths: string[] = [
    'AI',
    'Programmeren',
    'Data Science',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'Reinforcement Learning',
];

const students: string[] = [
    'Student 1',
    'Student 2',
    'Student 3',
    'Student 4',
    'Student 5',
    'Student 6',
    'Student 7',
    'Student 8',
    'Student 9',
    'Student 10',
];

function makeRandomGroups(groupSize: number): string[][] {
    const studentsSet = new Set(students);
    const groups: string[][] = [];

    for (let i=0; i < Math.ceil(students.length / groupSize); i++) {
        groups.push([]);
    }

    let groupIndex = 0;
    while (studentsSet.size > 0) {
        // Convert Set to Array to pick a random student
        const studentsArray = Array.from(studentsSet);
        const randomStudentIndex = Math.floor(Math.random() * studentsArray.length);
        const randomStudent = studentsArray[randomStudentIndex];

        // Add student to the current group
        groups[groupIndex].push(randomStudent);

        // Remove the selected student from the set
        studentsSet.delete(randomStudent);

        // Move to the next group
        groupIndex = (groupIndex + 1) % groups.length;
    }

    return groups;
}

function AssignmentCreatePage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const theme = useTheme();

    const [groupSize, setGroupSize] = useState(1); // Default to 1 group

    const handleGroupSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(event.target.value);
        if (value < 1) value = 1;
        if (value > students.length) value = students.length;
        setGroupSize(value);
    };
    
    return (
        <Box sx={{maxWidth: 800, mx: 'auto', mt:4}}>
            <Typography variant="h4" gutterBottom>
                {t('createAssignment')}
            </Typography>
            <Grid2 container spacing={2}>
                <Grid2 size={4}>
                    <TextField 
                        required 
                        id="name-assignment" 
                        label={t('name')} 
                        variant="outlined" 
                        margin="normal"
                        fullWidth 
                    />
                    <TextField
                        id="description-assignment"
                        label={t('description')}
                        variant="outlined"
                        multiline
                        margin="dense"
                        rows={10}
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={4}>
                    <MultipleSelectChip label={t("keywords")} options={keywords}/>
                    <BasicSelect required labelName={t("learningPath")} options={learningPaths}/>
                </Grid2>
                <Grid2 size={4}>
                    <TextField
                        id="group-size"
                        label={t('groupSize')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="number"
                        value={groupSize}
                        onChange={handleGroupSizeChange}
                    />
                    <List sx={{width: '100%', mt: 1, maxHeight: 300, overflowY: 'auto', border: "1px solid #ddd", borborderRadius: "8px" }}>
                        {makeRandomGroups(groupSize).map((group, index) => (
                            <div key={index}>
                                <ListItem key={index}>
                                    <ListItemText 
                                        primary={`${t('group')} ${index + 1}`}
                                        secondary={
                                            group.map((student) => (
                                                <Typography key={student} variant="body2">
                                                    {student}
                                                </Typography>
                                            ))
                                        }
                                    />
                                </ListItem>
                                <Divider/>
                            </div>
                        ))}
                    </List>
                </Grid2>
            </Grid2>
            <Button variant="contained" sx={{ mt: 2, backgroundColor: theme.palette.primary.main }}>
                {t('save')}
            </Button>
        </Box>
    );
}

export default AssignmentCreatePage;