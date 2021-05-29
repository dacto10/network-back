import express from 'express';
import cors from 'cors';
import { terminalRouter } from './routes/terminalRoutes';
import { routerRouter } from './routes/routerRoutes';
import { networkRouter } from './routes/networkRoutes';
import { serverRouter } from './routes/serverRoutes';

export default class App {
    private expressInstance;

    constructor() {
        this.expressInstance = express();
        this.setConfig();
        this.setRoutes();
    }

    setRoutes() {
        this.expressInstance.use('/terminal', terminalRouter);
        this.expressInstance.use('/router', routerRouter);
        this.expressInstance.use('/network', networkRouter);
        this.expressInstance.use('/server', serverRouter);
    }

    setConfig() {
        this.getInstance().use(express.json());
        this.getInstance().use(cors());
    }

    getInstance() {
        return this.expressInstance;
    }
}