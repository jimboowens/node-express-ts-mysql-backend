import express from "express";
import { Request, Response } from "express";
import Producer from "../globals/producer.component";
let router = express.Router();

class Home {
  public getHome() {
    return router.get("/", (req: Request, res: Response) => res.json(Producer));
  }
}
export default new Home();
