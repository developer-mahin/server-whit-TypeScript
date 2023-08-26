import jwt, { Secret, SignOptions } from "jsonwebtoken";

const generateJsonwebtoken = async (
  payload: any,
  secretKey: Secret | string,
  expireIn: string | number
): Promise<string> => {
  try {
    if (typeof payload !== "object" || !payload) {
      throw new Error("payload must be an object");
    }
    if (typeof secretKey !== "string" || secretKey === "") {
      throw new Error("secret key must be a string");
    }
    const token = jwt.sign(payload, secretKey, {
      expiresIn: expireIn,
    });
    return token;
  } catch (error) {
    throw new Error("Failed to sign up to jwt");
  }
};

export default generateJsonwebtoken;
