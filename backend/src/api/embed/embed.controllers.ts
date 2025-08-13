import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/api-response";
import { logger } from "../../utils/logger";
import { getBlogBySlug } from "../blogs/blogs.services";
import { getAllPosts } from "../posts/posts.services";
import { getBlogTags } from "../tags/tags.services";

export async function embedBlogHandler(req: Request, res: Response) {
  try {
    const blogSlug = req.params.blogSlug;
    const blogData = await getBlogBySlug(blogSlug, req.db);

    if (!blogData) {
      logger.error("NOT_FOUND_ERROR: Blog not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Blog not found"));
      return;
    }

    const blogId = blogData._id.toString();
    const allblogPosts = await getAllPosts(blogId, req.db);
    const allBlogTags = await getBlogTags(blogId, req.db);

    logger.info("EMBED_BLOG_SUCCESS: Blog data retrieved successfully");

    res.status(StatusCodes.OK).json(
      new APIResponse("success", StatusCodes.OK, "Blog data retrieved successfully", {
        blog: blogData,
        posts: allblogPosts,
        tags: allBlogTags,
      })
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function embedPostHandler(req: Request, res: Response) {
  try {
    const blogSlug = req.params.blogSlug;
    const postSlug = req.params.postSlug;
    const blogData = await getBlogBySlug(blogSlug, req.db);

    if (!blogData) {
      logger.error("NOT_FOUND_ERROR: Blog not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Blog not found"));
      return;
    }

    const blogId = blogData._id.toString();
    const postData = await getAllPosts(blogId, req.db, postSlug);

    if (!postData) {
      logger.error("NOT_FOUND_ERROR: Post not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Post not found"));
      return;
    }

    logger.info("EMBED_POST_SUCCESS: Post data retrieved successfully");
    res.status(StatusCodes.OK).json(
      new APIResponse("success", StatusCodes.OK, "Post data retrieved successfully", {
        blog: blogData,
        post: postData,
      }));
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}

export async function embedBlogArchivesHandler(req: Request, res: Response) {
  try {
    const blogSlug = req.params.blogSlug;
    const blogData = await getBlogBySlug(blogSlug, req.db);

    if (!blogData) {
      logger.error("NOT_FOUND_ERROR: Blog not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Blog not found"));
      return;
    }

    const blogId = blogData._id.toString();
    const allblogPosts = await getAllPosts(blogId, req.db);

    logger.info("EMBED_ARCHIVE_SUCCESS: Blog archives retrieved successfully");

    res.status(StatusCodes.OK).json(
      new APIResponse("success", StatusCodes.OK, "Blog archives retrieved successfully", {
        blog: blogData,
        posts: allblogPosts,
      })
    );
  } catch (err) {
    logger.error('SERVER_ERROR: Internal server error occured', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new APIResponse(
          'error',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal server error occured',
        ),
      );
  }
}