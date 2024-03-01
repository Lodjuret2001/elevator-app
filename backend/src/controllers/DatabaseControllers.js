import mysql from 'mysql';
import { db } from "../index.js";

const DatabaseControllers = {

    createDatabase: async (req, res) => {
        let sql = 'CREATE DATABASE IF NOT EXISTS elevator_db;';
        
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result);
            res.send('Created database...');
        })
    },
    
    createTable: async (req, res) => {
        let sql = 'CREATE TABLE elevators (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, currentFloor INT NOT NULL, status VARCHAR(50) NOT NULL DEFAULT \'idle\', destinationFloor INT NOT NULL DEFAULT 0);';
    
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result);
            res.send('Created elevators table...');
        })
    },
    
    createElevators: async(req, res) => {
        let sql = 'INSERT INTO elevators (currentFloor) VALUES (1),(1),(1);';
        
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result);
            res.send('Created elevators...');
        })
    }
}

export default DatabaseControllers;