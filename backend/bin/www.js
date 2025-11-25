#!/usr/bin/env node
import app from '../app.js';
import http from 'http';

const port = process.env.PORT || 10000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
