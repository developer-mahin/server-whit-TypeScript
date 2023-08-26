import { Request, Response, NextFunction, response } from "express";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import sendEmail from "../utils/sendEmail";
import User from "../models/user";
import generateJsonwebtoken from "../utils/jsonwebtoken";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY || "secret_key";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
      status,
      phone,
      image,
    } = req.body;

    const isExist = await User.exists({ email });
    if (isExist) {
      throw new Error(
        "User already exists with this email address. Please try again with another email address."
      );
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const query = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role: "user",
      status: "active",
    };

    const token = await generateJsonwebtoken(query, secretKey, "10m");

    try {
      const mailData = {
        email: email,
        subject: "Account Activation Email",
        html: `
                <h2>Hello ${firstName} ${" "} ${lastName} !</h2>
                <p>Please activate your account to click here </p>
                <a
                style="padding:10px 20px; color:green; background:cyan; border-radius:5px;text-decoration:none"
                href="${process.env.SERVER_URL}api/v1/auth/verify/${token}"
                target="_blank"
                >
                Click here to activate
                </a>
                `,
      };
      await sendEmail(mailData);
    } catch (error) {
      next(error);
      return;
    }

    res.json({
      success: true,
      message: "Please go to your email and complete the verification process.",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAndActivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    console.log(token);
    if (!token) {
      throw createError(404, "Token not found");
    }

    try {
      const decoded: any = jwt.verify(token, secretKey);
      if (!decoded) {
        throw createError(401, "unauthorized access");
      }

      const isExist = await User.exists({ email: decoded.email });
      if (isExist) {
        throw createError(400, "User already exist with this email");
      }

      const user = await User.create(decoded);

      res.send(`

            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body
                style="background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(https://i.ibb.co/wYYTcPF/JOB-HUNTER-removebg-preview.png); 
                background-position: center; background-repeat: no-repeat; background-size: contain;  display: flex; align-items:  center; justify-content: center; height: 98vh; color: white;">
                <div>
                    <h1 style="text-align:center ; font-size: 70px; margin: 0;">Hello ${
                      decoded.firstName + " " + decoded.lastName
                    }</h1>
                    <p style="text-align:center ;font-size: 50px; margin: 0;">You are now a verified user</p>
                    <p style="text-align:center ;font-size: 40px; margin: 0;">Please login your with your account</p>
                    <div style="display: flex; align-items: center; justify-content: center; margin-top: 20px;">
                        <a href="http://localhost:3000/login"
                            style="padding: 12px 20px; background-color: aqua; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 30px;">Login</a>
                    </div>
                </div>
            </body>
            </html>
            `);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User not found with this email address please try with another email address"
      );
    }

    const isMatchedPassword = bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      throw createError(
        400,
        "email/password not match please try again with valid information or create account"
      );
    }

    if (user.status !== "active") {
      throw createError(
        400,
        "You are not active user please contact with authority"
      );
    }

    interface UserData {
      email: string;
      userId: any;
    }

    const userData: UserData = {
      email,
      userId: user._id,
    };

    const token = await generateJsonwebtoken(userData, secretKey, "10days");

    res.cookie("access_token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "user login successfully",
      user,
      token,
    });

    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "user logout successful",
    });
  } catch (error) {
    next(error);
  }
};
