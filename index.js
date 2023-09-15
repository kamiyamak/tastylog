import express from 'express';

const app = express();
app.get('/hello', (req, res) => {
	res.json({ msg: 'hello' });
});
app.listen(3000);