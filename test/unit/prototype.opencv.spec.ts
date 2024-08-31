import cv from "@techstark/opencv-js";
import Jimp from "jimp";

describe('Prototyping', () => {
    const openCvLoadTimeout = 25000;

    beforeAll(async() =>
        new Promise<void>((resolve) => {
            cv.onRuntimeInitialized = () => resolve()
        }), openCvLoadTimeout
     );

    it('should load opencv package', async () => {
        const img = await Jimp.read('./test/unit/data/dog_running_0.png');
        const src = cv.matFromImageData(img.bitmap);
        
        expect(src).toBeDefined();
    });
});
