import {BasicEntity} from "./common";

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
