## 2. **Controller Layer (Backend - Express)**

The Controller Layer acts as an intermediary between the **View Layer** and the **Domain Layer**. It handles incoming
HTTP requests, processes them, and returns appropriate responses.

### Responsibilities:

- Define API endpoints (routes) for the frontend to interact with.
- Validate incoming requests (e.g., request body, query parameters).
- Call the appropriate methods in the **Domain Layer** to perform business logic.
- Handle errors and send appropriate HTTP responses (e.g., 200, 400, 500).
- Manage authentication and authorization (e.g., JWT verification).

### Scenario:

For example, a user does a PUT request to the server to accept a student with `user_id` to a class with `class_id`.
This request is first noticed by the Controller/routes layer. The controller checks if the parameters for the request
have the correct format.

If so, the controller calls a method in the domain layer and passes the correct arguments. The domain layer will check
certain rules that need to be fulfilled. In this case, we need to make sure that the user doing the PUT call to the
server is actually one of the teacher of the class with `class_id`. That will be checked by the domain layer.

If these requirements are met, the domain layer will call a method in the persistence layer to retrieve the data
required to answer the request.

The persistence layer will make a database request to retrieve the data from the database.
