import { prisma } from "../../../db/prisma";

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
 *                 id: 0
 *                 title: "Post title"
 *                 teaser: "Post teaser ..."
 *                 content: "Post content"
 *                 creationDate: "2022-08-08T19:48:07.653Z"
 *                 comments:
 *                   -  id: 0
 *                      title: "Comment title"
 *                      content: "Comment content"
 *                      author:
 *                        id: 0
 *                        name: "User Name"
 *                        email: "user.name@email.com"
 *                 author:
 *                   id: 0
 *                   name: "User Name"
 *                   email: "user.name@email.com"
 *
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
 *                 id: 0
 *                 title: "Post title"
 *                 teaser: "Post teaser ..."
 *                 content: "Post content"
 *                 creationDate: "2022-08-08T19:48:07.653Z"
 *                 comments:
 *                   -  id: 0
 *                      title: "Comment title"
 *                      content: "Comment content"
 *                      author:
 *                        id: 0
 *                        name: "User Name"
 *                        email: "user.name@email.com"
 *                 author:
 *                   id: 0
 *                   name: "User Name"
 *                   email: "user.name@email.com"
 */
export default function handler(req, res) {
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
      include: {
        comments: true,
        author: true,
      },
    });

    return res.status(200).json(posts, { success: true });
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
      include: {
        author: true,
        comments: true,
      },
    });

    return res.status(201).json(post, { success: true });
  } catch (error) {
    res.status(500).json({ error: "Error creating the post", success: false });
  }
}
