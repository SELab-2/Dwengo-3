abstract class APIError extends Error {
  private readonly _errorCode: number;

  protected constructor(errorCode: number, message: string | undefined) {
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
  constructor(errorCode: number, message: string | undefined) {
    super(errorCode, message);
    this.name = 'ValidationError';
  }

  get statusCode(): number {
    return 400;
  }
}

export class AuthorizationError extends APIError {
  constructor(errorCode: number, message: string | undefined) {
    super(errorCode, message);
    this.name = 'AuthorizationError';
  }

  get statusCode(): number {
    return 403;
  }
}

export class NotFoundError extends APIError {
  constructor(errorCode: number, message: string | undefined) {
    super(errorCode, message);
    this.name = 'NotFoundError';
  }

  get statusCode(): number {
    return 404;
  }
}

export class BadRequestError extends APIError {
  constructor(errorCode: number, message: string | undefined) {
    super(errorCode, message);
    this.name = 'BadRequestError';
  }

  get statusCode(): number {
    return 400;
  }
}

export class ConflictError extends APIError {
  constructor(errorCode: number, message: string | undefined) {
    super(errorCode, message);
    this.name = 'ConflictError';
  }

  get statusCode(): number {
    return 409;
  }
}

export class UnauthorizedError extends APIError {
  constructor(errorCode: number, message: string | undefined) {
    super(errorCode, message);
    this.name = 'UnauthorizedError';
  }

  get statusCode(): number {
    return 401;
  }
}
