const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = process.argv[2] || 5000;

const server = net.createServer();

class Server {
  port = port;
  #clients = [];
  server = server;
  #blockList = new net.BlockList();

  constructor() {
    this.connection();
    this.listen(this.port);
  }

  connection() {
    this.server.on('connection', (socket) => {
      this.blockIpAddress();
      this.clientInfo(socket);
      this.checkClientIpAddress(socket);
      this.#clients.push(socket);
      this.chat(socket);
      this.error(socket);
      this.closeClient(socket);
    });
  };

  clientInfo(socket) {
    console.log(`Client connected ${socket.remoteAddress}:${socket.remotePort}`);
  }

  blockIpAddress() {
    const host = '127.0.0.5';
    const host1 = '127.0.0.6';
    
    this.#blockList.addAddress(host);
    this.#blockList.addAddress(host1);
  }

  checkClientIpAddress(socket) {
    const checkHost = this.#blockList.check(socket.remoteAddress);

    if (checkHost) {
      this.socket.write(`Bu hostda ${socket.remoteAddress} sizga ruxsat yuq `);
      process.exit(1);
    }
  };

  chat(socket) {
    socket.on('data', (data) => {
      this.sendMessageForConnected(socket, data.toString());
    });
  };

  sendMessageForConnected(socket, message) {
    this.#clients.forEach((client) => {
      client.write(message);
    })
  }

  closeClient(socket) {
    socket.once('close', () => {
      console.log('client closed');
    });
  };

  error(socket) {
    socket.on('error', (err) => {
      console.log(err.message);
      socket.closed();
      process.exit();
    });
  };

  listen(port) {
    this.server.listen(port, '127.0.0.1', () => {
      console.log(`socket server listen on ${port}`);
    });
  }
};

new Server();