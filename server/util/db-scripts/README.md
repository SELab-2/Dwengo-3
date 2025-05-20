# Utility Scripts

## `insertData.ts`

You can run this script using the alias provided in the `package.json` file from within the `server/` directory.

```bash
npm run insertData
```

The script will insert the data from the `data.json` file into the database. This file needs follow the schema given in
the beginning of the script using the prisma models and some extra properties where needed.

```typescript
// Insert the data from the JSON file according to this schema
const data: {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: (Class & {
    students: { id: string }[];
    teachers: { id: string }[];
    assignments: { id: string }[];
    classJoinRequests: { id: string }[];
  })[];
  assignments: (Assignment & {
    groups: { id: string }[];
  })[];
  learningPaths: LearningPath[];
  learningPathNodes: (LearningPathNode & {
    groups: { id: string }[];
    assignmentSubmissions: { id: string }[];
  })[];
  learningObjects: (LearningObject & {
    learningPathNodes: { id: string }[];
  })[];
  assignmentSubmissions: AssignmentSubmission[];
  learningNodeTransitions: LearningNodeTransition[];
  learningObjectKeywords: LearningObjectKeyword[];
  groups: (Group & {
    chat?: string;
    assignmentSubmissions: { id: string }[];
    students: { id: string }[];
  })[];
  classJoinRequests: ClassJoinRequest[];
  chats: (Chat & {
    messages: { id: string }[];
    members: { id: string }[];
  })[];
  messages: Message[];
};
```

## `deleteData.ts`

You can run this script using the alias provided in the `package.json` file from within the `server/` directory.

```bash
npm run deleteData
```

The script will delete all the data from the database.

## `readData.ts`

You can run this script using the alias provided in the `package.json` file from within the `server/` directory.

```bash
npm run readData
```

The script will read all the data from the database and print it to the `current_data.json` file in the same format used
to insert data via the `insertData.ts` script.
