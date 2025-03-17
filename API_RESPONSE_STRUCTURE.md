# API response structure

In dit bestand vind u voor alle resources die door de API worden teruggegeven de verzameling van attributen die in de response te vinden zijn. Eenmaal dit is goedgekeurd is het de bedoeling dat dit in de swagger documentation komt te staan.

---

## Class

- `id` (id van de klas)
- `name`
- `[Teacher]` (Voor de velden die bij teacher worden teruggegeven moet je kijken bij [teacher](#Teacher))
- `[Student]`(zie [Student](#student))

---

## Teacher

Bijvoorbeeld wanneer alle teachers van een klas worden opgevraagd.
Deze include values zouden ook gebruikt worden wanneer bijvoorbeeld een klas wordt opgevraagd, daarbij wordt namelijk een lijst van teachers teruggegeven.

- `id` (teacherId)
- `name` (merk op dat deze velden opgeslagen zitten in het userObject)
- `surname`

---

## Student

Deze wordt bijvoorbeeld ook geintegreerd in het antwoord van [Class](#Class).
Deze informatie is natuurlijk niet voldoende als een user zijn account zou willen bekijken, maar daarvoor kunnen we dan [User](#User) gebruiken.

- `id` (studentId)
- `name`
- `surname`

---

## LearningPath

Dit zou idealiter gebruikt worden bij het ovragen van een lijst van leerpaden, en het opvragen van 1 leerpad. Het is natuurlijk de vraag of het handig is dat namen van leerobjecten al worden terugegeven als je gewoon een lijst van leerpaden opvraagt.

- `id` (learningPathId)
- `hruid`
- `language`
- `title`
- `description`
- `image`
- `ownerId`
- `createdAt`
- `updatedAt`
- `[LearningPathNode]` (Dit is nog te betwisten en moet besproken worden)

---

## Learningobject

- `id`
- `hruid`
  (uuid mag van mij worden weggelaten uit het databankmodel)
- `version`
- `language`
