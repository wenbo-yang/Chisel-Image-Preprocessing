import { httpsUrl } from '../utils';
import axios from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { COMPRESSION, SKELETONIZEREQUESTIMAGETYPE } from '../../../src/types/skeletonizeTypes';


const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

describe('skeletonize request', () => {
    describe('GET /healthCheck', () => {
        it('should respond with 200', async () => {
            const response = await axiosClient.get(httpsUrl + '/healthCheck');

            expect(response.status).toBe(200);
            expect(response.data).toBe('i am healthy!!!');
        });
    });

    describe('POST /skeletonize', () => {
        const skeletonizeUrl = httpsUrl + '/skeletonize';
        it('should respond with 200, after receiving an image', async () => {
            const sampleImageUrl = './test/integration/data/running_man.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data);

            const response = await axiosClient.post(skeletonizeUrl, {
                name: 'someImage',
                type: SKELETONIZEREQUESTIMAGETYPE.PNG,
                data: arrayBuffer,
                returnCompression: COMPRESSION.GZIP,
            });

            expect(response.status).toEqual(200);
            expect(response.data.compression).toEqual(COMPRESSION.GZIP);
            expect(response.data).toHaveProperty('grayScale');
            expect(response.data).toHaveProperty('transformedData');
        });
    });
});
