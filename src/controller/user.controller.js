import { asyncHandler } from "../utils/AsyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import uploadFileOnCloudnary from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* 
  regisrter user todos:  
  get user details from frontend
  validation - not empty
  check if user already exists: username, email
  check for images, check for avatar
  upload them to cloudinary, avatar
  create user object - create entry in db
  remove password and refresh token field from response
  check for user creation
  return res
*/
const userRegister = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  //  console.log(`email : ${email}`);
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are reqired");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverimage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverImageLocalPath = req.files.coverimage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar file is required");
  }

  const avatar = await uploadFileOnCloudnary(avatarLocalPath);
  const coverimage = await uploadFileOnCloudnary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

/*
  Login user todos
  1. Check if user exists
  2. Check if password is correct
  3. Generate JWT token
  4. Save refresh token
  5. Return user and token
  6. find cookies
 */

const userLogin = asyncHandler(async (req, res) => {});
export { userRegister ,userLogin};
