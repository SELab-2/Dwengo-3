import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.get("/hello", (req: Request, res: Response)=> {
    res.send("Hello World");
});


app.listen(port, () => {
    console.log(`[SERVER] - listening on http://localhost:${port}`);
});