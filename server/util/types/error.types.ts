export abstract class APIError extends Error {
  private readonly _errorCode: number;

  protected constructor(errorCode: number, message?: string) {
    super(message);
    this.name = 'APIError';
    this._errorCode = errorCode;
  }

  get errorCode(): number {
    return this._errorCode;
  }

  abstract get statusCode(): number;
}

export class ValidationError extends APIError {
  constructor(errorCode: number, message?: string) {
    super(errorCode, message);
    this.name = 'ValidationError';
  }

  get statusCode(): number {
    return 400;
  }
}

export class AuthorizationError extends APIError {
  constructor(errorCode: number, message?: string) {
    super(errorCode, message);
    this.name = 'AuthorizationError';
  }

  get statusCode(): number {
    return 403;
  }
}

export class NotFoundError extends APIError {
  constructor(errorCode: number, message?: string) {
    super(errorCode, message);
    this.name = 'NotFoundError';
  }

  get statusCode(): number {
    return 404;
  }

  get message(): string {
    switch (this.errorCode) {
      case 40401:
        return 'Class not found...';
      case 40402:
        return 'Message not found...';
      case 40403:
        return 'Student not found...';
      case 40404:
        return 'Teacher not found...';
      case 40405:
        return 'User not found...';
      default:
        return 'Not found...';
    }
  }
}

export class BadRequestError extends APIError {
  constructor(errorCode: number, message?: string) {
    super(errorCode, message);
    this.name = 'BadRequestError';
  }

  get statusCode(): number {
    return 400;
  }

  get message(): string {
    switch (this.errorCode) {
      case 40001:
        return "Can't fetch classes you're not a teacher of...";
      case 40002:
        return "Can't fetch classes you're not a student of...";
      case 40003:
        return 'Either studentId, teacherId or classId must be provided...';
      case 40004:
        return 'Provided user ID does correspond with the provided studentId or teacherId...';
      case 40005:
        return 'You must be a teacher to create a class...';
      case 40006:
        return 'You must be a teacher of the class to update it...';
      case 40007:
        return 'You do not belong to the class...';
      case 40008:
        return 'You can only delete your own messages...';
      case 40009:
        return 'You must be a teacher to create new learning paths or objects...';
      case 40010:
        return 'Can not get announcements of other teacher...';
      case 40011:
        return 'Can not get announcements of other user...';
      case 40012:
        return 'User is not a teacher...';
      case 40013:
        return 'User is not a student...';
      case 40014:
        return 'Join request already exists...';
      case 40015:
        return 'Teachers can only view join requests of their own classes...';
      case 40017:
        return 'Students can only view their own join requests...';
      case 40018:
        return 'Students cannot view join requests for classes...';
      case 40019:
        return 'Only teachers can handle join requests...';
      case 40020:
        return 'Only teachers of this class can handle join requests...';
      case 40021:
        return 'Only teachers can create assignments...';
      case 40023:
        return 'A student is already linked to this user...';
      case 40024:
        return "Can't fetch students of a class you're not a teacher of...";
      case 40025:
        return "Can't fetch students of a group you're not in...";
      case 40026:
        return "Can't fetch other students...";
      case 40027:
        return "Can't alter student info or delete them as a teacher...";
      case 40028:
        return "Can't alter profile info of other student or delete other students...";
      case 40029:
        return 'Learning object not found...';
      case 40030:
        return 'Cannot delete a learning object linked to a learning path...';
      case 40031:
        return 'User is not a teacher or student...';
      case 40032:
        return 'User is already a teacher or student...';
      case 40033:
        return 'Only students can create or update submissions...';
      case 40034:
        return 'File submission is required when submissionType is FILE...';
      case 40035:
        return 'User must be a teacher to remove people from a class...';
      default:
        return 'Bad request...';
    }
  }
}

export class UnauthorizedError extends APIError {
  constructor(errorCode: number, message?: string) {
    super(errorCode, message);
    this.name = 'UnauthorizedError';
  }

  get statusCode(): number {
    return 401;
  }
}
