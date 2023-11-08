import * as dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import {bikeRouter} from "./src/routes/bikeRouter";

const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.WEBAPP_ORIGIN
}));
app.use(express.json());
app.use("/bikes", bikeRouter);

app.listen(process.env.PORT, () => {
    console.log("Node server started running");
});

