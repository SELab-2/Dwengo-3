// types for request payloads

export interface LoginRequest {
    username: string;
    password: string;
    role: Role;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: "student" | "teacher";
}

export enum Role {
    TEACHER = 0,
    STUDENT = 1
}
