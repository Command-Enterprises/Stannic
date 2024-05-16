import Corrosion from "corrosion";
import express from "express";
import http from "http";
import path from "path";

const corrosion = new Corrosion({
    codec: 'xor',
    prefix: '/~/corrosion/',
    title: 'Stannic'
});

const app = express();

const routes = [
    { path: '/', file: 'index.html' },
    { path: '/settings', file: 'settings.html' },
    { path: '/tabs', file: 'tabs.html' }
];

routes.forEach((route) => {
    app.get(route.path, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', route.file));
    });
});

const server = http.createServer();

server.on('upgrade', (req, conn, head) => {
    corrosion.upgrade(req, conn, head);
});

server.on('request', (req, res) => {
    corrosion.request(req, res);
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`App listening on https://localhost:${PORT}`);
});