import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/ai/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'test',
        type: 'test',
        coverImage: 'data:image/jpeg;base64,12345'
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
