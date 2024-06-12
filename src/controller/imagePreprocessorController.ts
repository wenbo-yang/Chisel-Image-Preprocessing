import { ImagePreprocessorModel } from '../model/imagePreprocessorModel';
import { ImagePreprocessingServiceConfig } from '../config';
import { IImagePreprocessingServiceConfig, ImagePreprocessRequestBody } from '../types/imagePreprocessorTypes';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { DoNotRespondError } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';

export class ImagePreprocessingServiceController {
    private imagePreprocessorModel: ImagePreprocessorModel;
    private config: IImagePreprocessingServiceConfig;

    constructor(config?: IImagePreprocessingServiceConfig, imagePreprocessorModel?: ImagePreprocessorModel) {
        this.config = config || new ImagePreprocessingServiceConfig();
        this.imagePreprocessorModel = imagePreprocessorModel || new ImagePreprocessorModel(this.config);
    }

    public async process(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>): Promise<void> {
        try {
            const body = req.body as ImagePreprocessRequestBody;
            const readStream = await this.imagePreprocessorModel.processImage(body);
            readStream.pipe(res);
        } catch (e) {
            throw new DoNotRespondError(e as Error);
        }
    }
}
