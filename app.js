import express  from "express";
import cors from "cors";
import { router } from "./routes/index.js"


const app = express();

app.use("/api", router);
app.use(cors());
app.use(express.static('public'));
app.use(express.static('views'));
app.listen(3000);