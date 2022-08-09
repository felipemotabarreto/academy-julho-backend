import { prisma } from "../../../db/prisma";
import cors from "../../../utils/cors";

/**
 * @openapi
 *
 * /api/posts/{id}:
 *   get:
 *     summary: Get full post information
 *     tags:
 *       - Posts
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: the ID of the post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: returns the full post data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 teaser:
 *                   type: string
 *                 content:
 *                   type: string
 *                   format: rich-text
 *                 creationDate:
 *                   type: string
 *                   format: date-time
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *               example:
 *                 id: 1
 *                 title: "Post title"
 *                 teaser: "Post teaser ..."
 *                 content: "Post content"
 *                 creationDate: "2022-08-08T19:48:07.653Z"
 *                 comments:
 *                   -  id: 1
 *                      title: "Comment title"
 *                      content: "Comment content"
 *                      author:
 *                        id: 1
 *                        name: "User Name"
 *                        email: "user.name@email.com"
 *                 author:
 *                   id: 1
 *                   name: "User Name"
 *                   email: "user.name@email.com"
 *
 */
export default async function handler(req, res) {
  await cors();

  if (req.method === "GET") {
    return getPostData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getPostData(req, res) {
  const { id } = req.query;
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: +id,
      },
      select: {
        id: true,
        title: true,
        teaser: true,
        content: true,
        creationDate: true,
        author: true,
        comments: {
          select: {
            id: true,
            title: true,
            content: true,
            author: true,
          },
        },
      },
    });

    if (post) {
      return res.status(200).json(post, { success: true });
    }

    res.status(404).json({
      error: "Could not found post with specified id",
      success: false,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error retrieving the posts", success: false });
  }
}
