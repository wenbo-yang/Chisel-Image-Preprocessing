import * as staticServiceConfig from '../configs/service.config.json';
import * as globalServicePortMappings from '../Chisel-Global-Service-Configs/configs/globalServicePortMappings.json';
import { IImagePreprocessingServiceConfig, ServiceConfig, ServicePorts } from './types/imagePreprocessingTypes';

export class ImagePreprocessingServiceConfig implements IImagePreprocessingServiceConfig {
    private serviceConfig: ServiceConfig;
    private globalServicePortMappings: any;

    constructor(serviceConfig?: ServiceConfig, parsedGlobalServicePortMappings?: any) {
        this.serviceConfig = serviceConfig || staticServiceConfig;
        this.globalServicePortMappings = parsedGlobalServicePortMappings || globalServicePortMappings;
    }

    public get grayScaleWhiteThreshold() {
        return 250;
    }

    public get shortName() {
        return this.serviceConfig.shortName;
    }

    public get useGPU() {
        return false;
    }

    public get env() {
        return process.env.NODE_ENV || 'development';
    }

    public get servicePorts(): ServicePorts {
        return this.globalServicePortMappings.hasOwnProperty(this.serviceConfig.serviceName) && this.globalServicePortMappings[this.serviceConfig.serviceName].hasOwnProperty(this.env) ? this.globalServicePortMappings[this.serviceConfig.serviceName][this.env] : { http: 5000, https: 3000 };
    }
}
