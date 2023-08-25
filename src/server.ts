import app from "./app";
import mongoose from "mongoose";
import colors from "colors";
import * as dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE;

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    databaseURL: string;
  }
}

mongoose
  .connect("mongodb://127.0.0.1:27017/ts")
  .then(() => {
    console.log(colors.blue.bold("database connect successful"));
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(port, () => {
  console.log(
    colors.white.bold(`Serer running on the port http://localhost:${port}`)
  );
});
