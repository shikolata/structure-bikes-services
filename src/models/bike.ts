import {Bike} from "../types/bike";
import {db} from "../../db";
import { OkPacket, RowDataPacket } from "mysql2";

export const create = (bike: Bike, callback: Function) => {
    const queryString = "INSERT INTO bike (name, year, make, model, description, rating, price, quantity, category, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    db.query(
        queryString,
        [bike.name, bike.year, bike.make, bike.model, bike.description,
        bike.rating, bike.price, bike.quantity, bike.category, null],
        (err, result) => {
            if (err) {callback(err)};

            const insertId = (<OkPacket> result).insertId;
            callback(null, insertId);
        }
    );
};

export const findOne = (bikeId: number, callback: Function) => {

    const queryString = `SELECT * FROM bike WHERE id=?`

    db.query(queryString, bikeId, (err, result) => {
        if (err) {callback(err)}

        const row: Bike = (<RowDataPacket> result)[0];
        callback(null, row);
    });
}

export const findAll = (callback: Function) => {
    const queryString = `SELECT * FROM bike`

    db.query(queryString, (err, result) => {
        if (err) {callback(err)}

        const rows = <RowDataPacket[]> result;
        const bikes: Bike[] = [];

        rows.forEach(row => {
            const bike: Bike = row as Bike;
            bikes.push(bike);
        });
        callback(null, bikes);
    });
}

export const update = (bike: Bike, callback: Function) => {
    const queryString = `UPDATE bike SET name=?, year=?, make=?, model=?, description=?, rating=?, price=?, quantity=?, category=? WHERE id=?`;

    db.query(
        queryString,
        [bike.name, bike.year, bike.make, bike.model, bike.description,
            bike.rating, bike.price, bike.quantity, bike.category, bike.id],
        (err, result) => {
            if (err) {callback(err)}
            callback(null);
        }
    );

    // update only the things changed?
}

export const deleteOne = (bikeId: number, callback: Function) => {
    const queryString = `DELETE FROM bike WHERE id=?`

    db.query(queryString, bikeId, (err, result) => {
        if (err) {callback(err)}

        const row: Bike = (<RowDataPacket> result)[0];
        callback(null, row);
    });
}
