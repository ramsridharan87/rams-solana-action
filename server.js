const express = require('express');
const cors = require('cors');
const { handleGet, handlePost } = require('./action');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/action', handleGet);
app.post('/action', handlePost);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
