import express from "express";
import Home from "./routes/home.module";
import path from "path";
import cookieParser from "cookie-parser";
import SqlGeneratorComponent from "./routes/sqlGenerator.module";
import DBConnectionComponent from "./routes/dbConnection.module";

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    // Allow cross-origin.....
    this.express.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Boundary, Content-Type, Accept, Authorization, X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description"
      );
      next();
    });

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, "globals")));

    this.express.use("/", Home.getHome());
    this.express.use("/sql", SqlGeneratorComponent.getSql());
    this.express.use("sql", DBConnectionComponent.getIndicatorData());
    this.express.use("/sql", DBConnectionComponent.getAnnualData());
    this.express.use("/sql", DBConnectionComponent.setUpDatabase());
    this.express.use("/sql", DBConnectionComponent.clearDatabase());
  }
}

export default new App().express;
