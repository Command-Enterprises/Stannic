import Corrosion from "corrosion";
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const corrosion = new Corrosion({
    codec: 'xor',
    prefix: '/~/corrosion/',
    title: 'Stannic'
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    if (req.url.startsWith(corrosion.prefix)) return corrosion.upgrade(req, conn, head);
    conn.end();
});

server.on('request', (req, res) => {
    if (req.url.startsWith(corrosion.prefix)) return corrosion.request(req, res);
    app(req, res);
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`App listening on https://localhost:${PORT}`);
});