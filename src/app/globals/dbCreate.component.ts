import _ from "lodash";
import fs from "fs";
import { parse } from "csv-parse";

const isWin: boolean = process.platform === "win32";
const delimiter: string = isWin ? "\\" : "/";
const numberOfDirectoriesUp: number = 1;
const pathToFileToParse: string[] = ["resources", "World Bank-CHN.csv"]; // must stay in order
let currentDirArr: string[] = __dirname
  .split(delimiter)
  .slice(0, -numberOfDirectoriesUp);

for (const directory of pathToFileToParse) {
  currentDirArr.push(directory);
}
const dirPath: string = currentDirArr.join(delimiter);

const sanitize:(str:string)=>string =  (str:string)=>{
  return str.replace("'","''");
}

export default new Promise((resolve, reject) => {
  var csvData = [];
  fs.createReadStream(dirPath)
    .pipe(parse({ delimiter: "," }))
    .on("data", (csvrow) => csvData.push(csvrow))
    .on("end", () => {
      let totalSql:string[] =[
        `CREATE TABLE Indicator ( ` +
        `id VARCHAR(38) NOT NULL, ` +
        `name VARCHAR(255) NOT NULL, ` +
        `code VARCHAR(255) NOT NULL, ` +
        `PRIMARY KEY(id)); `];
      totalSql.push(
        `CREATE TABLE AnnualData ( ` +
        `id VARCHAR(38) NOT NULL, ` +
        `indicatorId VARCHAR(38) NOT NULL, ` +
        `year INT(5) NOT NULL, ` +
        `value BIGINT(20) NOT NULL, ` +
        `PRIMARY KEY (ID), ` +
        `FOREIGN KEY (indicatorId) ` +
        `REFERENCES INDICATOR(id) ` +
        `ON DELETE CASCADE);`);
      let fields: string = "";
      for (let i = 0; i < csvData.length; i++) {
        if (i == 0) {
          fields = csvData[i];
        } else {
          let indicator_id = "";
          let indicator_sql_code = "";
          for (let j = 1; j < csvData[i].length; j++) {
            // skip the zeroth, just the name
            let value = csvData[i][j];
            if (j == 1) {
              totalSql.push(`INSERT INTO Indicator (id,name,code) VALUES (uuid(),'${sanitize(csvData[i][0])}','${csvData[i][j]}');`);
              indicator_id = `SELECT id FROM Indicator WHERE code = '${value}'`;
            } else if (value != "") {
              indicator_sql_code += `${
                indicator_sql_code.length == 0 ? "" : ","
              }(uuid(),(${indicator_id}),${fields[j]},${value})`;
            }
          }
          if (indicator_sql_code.length > 0) {
            totalSql.push(`INSERT INTO AnnualData (id,indicatorId,year,value) VALUES${indicator_sql_code};`);
          }
        }
      }
      // fs.writeFile(
      //   `${__dirname
      //     .split(delimiter)
      //     .slice(0, -numberOfDirectoriesUp)
      //     .join(delimiter)}/resources/insert_data.sql`,
      //   JSON.stringify(totalSql),
      //   (err) => {
      //     if (err) {
      //       console.error(err);
      //       return;
      //     }
      //   }
      // );
      resolve(totalSql);
    });
});

