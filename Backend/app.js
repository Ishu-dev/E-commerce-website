import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

//21 Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("shutting down due to uncaught exception");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

//connecting to database
connectDatabase();

app.use(express.json());
app.use(cookieParser());

//21
// console.log(hello);

//import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);

//using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode. `
  );
});

//20 handle unhandled promise rejection error
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to unhandled promise");
  server.close(() => {
    process.exit(1);
  });
});
///erererverv
//dfvdfvdfvsdfv
