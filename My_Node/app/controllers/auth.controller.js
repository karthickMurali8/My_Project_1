const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.roles;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone,
        isMarried: req.body.isMarried
      });
  
      if (req.body.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        });
  
        // const result = user.setRoles(roles);
        const result = user.setRoles_tables(roles);
        if (result) res.send({ message: "User registered successfully!" });
      } else {
        // user has role = 1
        const result = user.setRoles_tables([1]);
        if (result) res.send({ message: "User registered successfully!" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id },
                           config.secret,
                           {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 3600, // 1 hour
                           });

    let authorities = [];
    const roles = await user.getRoles_tables();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    return res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};