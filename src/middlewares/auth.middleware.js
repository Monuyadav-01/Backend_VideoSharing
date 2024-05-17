import { User } from "../models/user.models";
import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt, { decode } from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorize request");
    }

    const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded_token?._id).select(
      +"-password -refreshtoken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid accesstoken");
    }
    req.user = user;
    next();
  } catch (error) {
     throw new ApiError(401, error?.message || "Invalid access token");
  }
});
export {verifyJWT}
