module.exports = app => {
    const user = require('../controllers/user.controller');
    const router = require('express').Router();

    router.post('/', user.create);
    router.get('/', user.findAll);
    router.delete('/', user.deleteAll);
    router.get('/:id', user.findOne);
    router.put('/:id', user.update);
    router.delete('/:id', user.delete);
    router.get('/isMarried', user.findAllMarriedUsers);

    app.use('/api/users', router);
}