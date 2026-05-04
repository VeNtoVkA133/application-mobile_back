import { createRequire } from "module";
const require = createRequire(import.meta.url);

require('dotenv').config();

const express = require("express");
const pool = require('./data/db.cjs');
import { dataApiPattern } from "./src/api/_dataApiPattern.js";
import { dataApiTodo } from "./src/api/_dataApiTodo.js";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

dataApiPattern(app);

dataApiTodo(app);

app.listen(PORT, () => {
	console.log(`Server starting on port ${PORT}`);
});

// app.get('/api', (req, res) => {
// 	res.json({
// 		message: 'Hello from backend server'
// 	})
// });
app.get('/api', async (req, res) => {
	try {
    	const result = await pool.query('SELECT * FROM profile');
    	res.json(result.rows); // Данные для фронтенда [3]
	} catch (err) {
    	res.status(500).send(err.message);
	}
});