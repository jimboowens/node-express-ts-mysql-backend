import express, { NextFunction, Request, Response } from "express";
import DeriveCreateSQL from "../globals/dbCreate.component";
import * as config from "../../../config";
import mysql from "mysql";
let router = express.Router();
let connection = mysql.createConnection(config.default.db);
connection.connect();

class DBConnectionComponent {
  public getIndicatorData() {
    return router.get("/getIndicatorData", (req: Request, res: Response) => {
      connection.query("select * from Indicator;", [], (err, results) =>
        res.json(results)
      );
    });
  }

  public getAnnualData() {
    return router.post(
      "/getAnnualData",
      (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        const yearMin: string = body.yearMin;
        const yearMax: string = body.yearMax;
        let indicatorIds = body.indicatorIds;
        let sql =
          "SELECT ad.id,i.code,i.name,ad.year,ad.value FROM AnnualData ad JOIN Indicator i ON ad.indicatorId = i.id";
        let sqlKeyword: string = " WHERE ";
        if (yearMin != undefined && yearMin.length > 0) {
          sql += ` ${sqlKeyword} year > ${yearMin} `;
          sqlKeyword = " AND ";
        }
        if (yearMax != undefined && yearMax.length > 0) {
          sql += ` ${sqlKeyword} year < ${yearMax}`;
          sqlKeyword = " AND ";
        }
        if (indicatorIds != undefined && indicatorIds.length > 0) {
          indicatorIds = indicatorIds.split(",");
          sql += ` ${sqlKeyword} indicatorId IN (?)`;
        }
        connection.query(sql, [indicatorIds], (err, results) =>
          res.json(results)
        );
      }
    );
  }

  public setUpDatabase() {
    return router.get(
      "/setupDB",
      (req: Request, res: Response, next: NextFunction) => {
        DeriveCreateSQL.then((sqlArr: string[]) => {
          new Promise((resolve, reject) => {
            let errors: Error[] = [];
            for (let sql of sqlArr) {
              connection.query(sql, [], (err, results) => {
                if (err) {
                  errors.push(err);
                }
              });
            }
            resolve(errors);
          }).then((errors: Error[]) => {
            let response: any = {};
            if (errors.length > 0) {
              response["errors"] = errors;
            } else {
              response["success"] = "success!";
            }
            res.json(response);
          });
        });
      }
    );
  }

  public clearDatabase() {
    return router.get(
      "/clearDB",
      (req: Request, res: Response, next: NextFunction) => {
        const sqlArr = [
          "DELETE FROM Indicator; ",
          "ALTER TABLE AnnualData DROP FOREIGN KEY annualdata_ibfk_1; ",
          "DROP TABLE Indicator; ",
          "DROP TABLE AnnualData; ",
        ];
        new Promise((resolve, reject) => {
          let errors: Error[] = [];
          let results = [];
          for (let sql of sqlArr) {
            connection.query(sql, [], (err, results) => {
              if (err) {
                errors.push(err);
              }
            });
          }
          let resolution: any = {
            done: "done",
            errors: errors,
            results: results,
          };
          resolve(resolution);
        }).then((resolution) => res.json(resolution));
      }
    );
  }
}
export default new DBConnectionComponent();
