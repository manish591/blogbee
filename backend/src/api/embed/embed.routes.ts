import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import { embedBlogArchivesHandler, embedBlogHandler, embedPostHandler } from "./embed.controllers";
import { embedBlogSchema } from "./embed.schema";

const router = Router();

router.get("/blogs/:blogSlug", validateRequest(embedBlogSchema), embedBlogHandler);
router.get("/blogs/:blogSlug/posts/:postSlug", validateRequest(embedBlogSchema), embedPostHandler)
router.get("/blogs/:blogSlug/archive", validateRequest(embedBlogSchema), embedBlogArchivesHandler);

export { router as embedRoutes };

