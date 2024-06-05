import { COMPRESSIONTYPE, IMAGEDATATYPE, IServicePorts } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes'

export interface IImagePreprocessingServiceConfig {
    grayScaleWhiteThreshold: number;
    shortName: string;
    useGPU: boolean;
    env: string;
    servicePorts: IServicePorts;
}

export interface ImagePreprocessRequestBody {
    originalImage: string;
    inputCompression: COMPRESSIONTYPE;
    outputCompression: COMPRESSIONTYPE;
    outputType: IMAGEDATATYPE;
    outputHeight: number;
    outputWidth: number;
}
