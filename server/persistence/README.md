## 4. **Persistence Layer (Backend - Prisma)**

The Persistence Layer is responsible for interacting with the database. It abstracts database operations and provides a clean API for the **Domain Layer** to use.

### Responsibilities:

- Define database models and schemas using Prisma.
- Perform CRUD (Create, Read, Update, Delete) operations on the database.
- Handle database migrations and schema updates.
- Provide a type-safe interface for querying the database (using Prisma Client).
- Ensure data integrity and consistency.

### Scenario:

For example, a user does a PUT request to the server to accept a student with `user_id` to a class with `class_id`.
This request is first noticed by the Controller/routes layer. The controller checks if the parameters for the request have the correct format.

If so, the controller calls a method in the domain layer and passes the correct arguments. The domain layer will check certain rules that need to be fulfilled. In this case, we need to make sure that the user doing the PUT call to the server is actually one of the teacher of the class with `class_id`. That will be checked by the domain layer.

If these requirements are met, the domain layer will call a method in the persistence layer to retrieve the data required to answer the request.

The persistence layer will make a database request to retrieve the data from the database.
