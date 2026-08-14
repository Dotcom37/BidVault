import jwt from "jsonwebtoken";

export const protect = (request) => {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: Response.json(
          { error: "Not authorized" },
          { status: 401 }
        ),
      };
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      user: {
        id: decoded.id,
      },
    };
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return {
      error: Response.json(
        { error: "Invalid token" },
        { status: 401 }
      ),
    };
  }
};