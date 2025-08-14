import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { Db } from 'mongodb';
import { AppError } from '../../utils/app-error';
import { logger } from '../../utils/logger';

export async function getCollectionStats(collectionName: string, db: Db) {
  try {
    const res = await db.command({ collStats: collectionName });
    return res;
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    throw new AppError({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Internal server error occured',
    });
  }
}
