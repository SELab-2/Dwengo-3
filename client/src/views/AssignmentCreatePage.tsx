import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { 
    Box, Button, Divider, Grid2, List, ListItem, ListItemText, TextField, Typography, useTheme 
} from "@mui/material";
import BasicSelect from "../components/BasicSelect";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useState } from "react";

const keywords = ['AI', 'Programmeren', 'Data Science', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning'];
const learningPaths = [...keywords];

const students = [
    'Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5',
    'Student 6', 'Student 7', 'Student 8', 'Student 9', 'Student 10',
];

function makeRandomGroups(groupSize: number): string[][] {
    const studentsSet = new Set(students);
    const groups: string[][] = Array.from({ length: Math.ceil(students.length / groupSize) }, () => []);

    let groupIndex = 0;
    while (studentsSet.size > 0) {
        const studentsArray = Array.from(studentsSet);
        const randomStudentIndex = Math.floor(Math.random() * studentsArray.length);
        const randomStudent = studentsArray[randomStudentIndex];

        groups[groupIndex].push(randomStudent);
        studentsSet.delete(randomStudent);
        groupIndex = (groupIndex + 1) % groups.length;
    }
    return groups;
}

function AssignmentCreatePage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const theme = useTheme();

    const [groupSize, setGroupSize] = useState(1);

    const handleGroupSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(event.target.value);
        if (value < 1) value = 1;
        if (value > students.length) value = students.length;
        setGroupSize(value);
    };

    return (
        <Box sx={{width:'100%', maxWidth: { xs: '95%', sm: '90%'}, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                {t('createAssignment')}
            </Typography>
            <Grid2 container spacing={2}>
                {/* Assignment Name & Description */}
                <Grid2 size={{xs: 12, md: 4, sm: 6}}>
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
                        rows={5}
                        fullWidth
                    />
                </Grid2>

                {/* Keywords & Learning Paths */}
                <Grid2 size={{xs: 12, md: 4, sm: 6}}>
                    <MultipleSelectChip label={t("keywords")} options={keywords} />
                    <BasicSelect required labelName={t("learningPath")} options={learningPaths} />
                </Grid2>

                {/* Group Size & Generated Groups */}
                <Grid2 size={{xs: 12, md: 4, sm: 6}}>
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
                    
                    {/* Scrollable Group List */}
                    <List sx={{
                        width: '100%',
                        mt: 1,
                        maxHeight: 300,
                        overflowY: 'auto',
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        p: 1,
                        bgcolor: "background.paper"
                    }}>
                        {makeRandomGroups(groupSize).map((group, index) => (
                            <div key={index}>
                                <ListItem>
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
                                <Divider /> {/* Add divider between groups */}
                            </div>
                        ))}
                    </List>
                </Grid2>
            </Grid2>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button 
                    variant="contained" 
                    sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        width: { xs: "100%", sm: "40%" } // Full width on mobile, auto on larger screens
                    }}
                >
                    {t('save')}
                </Button>
            </Box>

        </Box>
    );
}

export default AssignmentCreatePage;
