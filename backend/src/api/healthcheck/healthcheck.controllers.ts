import type { Request, Response } from 'express';

export async function healthCheck(_req: Request, res: Response) {
  res.status(200).json({
    uptime: new Date(),
    message: 'Success',
  });
}
