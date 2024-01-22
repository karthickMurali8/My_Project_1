// import { authJwt } from require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = app => {
    const user = require('../controllers/user.controller');
    const router = require('express').Router();

    router.post('/', user.create);
    router.get('/', user.findAll);
    router.delete('/', user.deleteAll);
    router.get('/:id', user.findOne);
    router.put('/:id', user.update);
    router.delete('/:id', user.delete);
    router.get('/isMarried/:isMarried', user.findByMaritalStatus);

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get(
        "/api/test/user",
        [authJwt.verifyToken],
        controller.userBoard
    );

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

    app.use('/api/users', router);
}