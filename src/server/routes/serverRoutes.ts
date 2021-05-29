import express from 'express';
import ServerController from '../controllers/ServerController';


export const serverRouter = express.Router({
    strict: true
});

serverRouter.post('/', async (req, res) => {
    try {
        await ServerController.loadData();
        res.status(200).send('Servers loaded');
    } catch(e) {
        res.status(500).send(e)
    }
});

serverRouter.post('/create', async (req, res) => {
    try {
        await ServerController.createServer(req.body.server);
        res.status(200).send('Server created');
    } catch(e) {
        res.status(500).send(e);
    }
});

serverRouter.delete('/:mac', async (req, res) => {
    try {
        await ServerController.deleteServer(req.params.mac);
        res.status(200).send('Server deleted');
    } catch(e) {
        res.status(500).send(e);
    }
});

serverRouter.get('/', async (req, res) => {
    try {
        const response = await ServerController.getServers();
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

serverRouter.get('/webs', async (req, res) => {
    try {
        const response = await ServerController.getWebs();
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

serverRouter.delete('/webs/delete/:url', async (req, res) => {
    try {
        await ServerController.deleteWeb(req.params.url);
        res.status(200).send('Web deleted');
    } catch(e) {
        res.status(500).send(e);
    }
});