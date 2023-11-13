import {BasicEntity, PresentedImage} from "./common";

export interface Bike extends BasicEntity {
    name: string;
    year: string;
    make: string;
    model: string;
    description: string;
    rating: string;
    price: string;
    quantity: number;
    category: string;
}

export interface PresentedBike extends Bike {
    images: PresentedImage[];
}

export interface StoredBike extends Bike {
    images: string;
}
