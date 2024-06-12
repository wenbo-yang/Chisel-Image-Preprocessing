import { COMPRESSIONTYPE, IMAGEDATATYPE, IServicePorts, Point } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes'

export interface IImagePreprocessingServiceConfig {
    grayScaleWhiteThreshold: number;
    shortName: string;
    useGPU: boolean;
    env: string;
    servicePorts: IServicePorts;
}

export interface ImagePreprocessRequestBody {
    originalImage: string;
    originalImageType: IMAGEDATATYPE;
    inputCompression: COMPRESSIONTYPE;
    outputCompression: COMPRESSIONTYPE;
    outputType: IMAGEDATATYPE;
    outputHeight: number;
    outputWidth: number;
}

export interface ImagePreprocessingResponseBody {
    processedImages: ProcessedImage[]
}

export interface BoundingRect {
    topleft: Point;
    bottomRight: Point;
}

export interface ProcessedImage {
    processedImageType: IMAGEDATATYPE;
    processedImageCompression: COMPRESSIONTYPE;
    processedImage: string;
    processedImageHeight: number;
    processedImageWidth: number; 
    originalBoundingRect: BoundingRect; // topleft is the offset from original image
}


