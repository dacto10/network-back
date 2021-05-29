import express, { Request, Response } from 'express';
import TerminalController from '../controllers/TerminalController';

export const terminalRouter = express.Router({
    strict: true
});

terminalRouter.post('/', async (req, res) => {
    try {
        await TerminalController.loadData();
    } catch (e) {
        res.status(500).send(e);
    }
    res.status(200).send('Terminals loaded');
});

terminalRouter.post('/message', async (req: Request, res: Response) => {
    try {
        const response = await TerminalController.sendMessage(req.body.origin, req.body.destination, req.body.message);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

terminalRouter.post('/web', async (req: Request, res: Response) => {
    try {
        const response = await TerminalController.visitWebPage(req.body.origin, req.body.url);
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

terminalRouter.put('/arp', async (req: Request, res: Response) => {
    try {
        const response = await TerminalController.getArpCache(req.body.origin);
        res.status(200).send(response);
    } catch(e) {
        res.status(500).send(e);
    }
});

terminalRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const response = await TerminalController.createTerminal(req.body.terminal, req.body.network);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
});

terminalRouter.delete('/:mac', async (req: Request, res: Response) => {
    try {
        await TerminalController.deleteTerminal(req.params.mac);
        res.status(200).send('Terminal deleted');
    } catch (e) {
        res.status(500).send(e);
    }
});

terminalRouter.get('/', async (req: Request, res: Response) => {
    try {
        const response = await TerminalController.getTerminals();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

terminalRouter.get('/message/:ip', async (req: Request, res: Response) => {
    try {
        const response = await TerminalController.listMessages(req.params.ip);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

terminalRouter.delete('/messages/:origin/:subject/:body', async (req: Request, res: Response) => {
    try {
        await TerminalController.deleteMessage(req.params.origin, req.params.subject, req.params.body);
        res.status(200).send("Message deleted");
    } catch (e) {
        res.status(500).send(e);
    }
});