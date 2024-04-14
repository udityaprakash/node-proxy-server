const http = require('http');
const httpProxy = require('http-proxy');

//here we define backend servers
const servers = [
    { host: 'localhost', port:3000, load: 0 },
    { host: 'localhost', port: 10000, load: 0 },
    { host: 'localhost', port: 4000, load: 0 }
];

const proxy = httpProxy.createProxyServer();


function findLeastBusyServer() {
    let leastBusyServer = servers[0];
    for (let i = 1; i < servers.length; i++) {
        if (servers[i].load < leastBusyServer.load) {
            leastBusyServer = servers[i];
        }
    }
    console.log(leastBusyServer);
    return leastBusyServer;
}

const server = http.createServer((req, res) => {
   
    const leastBusyServer = findLeastBusyServer();
    leastBusyServer.load++;

    proxy.web(req, res, { target: `http://${leastBusyServer.host}:${leastBusyServer.port}` });

   
    res.on('finish', () => {
        leastBusyServer.load--;
    });
});


proxy.on('error', (err, req, res) => {
    console.error(err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Proxy server error');
});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
