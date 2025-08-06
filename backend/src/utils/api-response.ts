import type { StatusCodes } from 'http-status-codes';

export type TAPIResponseStatus = 'success' | 'error';

export class APIResponse {
  status: TAPIResponseStatus;
  message: string;
  code: StatusCodes;
  data?: unknown;

  constructor(
    status: TAPIResponseStatus,
    code: StatusCodes,
    message: string,
    data?: unknown,
  ) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
