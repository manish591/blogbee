import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '../../utils/api-response';

export async function healthCheckHandler(_req: Request, res: Response) {
  res.status(StatusCodes.OK).json(new APIResponse("success", StatusCodes.OK, "Ok", {
    timestamp: new Date(),
  }));
}
