const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: '3741c49b-9f47-40a9-ab6d-db7e98d473c3' }, 'super-secret-production-key', { expiresIn: '1h' });

fetch('https://8111c.com/api/v1/payments/records', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
