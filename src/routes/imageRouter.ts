import express, {Request, Response} from "express";
import multer from 'multer';
import {S3Client, PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import crypto from 'crypto';
import sharp from 'sharp';
import * as bikeModel from "../models/bike";
import {PresentedBike, StoredBike} from "../types/bike";
import {generatePresentedBike} from "../models/bike.helper";
import dotenv from 'dotenv';
import {StoredImage} from "../types/common";

const imageRouter = express.Router();

dotenv.config();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = `${process.env.ACCESS_KEY}`;
const secretAccessKey = `${process.env.SECRET_ACCESS_KEY}`;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.post("/", upload.single('image'), async (req: Request, res: Response) => {
    // resize image
    const buffer = await sharp(req.file?.buffer).resize({
        height: 1920,
        width: 1080,
        fit: "contain"
    }).withMetadata().toBuffer();

    const newImageName = randomImageName();

    const params = {
        Bucket: bucketName,
        Key: newImageName,
        Body: buffer,
        ContentType: req.file?.mimetype
    };
    const command = new PutObjectCommand(params);

    await s3.send(command);

    const newImage: StoredImage = {
        originalImageName: `${req.file?.originalname}`,
        newImageName: newImageName
    }

    const bikeId = parseInt(req.body.id);

    bikeModel.addImage(bikeId, newImage, async (err: Error, storedBike: StoredBike) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }

        const presentedBike: PresentedBike = await generatePresentedBike(storedBike);

        return res.status(200).json(presentedBike);
    });
});

imageRouter.delete("/", async (req: Request, res: Response) => {
    const originalImageName: string = req.body.imageName;
    const bikeId: number = parseInt(req.body.bikeId);
    bikeModel.deleteImage(bikeId, originalImageName, (imageDeleteError: Error, newImageName: string | undefined) => async (bikeFindError: Error, storedBike: StoredBike) => {
        if (imageDeleteError) {
            return res.status(500).json({"message": imageDeleteError.message});
        }

        if (!!newImageName) {
            const params = {
                Bucket: bucketName,
                Key: originalImageName
            };
            const command = new DeleteObjectCommand(params);

            await s3.send(command);
        }

        if (bikeFindError) {
            return res.status(200).json('Could not retrieve updated Bike; please refresh the page!');
        } else {
            const presentedBike: PresentedBike = await generatePresentedBike(storedBike);

            return res.status(200).json(presentedBike);
        }
    });
});

export {imageRouter};
