import express    from 'express';
import controller from '../controllers/soporte';

var router = express.Router();

router.post('/newPqr', controller.addPqr);
router.get('/pqrs', controller.getPqrs);

module.exports = router;