const db = require('../models');
const user = db.users;
const Op = db.Sequelize.Op; // op = operation ?

exports.create = (req, res) => {
    if (!req.body.email ||  !req.body.name || !req.body.password) {
        res.status(400).send({
            message: 'Invalid Payload'
        });
        return;
    }

    const userBody = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        address: req.body.address,
        phone: req.body.phone,
        isMarried: req.body.isMarried
    }

    user.create(userBody)
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send(
            {
                message: 'Unknown Error occured when creating user'
            }
        );
    });
}

exports.findAll = (req, res) => {
    var condition = req.query.name ? { name : { [Op.like] : `%${req.query.name}%` } } : null;

    user.findAll({ where : condition })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send(
            {
                message : 'Unknown Error occured when searching users'
            }
        );
    });
}

exports.findOne = (req, res) => {
    if (req.params.id) {
        user.findByPk(req.params.id) // pk = Primary Key
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send(
                    {
                        message : 'Unable to find user with ID : ' + req.query.id
                    }
                );
            }
        })
        .catch(err => {
            res.status(500).send({ message : 'Unknown error occured' })
        });
    } else {
        res.status(400).send(
            {
                message : 'Id is required'
            }
        );
    }
}

exports.update = (req, res) => {
    if (req.params.id && Object.keys(req.body)?.length) {
        user.update(req.body, { where: { id : Number(req.params.id) } })
        .then(data => {
            if (data[0] === 1) {
                res.status(200).send(getMessageObject('User was updated successfully !'));
            } else {
                res.status(500).send(getMessageObject(`Unable to update user with ID : ${req.params.id}`));
            }
        })
        .catch(err => {
            res.status(500).send(getMessageObject('Ah shit ! Here we go again.'));
        });
    } else {
        res.status(400).send(getMessageObject('Request Body (or) Id cannot be empty !'));
    }
}

exports.delete = (req, res) => {
    user.destroy({
      where: { id: req.params.id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "user was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete user with id=${id}. Maybe user was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete user with id=" + id
        });
      });
};

exports.deleteAll = (req, res) => {
    user.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} users were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
    });
};

exports.findByMaritalStatus = (req, res) => {
    user.findAll(
        { where: 
            { 
                isMarried: req.params.isMarried === 'true' || req.params.isMarried == 1 ? 1 : 0 
            } 
        }
    ).then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
    });
};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

function getMessageObject(str) {
    return {
        message : str
    }
}