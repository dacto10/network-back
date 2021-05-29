import express from 'express';
import RouterController from '../controllers/RouterController';

export const routerRouter = express.Router({
    strict: true
});

routerRouter.post('/', async (req, res) => {
    try {
        await RouterController.loadData();
        res.status(200).send('Routers loaded');
    } catch(e) {
        res.status(500).send(e)
    }
});

routerRouter.post('/create', async (req, res) => {
    try {
        await RouterController.createRouter(req.body.router);
        res.status(200).send('Router created');
    } catch(e) {
        res.status(500).send(e);
    }
});

routerRouter.post('/', async (req, res) => {
    try {
        await RouterController.deleteRouter(req.body.mac);
        res.status(200).send('Router deleted');
    } catch(e) {
        res.status(500).send(e);
    }
});

routerRouter.get('/', async (req, res) => {
    try {
        const response = await RouterController.getRouters();
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

routerRouter.delete('/:mac', async (req, res) => {
    try {
        await RouterController.deleteRouter(req.params.mac);
        res.status(200).send('Router deleted');
    } catch(e) {
        res.status(500).send(e);
        console.log(e);
    }
});