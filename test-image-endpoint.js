const http = require('http');

async function testImageEndpoint() {
  const filename = '1782983049369-lb.jpg';
  const url = `http://localhost:3000/api/uploads/${filename}`;

  console.log(`🧪 Testing image retrieval: ${url}\n`);

  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log(`Content-Length: ${res.headers['content-length']}`);
      
      res.on('data', chunk => {
        data += chunk.length;
      });

      res.on('end', () => {
        console.log(`\nData received: ${data} bytes`);
        
        if (res.statusCode === 200) {
          console.log('✅ Image served successfully from endpoint!');
        } else {
          console.log(`⚠️  Endpoint returned status ${res.statusCode}`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.error('❌ Error connecting to endpoint:', err.message);
      resolve();
    });
  });
}

testImageEndpoint();
