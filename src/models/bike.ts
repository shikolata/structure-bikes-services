import {Bike, PresentedBike, StoredBike} from "../types/bike";
import {db} from "../../db";
import { OkPacket, RowDataPacket } from "mysql2";
import {StoredImage} from "../types/common";
import {ERRORS, MAX_NUMBER_OF_IMAGES} from "../constants";

export const create = (presentedBike: PresentedBike, callback: Function) => {
    const queryString = "INSERT INTO bike (name, year, make, model, description, rating, price, quantity, category, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    db.query(
        queryString,
        [presentedBike.name, presentedBike.year, presentedBike.make, presentedBike.model, presentedBike.description,
            presentedBike.rating, presentedBike.price, presentedBike.quantity, presentedBike.category, null],
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

        const row: StoredBike = (<RowDataPacket> result)[0];
        callback(null, row);
    });
}

export const findAll = (callback: Function) => {
    const queryString = `SELECT * FROM bike`

    db.query(queryString, (err, result) => {
        if (err) {callback(err)}

        const rows = <RowDataPacket[]> result;
        const storedBikes: StoredBike[] = [];

        rows.forEach(row => {
            const storedBike: StoredBike = row as StoredBike;
            storedBikes.push(storedBike);
        });
        callback(null, storedBikes);
    });
}

export const update = (presentedBike: PresentedBike, callback: Function) => {
    const queryString = `UPDATE bike SET name=?, year=?, make=?, model=?, description=?, rating=?, price=?, quantity=?, category=? WHERE id=?`;

    db.query(
        queryString,
        [presentedBike.name, presentedBike.year, presentedBike.make, presentedBike.model, presentedBike.description,
            presentedBike.rating, presentedBike.price, presentedBike.quantity, presentedBike.category, presentedBike.id],
        (err, result) => {
            if (err) {callback(err)}
            callback(null);
        }
    );

    // update only the things changed?
}

export const addImage = (bikeId: number, image: StoredImage, callback: Function) => {
    const imageQueryString = `SELECT images FROM bike WHERE id=?`

    db.query(imageQueryString, bikeId, (err, result) => {
        if (err) {callback(err)}

        const imagesString = (<RowDataPacket> result)[0]?.images;
        let updatedImages: StoredImage[] = [];
        if(!!imagesString) {
            updatedImages = JSON.parse(imagesString) as StoredImage[];

            if (updatedImages.length >= MAX_NUMBER_OF_IMAGES) {
                callback(ERRORS.MAX_NUMBER_OF_IMAGES);
            }
        }

        updatedImages.push(image);

        const updateImagesQueryString = `UPDATE bike SET images=? WHERE id=?`;

        db.query(
            updateImagesQueryString,
            [JSON.stringify(updatedImages), bikeId],
            (err, result) => {
                if (err) {callback(err)}

                findOne(bikeId, callback);
            }
        );
    });
}

export const deleteImage = (bikeId: number, originalImageName: string, callback: Function) => {
    const imageQueryString = `SELECT images FROM bike WHERE id=?`

    db.query(imageQueryString, bikeId, (err, result) => {
        if (err) {callback(err)}

        const imagesString = (<RowDataPacket> result)[0]?.images;
        let images: StoredImage[] = [];
        if(!!imagesString) {
            images = JSON.parse(imagesString) as StoredImage[];
        }

        const updatedImages: StoredImage[] = images.filter((image: StoredImage) => image.originalImageName !== originalImageName);

        const updateImagesQueryString = `UPDATE bike SET images=? WHERE id=?`;

        db.query(
            updateImagesQueryString,
            [JSON.stringify(updatedImages), bikeId],
            (err, result) => {
                if (err) {callback(err)}

                const imageNewName: StoredImage | undefined = images.find((image:StoredImage) => image.originalImageName === originalImageName);

                findOne(bikeId, callback(null, imageNewName));
            }
        );
    });
}

export const deleteOne = (bikeId: number, callback: Function) => {

    const queryString = `DELETE FROM bike WHERE id=?`

    db.query(queryString, bikeId, (err, result) => {
        if (err) {callback(err)}

        const row: Bike = (<RowDataPacket> result)[0];
        callback(null, row);
    });
}
