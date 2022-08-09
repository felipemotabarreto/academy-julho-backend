import { prisma } from "../../../db/prisma";
import cors from "../../../utils/cors";

/**
 * @openapi
 *
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: returns all posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 teaser:
 *                   type: string
 *                 author:
 *                   type: string
 *               example:
 *                 - id: 1
 *                   title: "Post title"
 *                   teaser: "Post teaser ..."
 *                   author: "User Name"
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Create a post
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               teaser:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post successfully created.
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
 *               example:
 *                 id: 1
 *                 title: "Post title"
 *                 teaser: "Post teaser ..."
 *                 content: "Post content"
 *                 creationDate: "2022-08-08T19:48:07.653Z"
 */
export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "GET") {
    return getPosts(res);
  } else if (req.method === "POST") {
    return createPost(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getPosts(res) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        creationDate: "desc",
      },
      select: {
        id: true,
        title: true,
        teaser: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json(
      posts.map(({ author, ...rest }) => ({
        ...rest,
        author: author.name,
      })),
      { success: true }
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error retrieving the posts", success: false });
  }
}

async function createPost(req, res) {
  const { title, teaser, content, userId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        teaser,
        content,
        authorId: userId,
        creationDate: new Date().toISOString(),
      },
      select: {
        id: true,
        title: true,
        teaser: true,
        content: true,
        creationDate: true,
      },
    });

    return res.status(201).json(post, { success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating the post", success: false });
  }
}
