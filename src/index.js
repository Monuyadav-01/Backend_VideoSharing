import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`Server connected`);
    });
  })
  .catch((error) => {
    console.log(`Error connecting to database ${error}`);
  });
