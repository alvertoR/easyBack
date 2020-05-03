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

module.exports = router;