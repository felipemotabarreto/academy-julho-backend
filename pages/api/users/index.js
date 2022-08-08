import { PrismaClient } from "../../../db/prisma";

/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     summary: Get user by email
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User email
 *     responses:
 *       200:
 *         description: returns the user identified by the email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 id: 0
 *                 name: "User Name"
 *                 email: "user.name@email.com"
 */
export default function handler(req, res) {
  if (req.method === "GET") {
    return getUserByEmail(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function getUserByEmail(req, res) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.query.email,
      },
    });

    if (user) {
      return res.status(200).json(user, { success: true });
    }
    res.status(400).json({
      error: "Could not found user with specified email",
      success: false,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving the user", success: false });
  }
}