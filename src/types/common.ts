export interface BasicEntity {
    id: number;
}

export interface StoredImage {
    originalImageName: string;
    newImageName: string;
}

export interface PresentedImage {
    url: string;
    imageName: string;
}
