import * as http from 'http';
import { fetchHandler } from './fetchHandler';

const server = http.createServer((req, res) => {
    const { url, method } = req;

    if (url === '/api/files' && method === 'GET') {
        try {
            fetchHandler(res); 
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    } else {
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000');
});
