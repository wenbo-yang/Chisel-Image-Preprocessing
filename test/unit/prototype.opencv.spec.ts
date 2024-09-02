import cv from '@techstark/opencv-js';
import Jimp from 'jimp';

describe('Prototyping', () => {
    const openCvLoadTimeout = 25000;

    beforeAll(
        async () =>
            new Promise<void>((resolve) => {
                cv.onRuntimeInitialized = () => resolve();
            }),
        openCvLoadTimeout,
    );

    it('should load opencv package', async () => {
        const img = await Jimp.read('./test/unit/data/dog_running_0.png');
        const src = cv.matFromImageData(img.bitmap);
        expect(src).toBeDefined();
        expect(src.cols).toEqual(img.getWidth());
        expect(src.rows).toEqual(img.getHeight());
        expect(src.data.length).toEqual(img.bitmap.data.length);

        src.delete();
    });

    it('should load opencv package and apply guassian blur', async () => {
        const img = await Jimp.read('./test/unit/data/dog_running_0.png');
        const src = cv.matFromImageData(img.bitmap);
        const blurredImage = new cv.Mat();
        cv.GaussianBlur(src, blurredImage, new cv.Size(5, 5), 0, 0);
        cv.GaussianBlur(blurredImage, blurredImage, new cv.Size(5, 5), 0, 0);

        expect(blurredImage.cols).toEqual(src.cols);
        expect(blurredImage.rows).toEqual(src.rows);
        expect(blurredImage.data.length).toEqual(src.data.length);

        await new Jimp({ width: blurredImage.cols, height: blurredImage.rows, data: Buffer.from(blurredImage.data) }).writeAsync('./test/unit/data/dog_running_0_blurred_test.png');

        src.delete();
        blurredImage.delete();
    });

    it('should load opencv package and apply guassian blur and apply sobel edge detetion', async () => {
        const img = (await Jimp.read('./test/unit/data/dog_running_0.png')).grayscale();
        const src = cv.matFromImageData(img.bitmap);
        const blurredImage = new cv.Mat();
        cv.GaussianBlur(src, blurredImage, new cv.Size(5, 5), 0, 0);

        const sobelX = new cv.Mat();
        const sobelXAbs = new cv.Mat();
        cv.Sobel(blurredImage, sobelX, cv.CV_64F, 1, 0, 5);
        cv.convertScaleAbs(sobelX, sobelXAbs);
        const sobelY = new cv.Mat();
        const sobelYAbs = new cv.Mat();
        cv.Sobel(blurredImage, sobelY, cv.CV_64F, 0, 1, 5);
        cv.convertScaleAbs(sobelY, sobelYAbs);

        const sobelXY = new cv.Mat();
        const sobelXYAbs = new cv.Mat();
        cv.Sobel(blurredImage, sobelXY, cv.CV_64F, 1, 1, 5);
        cv.convertScaleAbs(sobelXY, sobelXYAbs);

        expect(sobelX.cols).toEqual(blurredImage.cols);
        expect(sobelX.rows).toEqual(blurredImage.rows);

        expect(sobelY.cols).toEqual(blurredImage.cols);
        expect(sobelY.rows).toEqual(blurredImage.rows);

        expect(sobelXY.cols).toEqual(blurredImage.cols);
        expect(sobelXY.rows).toEqual(blurredImage.rows);
        let index = 0;
        await new Jimp({ width: sobelXYAbs.cols, height: sobelXYAbs.rows, data: Buffer.from(sobelXYAbs.data.map((n) => (index++ % 4 === 3 ? 255 : n))) }).writeAsync('./test/unit/data/dog_running_0_blurred_sobel_xy_test.png');

        src.delete();
        sobelX.delete();
        sobelY.delete();
        sobelXY.delete();

        sobelXAbs.delete();
        sobelYAbs.delete();
        sobelXYAbs.delete();
        blurredImage.delete();
    });

    const lineNoiseThreshold = [
        [20, 200],
        [100, 200],
        [50, 200],
        [100, 50],
        [200, 50],
    ];
    test.each(lineNoiseThreshold)('should load opencv package and apply guassian blur and apply canny edge detetion', async (lineThreshold, noiseThreshold) => {
        const img = (await Jimp.read('./test/unit/data/dog_running_0.png')).grayscale();
        const src = cv.matFromImageData(img.bitmap);
        const blurredImage = new cv.Mat();
        cv.GaussianBlur(src, blurredImage, new cv.Size(5, 5), 0, 0);
        cv.cvtColor(blurredImage, blurredImage, cv.COLOR_RGBA2GRAY);

        const cannyEdges = new cv.Mat();

        cv.Canny(blurredImage, cannyEdges, lineThreshold, noiseThreshold, 3, false);

        expect(cannyEdges.rows).toEqual(blurredImage.rows);
        expect(cannyEdges.cols).toEqual(blurredImage.cols);

        const cannyEdgesBitmap = new cv.Mat();
        cv.cvtColor(cannyEdges, cannyEdgesBitmap, cv.COLOR_GRAY2RGBA);

        await new Jimp({ width: cannyEdgesBitmap.cols, height: cannyEdgesBitmap.rows, data: Buffer.from(cannyEdgesBitmap.data) }).writeAsync(`./test/unit/data/dog_running_0_blurred_canny_l_${lineThreshold}_n_${noiseThreshold}_test.png`);

        src.delete();
        blurredImage.delete();
        cannyEdges.delete();
        cannyEdgesBitmap.delete();
    });
});
