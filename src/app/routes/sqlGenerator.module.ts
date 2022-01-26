import express from "express";
import DeriveCreateSQL from "../globals/dbCreate.component";
let router = express.Router();

class SqlGeneratorComponent {
  public getSql() {
    return router.get("/", (req: any, res: any) =>
      DeriveCreateSQL.then((data) => res.json(data))
    );
  }
}
export default new SqlGeneratorComponent();
