import { Router } from 'express';
import { healthCheckHandler } from './healthcheck.controllers';

const router = Router();

router.get('/', healthCheckHandler);

export { router as healthCheckRoutes };
