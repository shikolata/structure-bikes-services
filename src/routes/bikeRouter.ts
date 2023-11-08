import express, {Request, Response} from "express";
import * as bikeModel from "../models/bike";
import {Bike} from "../types/bike";
const bikeRouter = express.Router();

bikeRouter.get("/", async (req: Request, res: Response) => {
    bikeModel.findAll(async (err: Error, bikes: Bike[]) => {
        if (err) {
            return res.status(500).json({"errorMessage": err.message});
        }

        return res.status(200).json(bikes);
    });
});

bikeRouter.post("/", async (req: Request, res: Response) => {
    const newBike: Bike = req.body;
    bikeModel.create(newBike, (err: Error, bikeId: number) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }

        return res.status(200).json(bikeId);
    });
});

bikeRouter.get("/:id", async (req: Request, res: Response) => {
    const bikeId: number = Number(req.params.id);
    bikeModel.findOne(bikeId, async (err: Error, bike: Bike) => {
        if (err) {
            return res.status(500).json({"message": err.message});
        }

        return res.status(200).json(bike);
    });
});

bikeRouter.put("/", async (req: Request, res: Response) => {
    const bike: Bike = req.body;
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
