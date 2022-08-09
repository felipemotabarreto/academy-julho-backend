import { prisma } from "../../../db/prisma";
import cors from "../../../utils/cors";

/**
 * @openapi
 *
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Create a comment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: integer
 *               postId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                   format: rich-text
 *               example:
 *                 id: 1
 *                 title: "Comment title"
 *                 content: "Comment content"
 */
export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "POST") {
    return createComment(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function createComment(req, res) {
  const { title, content, userId, postId } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        title,
        content,
        authorId: userId,
        postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    return res.status(201).json(comment, { success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error creating the comment", success: false });
  }
}
