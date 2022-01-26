import bodyParser from 'body-parser';
/**
 * uncomment if wanting to be pure
 * 
 * // import http from 'http';// const hostname = '127.0.0.1';
 * // const port = 3000;
 * // const server = http.createServer((req:any, res:any) => {
 * //   res.statusCode = 200;
 * //   res.setHeader('Content-Type', 'text/plain');
 * //   res.end('Hello World\n');
 * // });
 * 
 * //listen for request on port 3000, and as a callback function have the port listened on logged
 * // server.listen(port, hostname, () => {
 * //   console.log(`Server is listening on http://${hostname}:${port}/`);
 * // });
 */



import app from './app/app'

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`server is listening on ${port}`));