import { Subscription } from "../models/subscription.model.js";
import {asyncHandler }from "../utils/AsyncHandler.js"

const subscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
})
