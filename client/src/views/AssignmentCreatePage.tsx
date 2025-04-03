import { useTranslation } from "react-i18next";
import { 
    Box, Button, Divider, Grid2, List, ListItem, ListItemText, TextField, Typography, useTheme 
} from "@mui/material";
import BasicSelect from "../components/BasicSelect";
import MultipleSelectChip from "../components/MultipleSelectChip";
import { useEffect, useState } from "react";
import ClassNavigationBar from "../components/ClassNavigationBar";
import { useParams } from "react-router-dom";

const learningPaths = [
    { 
        id: "1", 
        title: "Learning Path 1",
        description: "Description of Learning Path 1",
        image: "https://via.placeholder.com/150",
        keywords: ["AI", "Machine Learning"],
    },
    { 
        id: "2", 
        title: "Learning Path 2",
        description: "Description of Learning Path 2",
        image: "https://via.placeholder.com/150",
        keywords: ["Data Science", "Statistics"],
    },
    {
        id: "3", 
        title: "Learning Path 3",
        description: "Description of Learning Path 3",
        image: "https://via.placeholder.com/150",
        keywords: ["Web Development", "JavaScript"],
    },
    {
        id: "4", 
        title: "Learning Path 4",
        description: "Description of Learning Path 4",
        image: "https://via.placeholder.com/150",
        keywords: ["Mobile Development", "React Native"],
    },
    {
        id: "5", 
        title: "Learning Path 5",
        description: "Description of Learning Path 5",
        image: "https://via.placeholder.com/150",
        keywords: ["Cloud Computing", "AWS"],
    },
    {
        id: "6", 
        title: "Learning Path 6",
        description: "Description of Learning Path 6",
        image: "https://via.placeholder.com/150",
        keywords: ["Cybersecurity", "Network Security"],
    }
];

const keywords = learningPaths.map((path) => path.keywords).flat();

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
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const theme = useTheme();

    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [groupSize, setGroupSize] = useState(1);
    const [filteredLearningPaths, setFilteredLearningPaths] = useState<string[]>(learningPaths.map((path) => path.title));
    const [selectedLearningPath, setSelectedLearningPath] = useState<string | null>('');

    useEffect(() => {
        const updatedPaths = learningPaths
            .filter(path => selectedKeywords.length === 0 || path.keywords.some(keyword => selectedKeywords.includes(keyword)))
            .map(path => path.title);
            
        setFilteredLearningPaths(updatedPaths);
        if (selectedLearningPath && !updatedPaths.includes(selectedLearningPath)) {
            setSelectedLearningPath("");
        }
    }, [selectedKeywords]);

    const handleGroupSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(event.target.value);
        if (value < 1) value = 1;
        if (value > students.length) value = students.length;
        setGroupSize(value);
    };

    return (
        <Box sx={{ minHeight: '100vh', p: 3 }}>
            <ClassNavigationBar id={id!} className="Class Name" />
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
                        <MultipleSelectChip label={t("keywords")} options={keywords} state={[selectedKeywords, setSelectedKeywords]}/>
                        <BasicSelect required labelName={t("learningPath")} options={filteredLearningPaths} state={[selectedLearningPath, setSelectedLearningPath]}/>
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
                        onClick={() => alert("TODO: Save assignment")}
                    >
                        {t('save')}
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}

export default AssignmentCreatePage;
