import express            from 'express';
import controllersUser from '../controllers/user';

var router = express.Router();

//Middelware para subir archivos
var multipar            = require('connect-multiparty');
var multipartMiddleware = multipar({ uploadDir: './uploads' });

router.post('/register', controllersUser.registerUser);
router.post('/login', controllersUser.loginUser);
router.post('/upload-file/:id/:work', multipartMiddleware, controllersUser.uploadFile);
router.post('/new-work', controllersUser.newWork);
router.get('/get-users', controllersUser.getUsers);
router.get('/get-works', controllersUser.getWorks);
router.get('/get-file/:file', controllersUser.getFile);
router.get('/get-work/:id/:work', controllersUser.getWork);

module.exports = router;