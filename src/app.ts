import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { ImagePreprocessingServiceConfig } from './config';
import { ControllerFactory } from './controller/controllerFactory';
import { processError } from '../Chisel-Global-Common-Libraries//src/lib/error';
import { HttpStatusCode } from 'axios';

const config = new ImagePreprocessingServiceConfig();

const servicePorts = config.servicePorts;

const privateKey = fs.readFileSync('./certs/key.pem');
const certificate = fs.readFileSync('./certs/cert.crt');

const credentials = { key: privateKey, cert: certificate };

process.title = config.shortName;

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

app.get('/healthCheck', (req, res) => {
    res.send('i am healthy!!!');
});

app.post('/process', async (req, res) => {
    try {
        const imagePreprocessor = ControllerFactory.makeImagePreprocessingServiceController(config);
        const processedImages = await imagePreprocessor.process(req);
        res.send(processedImages);
    } catch (e) {
        processError(e, res);
    }
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(servicePorts.https, () => {
    console.log(`https server is listening at port ${servicePorts.https}`);
});

httpServer.listen(servicePorts.http, () => {
    console.log(`http server is listening at port ${servicePorts.http}`);
});
