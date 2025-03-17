# API response structure

In dit bestand vind u voor alle resources die door de API worden teruggegeven de verzameling van attributen die in de response te vinden zijn. Eenmaal dit is goedgekeurd is het de bedoeling dat dit in de swagger documentation komt te staan.

Even een bijvraag. We geven telkens ids terug, vb bij een lijst van klassen opvragen. Moeten dit geen url's zijn naar de details van een klas om compleet REST te zijn?

---

## Class (detail)

- `id` (id van de klas)
- `name`
- `[Teacher (short)]`
- `[Student (short)]`
- `[Assignment (short)]`

## Class (short)

Wanneer bijvoorbeeld een lijst van klassen van een leerkracht wordt opgevraagd

- `id`
- `name`

---

## Teacher (detail)

- `id` (teacherId)
- `UserId`
- `name` (merk op dat deze velden opgeslagen zitten in het userObject)
- `surname`
- `[Class (short)]`

## Teacher (short)

Bijvoorbeeld wanneer een lijst van teachers van een klas wordt opgevraagd.

- `id`
- `name`
- `surname`

---

## Student (detail)

- `id` (studentId)
- `userId`
- `name`
- `surname` (dit is afkomstig van user)
- `[Class (short)]`
- `[Group (short)]`

## Student (short)

Bijvoorbeeld wanneer alle leerlingen in een klas worden opgevraagd

- `id`
- `name`
- `surname`

---

## LearningPath (detail)

Dit zou alleen gebruikt worden wanneer je een leerobject opvraagd via id.

- `id` (learningPathId)
- `hruid`
- `language`
- `title`
- `description`
- `image`
- `ownerId`
- `createdAt`
- `updatedAt`
- `[LearningPathNode (short)]`

## LearningPath (short)

Dit kan bijvoorbeeld gebruikt worden wanneer er een lijst van leerobjecten wordt opgevraagd.

- `id`
- `title`
- `keywords [string]` (hier kan op gefilterd worden )
- `targetAges [int]` (ook hier kan op gefiltered worden)

---

## Learningobject (detail)

Onderstaande include informatie wordt alleen maar teruggegeven wanneer er op Id gezocht wordt.
Het heeft namelijk geen zin al deze informatie te zien wanneer je een lijst van leerobjecten opvraagt.

- `id`
- `hruid`
  (uuid mag van mij worden weggelaten uit het databankmodel)
- `version`
- `language`
- `title`
- `description`
- `contentType`
- `contentLocation`
- `targetAges` (Hier moeten we nog bespreken hoe we dit opslaan: tuple/lijst/db_model)
- `teacherExclusive`
- `skosConcepts`
- `educationalGoals`
- `copyRight`
- `license`
- `difficulty`
- `estimated_time`
- `returnValue`
- `available`
- `createdAt`
- `updatedAt`
- `content`
- `multiple_choice`
- `can_upload_submission`
- `keywords -> [string]`

## LearningObject (short)

Onderstaande attributen worden gereturned wanneer het minimale informatie vereist is. Dit kan bijvoorbeeld zijn wanneer een lijst van leerobjecten wordt opgevraagd.

- `id`
- `title`
- `language`
- `estimatedTime` (bij het opvragen van een leerpad wil men deze informatie misschien tonen aan de user)
- `keywords [string]` (deze wil je namelijk zien als je filtert op strings)
- `targetAges [int]` (deze wil je ook zien als je filtert op targetAges)

---

## LearningPathNode (detail)

Dit wordt gebruikt wanneer een learningPathNode via id wordt opgevraagd. Dit kan het geval zijn wanneer je op een leerobject klikt binnenin een leerpad.

- `id` (learningPathNodeId)
- `learningPathId`
- `learningObjectId` (het leerobject kan door een van de react components worden opgevraagd via id)
- `instruction`
- `index` (de index van deze learningPathNode in het learningPath)
- `[transitions (detail)]` (**TODO** bespreek dit)

## learningPathNode (short)

Dit wordt gebruikt wanneer je bv een leerpad in detail opvraagt.

- `id`
- `[LearningObject (short)]` (**TODO**)

---

## Transition (detail)

- `id`
- `LearningPathNodeId`
- `condition`
- `toIndex`

---

## User (detail) (deze endpoint is er momenteel nog niet)

- `id`
- `username`
- `email`
- `surname`
- `name`
- `role`
- `[Class (short)]`
- `[LearningPath (short)]` (Favorites)

## User (short)

Dit wordt vb gebruikt wanneer men de members van een discussion wil opvragen

- `id` (userId)
- `username` | `surname`, `name` (**TODO**)

---

## ClassJoinRequest (detail)

Dit model heeft zo weinig velden dat er eigenlijk geen "short" schema gemaakt moet worden

- `id`
- `Class (short)`
- `Student (short)` (Let op, de studentId is niet opgeslagen in een request, wel de userId)

---

## Group (detail)

Er bestaat momenteel nog geen endpoint van groups

- `id`
- `nodeIndex` (de index van de verst gemaakte node)
- `assignment (short)`
- `Discussion (short)` (indien aanwezig)
- `[Student (short)]`

## Group (short)

- `id`
- `nodeIndex`
- `assignemntId`

---

## Assignments (detail)

Wanneer een assignment per id wordt opgevraagd.

- `id`
- `LearningPath (short)`
- `Class (short)`
- `[Group (short)]`
- `teacherId` (id van teacher die de assignment gemaakt heeft)

## Assignement (short)

Vb alle assignments in een klas opvragen

- `id`
- `learningPathId`

---

## Submission (detail)

- `id`
- `submission (json)`
- `Group (short)`
- `learningPathNode (short)`

## Submission (short)

**TODO** hier valt nog over te discussieren

- `id`
- `learningPathNode (short)`

---

## Discussion (detail)

Discussion opgevraagd via id

- `id`
  **TODO** (onderwerp??)
- `[Message (detail)]`
- `Group (short)`
- `[User (short)]`

## Discussion (short)

- `id`

---

## Announcement (detail)

- `id`
- `title`
- `content`
- `Class (short)`
- `Teacher (short)`

## Announcement (short)

- `id`
- `title`
