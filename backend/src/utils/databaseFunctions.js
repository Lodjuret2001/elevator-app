import mysql from "mysql";
import { db } from "../index.js";

async function getElevatorWithId(id) {
  let sql = `SELECT * FROM elevators WHERE id = ${id}`;

  return new Promise((resolve, reject) => {
    try {
      db.query(sql, (err, result) => {
        if (err || result.affectedRows === 0) {
          return reject(
            console.log(`Elevator with id: ${id} was not found`, err)
          );
        }

        return resolve(result[0]);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

async function getElevatorWithQuery(sql) {
  return new Promise((resolve, reject) => {
    try {
      db.query(sql, (err, result) => {
        if (err) {
          return reject(console.log(err));
        }

        return resolve(result[0]);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

async function getElevators(sql) {
  return new Promise((resolve, reject) => {
    try {
      db.query(sql, (err, result) => {
        if (err || result.length === 0) {
          return reject();
        }

        return resolve(result);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

async function updateElevator(sql) {
  return new Promise((resolve, reject) => {
    try {
      db.query(sql, (err, result) => {
        if (err || result.affectedRows === 0) {
          return reject(
            console.log(`Elevator with given id was not found`, err)
          );
        }

        return resolve(result);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

export {
  getElevatorWithId,
  getElevators,
  getElevatorWithQuery,
  updateElevator,
};
