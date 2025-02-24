## 3. **Domain Layer (Backend - Express)**
The Domain Layer contains the core business logic of the application. It is independent of the database and user interface.

### Responsibilities:
- Implement business rules and logic (e.g., check if a user is a teacher when he does a "teacher-only" call to server).
- Process data received from the **Controller Layer**.
- Interact with the **Persistence Layer** to retrieve or store data.
- Ensure the application's business requirements are met.

### Scenario: 
For example, a user does a PUT request to the server to accept a student with `user_id` to a class with `class_id`. 
This request is first noticed by the Controller/routes layer. The controller checks if the parameters for the request have the correct format. 

If so, the controller calls a method in the domain layer and passes the correct arguments. The domain layer will check certain rules that need to be fulfilled. In this case, we need to make sure that the user doing the PUT call to the server is actually one of the teacher of the class with `class_id`. That will be checked by the domain layer. 

If these requirements are met, the domain layer will call a method in the persistence layer to retrieve the data required to answer the request. 

The persistence layer will make a database request to retrieve the data from the database. 
