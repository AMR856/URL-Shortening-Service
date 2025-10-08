const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const regsiterUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        msg: "You should provide an email and a password, and they're better be valid",
      });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message:
          "Email and password are required, and thery're better be valid",
      });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  const storedToken = await prisma.refresh_tokens.findUnique({
    where: { token },
  });
  if (!storedToken) return res.sendStatus(403);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res.status(200).json({ accessToken: newAccessToken });
  });
};

module.exports = {
  regsiterUser,
  loginUser,
  refreshToken,
};
