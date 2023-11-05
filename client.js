const net = require('net');
const dns = require('dns');

const port = process.argv[3];
let host = process.argv[2];
const name = process.argv[4] || "John";
let client;

if (!host || !port) {
  console.log('Please enter hostname and port: example localhost 5000');
  process.exit(1);
}

dns.lookup(host, 4, (err, address, fam) => {
  if (err?.code === 'EAI_AGAIN' || err) {
    console.log(`Noto'g'ri manzil kiritildi!`);
    process.exit(1);
  }

  host = address
});

client = net.createConnection({port, host}, () => {
  console.log('client listen');
});

client.on('error', (err) => {
  if (err.message.includes('ECONNREFUSED')) {
    process.stdout.write(`The server on port ${port} is down`);
    process.exit(1);
  }
});

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', function() { 
  console.log('disconnected from server');
  client.end();
  process.exit();
});

process.stdin.on('data', (data) => {
  client.write(`Client name: ${name} ${data.toString()}`);
});

process.stdout.once('resize', () => {
  console.log('asd');
})