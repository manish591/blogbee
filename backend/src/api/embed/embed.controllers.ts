import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/api-response";
import { logger } from "../../utils/logger";
import { getBlogBySlug } from "../blogs/blogs.services";
import { getAllPosts, getPostBySlug } from "../posts/posts.services";
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
    const allBlogPosts = await getAllPosts(blogId, req.db);
    const allBlogTags = await getBlogTags(blogId, req.db);

    logger.info("EMBED_BLOG_SUCCESS: Blog data retrieved successfully");

    res.status(StatusCodes.OK).json(
      new APIResponse("success", StatusCodes.OK, "Blog data retrieved successfully", {
        blog: blogData,
        posts: allBlogPosts,
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

    const postData = await getPostBySlug(postSlug, req.db);
    if (!postData) {
      logger.error("NOT_FOUND_ERROR: Post not found");
      res.status(StatusCodes.NOT_FOUND).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Post not found"));
      return;
    }

    const isPostBelongsToBlog = postData.blogId.toString() === blogData._id.toString();
    if (!isPostBelongsToBlog) {
      logger.error("FORBIDDEN_ERROR: Post does not belong to the blog");
      res.status(StatusCodes.FORBIDDEN).json(new APIResponse("error", StatusCodes.NOT_FOUND, "Post does not belong to the blog"));
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