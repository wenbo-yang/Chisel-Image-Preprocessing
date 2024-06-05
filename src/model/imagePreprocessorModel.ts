import { ReadStream } from "fs";
import { IImagePreprocessingServiceConfig, ImagePreprocessRequestBody } from "../types/imagePreprocessorTypes";

export class ImagePreprocessorModel {
    constructor(config?: IImagePreprocessingServiceConfig) {
    }

    public async processImage(body: ImagePreprocessRequestBody): Promise<ReadStream> {
        throw new Error('Method not implemented.');
    }
}
