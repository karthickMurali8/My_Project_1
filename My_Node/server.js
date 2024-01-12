const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 8200;
const db = require('./app/models');
const { QueryTypes } = require('sequelize');

var corsOptions = {
    origin: 'http://localhost:4200'
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
   const result = await db.sequelize.query("select * from projectdb.users_table", { type :  QueryTypes.SELECT } );
   res.json({ message: result});
});

require('./app/routes/user.routes')(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

db.sequelize.sync()
.then(() => {
    console.log('DB has been synced.');
}).catch((err) => {
    console.log('DB Sync Error ! ERR : ' + err);
});

