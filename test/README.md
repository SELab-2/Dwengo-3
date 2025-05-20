# Informatie testen

In deze readme.md vindt u informatie over hoe de testen geïmplementeerd zijn, wat en hoe ze de code controleren en hoe u ze moet uitvoeren.

## Test framework

Als test-framework maken we gebruik van [vitest](https://vitest.dev/). We hebben vitest gekozen om enkele redenen:

- Snelle uitvoeringstijden
- Voor de gebruiker werkt het zo goed als hetzelfde als Jest (een ouder, wijd gebruikt test-framework). Dit betekent dat het goed gedocumenteerd is en dat het compatibel is met veel andere test-libraries.
- Simpele mock-implementatie

## Frontend tests

Voor de frontend hebben we vier verzamelingen van testen waarvan er twee verder uitgewerkt zijn. Dit zijn de apiCall-testen en de hooks-testen.

#### ApiCall tests

De testen voor de api-calls zijn unit tests die testen op correcte calls naar de api. Aangezien dit unit tests zijn, wordt de api-client gesimuleerd met een mock-functies.

De test-files kan men terugvinden in `./apiCalls`.

#### Hooks tests

De testen voor de hooks zijn unit tests die controleren op de correcte werking van de hooks en gebruik van de apiCalls. Aangezien dit unit tests zijn, worden de apiCalls gesimuleerd met mock-functies.

De test-files kan men terugvinden in `./hooks`.

## Backend tests

Voor de backend hebben we drie verzamelingen van testen die elk een laag in de domein-architectuur controleert.

#### Router tests

De testen voor de router-laag zijn unit tests die controleren of elke aanspreekpunt van de server correct antwoordt op de mogelijke HTTP methodes gegeven in de documentatie [documentatie](../server/README.md#documentatie). De testen zijn geïmplementeerd met behulp van [supertest](https://www.npmjs.com/package/supertest). Aangezien dit unit tests zijn, wordt de onderliggende domeinlaag gesimuleerd met mock-functies.

De test-files kan men terugvinden in `./routes`.

#### Domain tests

De testen voor de domeinlaag zijn unit tests die controleren op de correctheid van de business-logica. Deze testen controleren dus of de domeinlaag gewenste, ongewenste en verkeerde operaties correct opvangt en eventueel weigert. Aangezien dit unit tests zijn, wordt de onderliggende persistencelaag gesimuleerd met mock-functies.

De test-files kan men terugvinden in `./domain`.

#### Persistence tests

De testen voor de persistencelaag zijn integration tests die controleren op correcte samenwerking tussen de persistencelaag en de databank. Dit houdt in dat er getest wordt op dat de persistencelaag de databank correct aanpast en ook op dat er correct data opgevraagd wordt.

Voor deze testen uit te voeren wordt er tijdelijk een aparte test-databank opgebouwd die dan aangevuld wordt met testdata. De opbouw wordt gedaan door `integration_test.sh` op te roepen. Dit script maakt gebruik van docker en nog een paar andere files:

- `.env.test` definieert de nodige environment variabelen voor de test-databank.
- `setenv.sh` is een script dat `.env.test` klaar zet voor uitvoer.
- `wait-for-it.sh` is een [open-source](https://github.com/vishnubob/wait-for-it) script dat wacht totdat de test-databank klaar is.

De test-files kan men terugvinden in `./persistence`.

## Tests runnen

Om de testen te runnen moet je je verplaatsen in de map ./test en dan de volgende commando's uitvoeren:

#### Router tests

```bash
npm run test:router
```

#### Domain tests

```bash
npm run test:domain
```

#### Persistence tests

```bash
npm run test:persistence
```

#### Views tests

```bash
npm run test:views
```

#### Components tests

```bash
npm run test:components
```

#### Hooks tests

```bash
npm run test:hooks
```

#### apiCalls tests

```bash
npm run test:api
```

#### Alle tests

```bash
npm run test:all
```
