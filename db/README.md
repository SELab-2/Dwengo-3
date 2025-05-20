#### Prisma ORM

Om het interageren met de [PostgreSQL](https://www.postgresql.org/) databank zo makkelijk mogelijk te maken, hebben we
ervoor gekozen om gebruik te maken van een [ORM](https://www.prisma.io/dataguide/types/relational/what-is-an-orm),
namelijk [prisma](https://www.prisma.io/)

De volgende voorbeeld-SQL-query in de code:

```SQL
SELECT [columns]
FROM assignment
WHERE id = ?;
```

wordt in onze code vervangen door

```ts
const assignment = await PrismaSingleton.instance.assignment.findUnique({
  where: { id: id },
  select: assignmentSelectDetail,
});
```

Dit lijkt misschien geen grote verbetering, maar om de juiste velden te selecteren moeten er zich in pure SQL nog joins
voordoen, wat de code minder leesbaar maakt.

#### DatabankSchema

Het databankschema is gedefinieerd in prisma en is te vinden in `db/prisma/schema.prisma`.
Meer informatie over het opzetten van de databank is te vinden in [README.md](../README.md)
