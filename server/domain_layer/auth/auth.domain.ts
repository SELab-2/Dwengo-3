import {LoginRequest, RegisterRequest} from "../../routes/auth/RequestTypes";
import * as persistence from "../../persistence_layer/auth/auth.persistence";
import {ClassRole, User} from "@prisma/client";

export async function registerUser(registerRequest: RegisterRequest): Promise<User> {
    return await persistence.saveUser({
        username: registerRequest.username,
        email: registerRequest.email,
        password: registerRequest.password,
        name: registerRequest.name,
        surname: registerRequest.surname,
        role: registerRequest.role as ClassRole
    });
}

export async function loginUser(loginRequest: LoginRequest): Promise<User> {
    const user: User | null = await persistence.getUserByEmail(loginRequest.email);
    if (user === null) throw new Error("User not found");
    return user;
}

export async function deleteUser(id: string): Promise<Boolean> {
    const user: User | null = await persistence.deleteUser(id);
    return user !== null;
}