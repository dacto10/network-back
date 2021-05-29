import App from './server/app';

const server = new App().getInstance().listen(3000, () => {
    console.log(`Running at port ${3000}`);
});