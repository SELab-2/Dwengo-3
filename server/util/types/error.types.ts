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

  get message(): string {
    switch (this.errorCode) {
      case 40301:
        return 'User is not authenticated';
      case 40302:
        return 'User is already authenticated';
      case 40303:
        return 'Invalid credentials';
      default:
        return 'Unauthorized...';
    }
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
      case 40406:
        return 'AssignmentSubmission not found...';
      case 40407:
        return 'Message not found...';
      case 40408:
        return 'Assignment not found...';
      case 40409:
        return 'LearningPath not found...';
      case 40410:
        return 'Discussion not found...';
      case 40411:
        return 'LearningObject not found...';
      case 40412:
        return 'LearningPathNode not found...';
      case 40413:
        return 'Group not found...';
      case 40414:
        return 'Favorite not found...';
      case 40415:
        return 'Announcement not found...';
      case 40416:
        return 'learningTheme not found...';
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
        return "Can't fetch classes/groups you're not a teacher of...";
      case 40002:
        return "Can't fetch classes/groups you're not a student of...";
      case 40004:
        return 'Provided ID does is not a studentId or teacherId...';
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
      case 40036:
        return "Can't fetch students you're not a teacher of....";
      case 40037:
        return 'Announcement does not belong to teacher...';
      case 40038:
        return 'User role does not match expected role...';
      case 40039:
        return "Can't submit to a group you're not a student of...";
      case 40040:
        return 'All students in a group must belong to the same class...';
      case 40041:
        return 'All users must belong to the same group...';
      case 40042:
        return "Can't fetch favorites from other user...";
      case 40043:
        return "Can't fetch assignmentSubmissions that are not yours...";
      case 40044:
        return "Can't submit to a non-favorited learningPath...";
      case 40045:
        return 'Invalid data provided...';
      case 40046:
        return 'User already exists...';
      case 40047:
        return 'You must be a teacher to manage learningThemes...';
      case 40048:
        return 'You can only delete your own account...'
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
