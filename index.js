const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => console.log(`A CodeMyMobile rest API is running on port ${port}!..................`));