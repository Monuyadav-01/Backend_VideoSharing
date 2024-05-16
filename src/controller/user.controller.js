import { asyncHandler } from "../utils/AsyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import uploadFileOnCloudnary from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const accessTokenAndRefreshTokens = async (userId) => {
  /*
   * @accessToken Generate Access Token of User
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const userRegister = asyncHandler(async (req, res) => {
  /*
* @desc    Register a new user    
* @route   POST /api/v1/auth/register
* @access  Public

 */

  /* 
  regisrter user todos:-> 
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

const userLogin = asyncHandler(async (req, res) => {
  /*
* @route   POST /api/users/login
* @desc    Login user
* @access  Public

*/
  /*
  Login user todos :->
  0. take req.body -> data
  1. Check if user exists
  2. Check if password is correct
  3. Generate JWT token
  4. Save refresh token
  5. Return user and token
  6. send cookies
  7. send response
 */
  const { username, email, password } = req.body;
  // console.log(email);
  if ((email || username) && password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    new ApiError(404, "user does not find");
  }
  const userPassword = await user.isPasswordCorrect(password);
  if (!userPassword) {
    new ApiError(408, "Password is incorrect");
  }
  res.status(200).json(new ApiResponse(200, "user find"));

  const { accesstoken, refreshtoken } = await accessTokenAndRefreshTokens(
    user._id
  );
  const loggedInUser = await user
    .findById(user._id)
    .select("-password -refreshtoken");

  /*
    user cookies through server
  */
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("accesstoken", refreshtoken, options);
});
export { userRegister, userLogin, accessTokenAndRefreshTokens };
