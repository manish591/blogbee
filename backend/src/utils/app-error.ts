export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly message: string;

  constructor({
    status,
    code,
    message,
  }: { status: number; code: string; message: string }) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status;
    this.code = code;
    this.message = message;

    Error.captureStackTrace(this);
  }
}
