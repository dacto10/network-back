import express from 'express';
import NetworkController from '../controllers/NetworkController';

export const networkRouter = express.Router({
    strict: true
});

networkRouter.post('/', async (req, res) => {
    try {
        await NetworkController.loadData();
        res.status(200).send('Networks loaded');
    } catch(e) {
        res.status(500).send(e)
    }
});

networkRouter.post('/connect', async (req, res) => {
    try {
        await NetworkController.connectRouters();
        await NetworkController.connectServers();
        await NetworkController.connectTerminals();
        res.status(200).send('Connections done');
    } catch(e) {
        res.status(500).send(e);
    }
});

networkRouter.post('/create', async (req, res) => {
    try {
        await NetworkController.createNetwork(req.body.network);
        res.status(200).send('Network created');
    } catch(e) {
        res.status(500).send(e);
    }
});

networkRouter.delete('/:ip', async (req, res) => {
    try {
        await NetworkController.deleteNetwork(req.params.ip);
        res.status(200).send('Network deleted');
    } catch(e) {
        res.status(500).send(e);
        console.log(e);
    }
});

networkRouter.get('/', async (req, res) => {
    try {
        const response = await NetworkController.getNetworks();
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

networkRouter.delete('/clear/', async (req, res) => {
    try {
        await NetworkController.clear();
        res.status(200).send('Network cleared');
    } catch(e) {
        res.status(500).send(e);
    }
});

networkRouter.get('/nodes', async (req, res) => {
    try {
        const response = await NetworkController.getAllNodes();
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

networkRouter.get('/edges', async (req, res) => {
    try {
        const response = await NetworkController.getAllEdges();
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});