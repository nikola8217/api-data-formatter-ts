import * as http from 'http';
import axios from 'axios';
import { transformHandler } from './transformHandler';
import { FormattedData, FileData } from './interfaces';

// Declaring variables for caching data and tracking last fetch time
let cache: FormattedData | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 120 * 1000; // Cache duration (2 minutes)

// Asynchronous function to fetch data from the API
const fetchData = async (): Promise<FileData[]> => {
    const response = await axios.get('https://rest-test-eight.vercel.app/api/test');
    return response.data.items;
};

// Main function to handle HTTP requests
export const fetchHandler = async (res: http.ServerResponse) => {
    const now = Date.now();

    // Check if cache exists or has expired
    if (!cache || now - lastFetchTime > CACHE_DURATION) {
        try {
            const data = await fetchData();
            const formattedData = transformHandler(data);
            cache = formattedData;
            lastFetchTime = now;

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(cache, null, 2));
        } catch (error) {
            console.error('Error transforming data:', error);
            res.writeHead(500, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    } else {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(cache, null, 2));
    }
}