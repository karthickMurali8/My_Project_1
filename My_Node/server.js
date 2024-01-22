const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 8200;
const db = require('./app/models');
const Role = db.roles;
const { QueryTypes } = require('sequelize');
const cookieSession = require('cookie-session');

var corsOptions = {
    origin: ['http://localhost:4200'],
    credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: 'login-session-cookie',
        // keys: ['SECRET_KEY'],
        secret: 'SECRET_KEY',
        httpOnly: true
    })
);

app.get('/', async (req, res) => {
//    const result = await db.sequelize.query("select * from projectdb.users_table", { type :  QueryTypes.SELECT } );
//    res.json({ message: result});
});

require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

db.sequelize.sync()
.then(() => {
    console.log('DB has been synced.');
    createRolesIfEmpty();
}).catch((err) => {
    console.log('DB Sync Error ! ERR : ' + err);
});

async function createRolesIfEmpty() {
  const usersRoles = await db.sequelize.query('select * from projectdb.roles_table', { type : QueryTypes.SELECT } );
  if (!usersRoles.length) {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
  }
}

