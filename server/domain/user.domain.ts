import { Request } from "express";
import crypto from "crypto";
import { LoginRequest, RegisterRequest } from "../util/types/RequestTypes";
import * as persistence from "../persistence/auth/users.persistance";
import { ClassRole, User } from "@prisma/client";
import { UserEntity, UserSchema } from "../util/types/user.types";

export async function registerUser(
  registerRequest: RegisterRequest,
): Promise<User> {
  return await persistence.saveUser({
    username: registerRequest.username,
    email: registerRequest.email,
    password: crypto
      .createHash("sha512")
      .update(registerRequest.password)
      .digest("base64"),
    name: registerRequest.name,
    surname: registerRequest.surname,
    role: registerRequest.role as ClassRole,
  });
}

export async function loginUser(loginRequest: LoginRequest): Promise<User> {
  const user: User | null = await persistence.getUserByEmail(
    loginRequest.email,
  );
  if (user === null) throw new Error("User not found");
  return user;
}

export async function deleteUser(id: string): Promise<Boolean> {
  const user: User | null = await persistence.deleteUser(id);
  return user !== null;
}

export async function expectUserRole(id: string, expectedRole: ClassRole) {
  const user: { role: ClassRole } | null =
    await persistence.getUserRoleById(id);
  if (user === null) throw new Error("User not found");
  if (user.role != expectedRole)
    throw new Error(
      `User role ${user.role} does not match expected role of ${expectedRole}`,
    );
}

export async function getUserFromReq(req: Request): Promise<UserEntity> {
  const id = req.cookies["DWENGO_SESSION"].split("?")[0];
  const user = await persistence.getUserById(id);
  const parsedUser = UserSchema.safeParse(user);
  if (!parsedUser.success) throw parsedUser.error; // Shouldn't happen...
  return parsedUser.data;
}
