import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import {PresentedImage, StoredImage} from "../types/common";
import {PresentedBike, StoredBike} from "../types/bike";

dotenv.config();

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

export const generatePresentedBike = async (storedBike: StoredBike): Promise<PresentedBike> => {
    let presentedImages: PresentedImage[] = [];

    if (storedBike.images) {
        for (const storedImage of (JSON.parse(storedBike.images) as StoredImage[])) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: storedImage.newImageName
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            presentedImages.push({
                url: url,
                imageName: storedImage.originalImageName
            });
        }
    }

    const presentedBike: PresentedBike = {
        ...storedBike,
        images: presentedImages
    };
    return presentedBike;
}
