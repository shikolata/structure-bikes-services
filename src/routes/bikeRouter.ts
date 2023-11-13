import express, {Request, Response} from "express";
import * as bikeModel from "../models/bike";
import {Bike, PresentedBike, StoredBike} from "../types/bike";
import {generatePresentedBike} from "../models/bike.helper";
const bikeRouter = express.Router();

bikeRouter.get("/", async (req: Request, res: Response) => {
    bikeModel.findAll(async (err: Error, bikes: StoredBike[]) => {
        if (err) {
            return res.status(500).json({"errorMessage": err.message});
        }

        let presentedBikes: PresentedBike[] = [];
        for(const bike of bikes) {
            const presentedBike: PresentedBike = await generatePresentedBike(bike);
            presentedBikes.push(presentedBike);
        }

        return res.status(200).json(presentedBikes);
    });
});

bikeRouter.post("/", async (req: Request, res: Response) => {
    const newBike: PresentedBike = req.body;
    bikeModel.create(newBike, (err: Error, bikeId: number) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }

        return res.status(200).json(bikeId);
    });
});

bikeRouter.get("/:id", async (req: Request, res: Response) => {
    const bikeId: number = Number(req.params.id);
    bikeModel.findOne(bikeId, async (err: Error, bike: StoredBike) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }

        const presentedBike: PresentedBike = await generatePresentedBike(bike);

        return res.status(200).json(presentedBike);
    });
});

bikeRouter.put("/", async (req: Request, res: Response) => {
    const bike: PresentedBike = req.body;
    bikeModel.update(bike, (err: Error) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }

        return res.status(200).send();
    })
});

bikeRouter.delete("/:id", async (req: Request, res: Response) => {
    const bikeId: number = Number(req.params.id);
    bikeModel.deleteOne(bikeId, (err: Error, bike: Bike) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }
        return res.status(200).json({"data": bike});
    })
});

export {bikeRouter};
