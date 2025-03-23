#### Authorization

| UseCase              | API endpoints            | Method | Status | Notes | Assignee |
| -------------------- | ------------------------ | ------ | ------ | ----- | -------- |
| Student can login    | `/auth/student/login`    | `POST` | ?      | /     |
| Student can register | `/auth/student/register` | `PUT`  | ?      | /     |
| Student can logout   | `/auth/student/logout`   | `POST` | ?      | /     |
| Teacher can login    | `/auth/teacher/login`    | `POST` | ?      | /     |
| Teacher can register | `/auth/teacher/register` | `PUT`  | ?      | /     |
| Teacher can logout   | `/auth/teacher/logout`   | `POST` | ?      | /     |

#### Class

| UseCase                                                                     | API endpoints                               | Method  | Status      | Notes                                                                          | Assignee |
| --------------------------------------------------------------------------- | ------------------------------------------- | ------- | ----------- | ------------------------------------------------------------------------------ | -------- |
| Teacher can create a class                                                  | `/class`                                    | `PUT`   | ?           | /                                                                              |
| Teacher can change the name of the class he is teacher of                   | `/class`                                    | `PATCH` | ?           | /                                                                              |
| Teacher can see a list of his classes                                       | `/class`                                    | `GET`   | ?           | /                                                                              |
| Teacher can copy requestlink of a class to share it with students           | `/class`                                    | `GET`   | ?           | I think one GET enpoint with filters (keyword/id/age/...) per resource is best |
| Student can send request to join class                                      | `/class/studentRequest/`                    | `PUT`   | Not started | /                                                                              |
| Teacher can see a list of requests to join class                            | `/class/studentRequest`                     | `GET`   | not started | /                                                                              |
| Teacher can accept/reject a student's request to join the class             | `/class/studentRequest`                     | `POST`  | Not started | /                                                                              |
| Teacher can accept/reject a teacher's request to join the class             | `/class/teacherRequest`                     | `POST`  | Not started | /                                                                              |
| Student can see a list of classes of which he is part                       | `/class`                                    | `GET`   | ?           | /                                                                              |
| Teacher can send a request to join a class (as a co-teacher)                | `/class/teacherRequest`                     | `PUT`   | Not started | /                                                                              |
| Teacher can see a list of teacherrequests to join the class (as co-teacher) | `/class/teacherRequest`                     | `GET`   | ?           | /                                                                              |
| Teacher can see all the students in the class                               | `/class` of `/students` of `class/students` | `GET`   | ?           | Hier nog afspreken welke de beste is                                           |

#### Profile

| UseCase                                            | API endpoints | Method           | Status | Notes | Assignee |
| -------------------------------------------------- | ------------- | ---------------- | ------ | ----- | -------- |
| Teacher can see his profile information            | /teacher      | `GET`            | ?      | /     |
| Teacher can change his profile information         | /teacher      | `PATCH` of `PUT` | ?      | /     |
| Teacher can see profile of one of his/her students | /student      | `GET`            | ?      | /     |
| Student can see his own profile information        | /student      | `GET`            | ?      | /     |
| Student can update his own profile information     | /student      | `PATCH` of `PUT` | ?      | /     |

#### Learning

| UseCase                                                                                          | API endpoints                                              | Method          | Status      | Notes                      | Assignee |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | --------------- | ----------- | -------------------------- | -------- |
| Teacher can create an LearningPath                                                               | `/learningPath`                                            | `PUT`           | In progress | /                          | Martijn  |
| Teacher can create LearningPathNodes and link them to a self created assignment                  | `/learningPathNode`                                        | `PUT`           | In progress | /                          | Martijn  |
| Teacher can delete LearningPathNodes from a self created learningPath                            | `/learningPathNode`                                        | `DELETE`        | not started | Not really a priority      |
| Teacher can delete a self created LearningPath                                                   | `/learningPath`                                            | `DELETE`        | Not started | also not really a priority |
| Teacher can define transitions between nodes and choose conditions for those transitions         | `/learningPathNodeTransition`                              | `PUT`           | In progress | /                          | Martijn  |
| Teacher can delete self created Transitions from a LearningPathNode                              | `/learningPathNodeTransition`                              | `DELETE`        | ?           | /                          |
| Teacher can split the class in groups and give the learningPath as an assignment to those groups | `/group` of `/class/group` \| `/assignment`                | `PUT` \| `PUT`  | ?           | /                          |
| Student can see which assignments were given to him from all classes hes a part of               | `/assignment`                                              | `GET`           | ?           | /                          |
| Student can see which learningPaths he has favorited/started that were not assigned              | `/learningPath`                                            | `GET`           | ?           | /                          |
| Students can browse public learningPaths and choose to favorite one of them                      | `/learningPath` (browse)\| `/Student/favorites` (favorite) | `GET` \| `POST` | ?           | /                          |
| Students can see which assignments were given to him from a certain class                        | `/assignment`                                              | `GET`           | ?           | /                          |
| Student can see a progressbar (for the group) for each of the assignments that was given to him  | `/group/progress`                                          | `GET`           | ?           | /                          |
| Student can see all nodes of a learningPath                                                      | `learningPath`                                             | `GET`           | ?           | /                          |
| Student can walk through a learningPath, updating the progressbar                                | `/group/progress`                                          | `POST`          | ?           | /                          |
| Student can answer a multiple choice question belonging to a LearningObject                      | `/submission`                                              | `PUT`           | ?           | /                          |
| Student can submit a file belonging to a LearningObject                                          | `/submission`                                              | `PUT`           | ?           | /                          |
| Teacher see a groups answers to the questions in a learningPath                                  | `/submission`                                              | `GET`           | ?           | /                          |

#### Discussions

| UseCase                                                                                                            | API endpoints                                                | Method | Status | Notes                                                                       | Assignee |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------ | ------ | --------------------------------------------------------------------------- | -------- |
| Student can place a discussionPost belonging to an assigned learningPath, only the group and teachers can see this | `/discussion` of `/group/discussion` \| `/discussionMessage` | `PUT`  | ?      | A discussionchat has to be created, and a message has to be created as well |
| Teachers can see a list of discussions of different groups and different assignments                               | `/discussion`                                                | `GET`  | ?      | /                                                                           |
| Teachers in a class can respond to the discussionposts made by a student in a group.                               | `/discussionMessage`                                         | `PUT`  | ?      | /                                                                           |

#### Anouncements

| UseCase                                                                | API endpoints      | Method  | Status | Notes | Assignee |
| ---------------------------------------------------------------------- | ------------------ | ------- | ------ | ----- | -------- |
| Teacher can create an anouncement for one of his classes               | `/anouncement`     | `PUT`   | ?      | /     |
| Teacher and student can see all the anouncements of a class they're in | `/anouncement`     | `GET`   | ?      | /     |
| Teacher can edit the anouncement after it has been placed              | `/anouncement/:id` | `PATCH` | ?      | /     |
