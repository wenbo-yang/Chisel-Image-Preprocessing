export interface IImagePreprocessingServiceConfig {
    grayScaleWhiteThreshold: number;
    shortName: string;
    useGPU: boolean;
    env: string;
    servicePorts: ServicePorts;
}

export interface ServiceConfig {
    serviceName: string;
    shortName: string;
}

export interface ServicePorts {
    http: number;
    https: number;
}
