import user from '../models/user';
import bcrypt  from 'bcrypt';
import jwt     from 'jsonwebtoken';
const salt = 10;

process.env.SECRET_KEY = 'secret';

var controller = {
    registerUser: async(req, res) => {
        
        const body = {
            nombre:   req.body.nombre,
            telefono: req.body.apellido,
            email:    req.body.email,
            trabajo: []
        };

        body.password = bcrypt.hashSync(req.body.password, salt);

        const emailExist = await user.findOne({ email: body.email });
        
        if(!emailExist){
            try{

                const userDB = await user.create(body);
                
                res.status(200).json(userDB);

            }catch(error){
                return res.status(500).json({
                    mensaje: 'Error rey',
                    error
                });
            }
        }else{
            return res.status(400).json({
                mensaje: 'Rey el correo ya existe'
            });
        }
    
    },

    //Agregar trabajos
    newWork: async(req, res) => {
        const newTrabajo = {
            archivo:     '',
            nombre:      req.body.nombre,
            descripcion: req.body.descripcion,
            materia:     req.body.materia,
            dia:         req.body.dia,
            mes:         req.body.mes,
            year:        req.body.year,
            pago:        req.body.pago
        };

        const id = req.body.idUser;

        const userExist = await user.findById(id);

        if(userExist){
            try{

                const workUserDB = await userExist.trabajo.push({
                    archivo:     '',
                    nombre:      newTrabajo.nombre,
                    descripcion: newTrabajo.descripcion,
                    materia:     newTrabajo.materia,
                    dia:         newTrabajo.dia,
                    mes:         newTrabajo.mes,
                    year:        newTrabajo.year,
                    pago:        newTrabajo.pago
                });

                const saveWorkDB = await userExist.save();

                if(saveWorkDB){
                    return res.status(200).json(userExist.trabajo);
                }

                return res.status(401).json({
                    mesagge: 'No se puedo registrar el trabajo'
                });

            }catch(error){
                return res.json({
                    mesagge: 'pailas mor',
                });
            }
        }

    },

    loginUser: async(req, res) => {
        const email    = req.body.email;
        const password = req.body.password;

        const userExist = await user.findOne({ email: email });
 
        try{
            if(userExist){
                if(bcrypt.compareSync(password, userExist.password)){
    
                    const dataReturn = {
                        _id:      userExist._id,
                        nombre:   userExist.nombre,
                        apellido: userExist.apellido,
                        email:    userExist.email,
                        trabajo:  userExist.trabajo
                    };
    
                    let token = jwt.sign(dataReturn, process.env.SECRET_KEY,{expiresIn:  60 * 60 * 24 *30});
    
                    return res.send(token);
    
                }else{
                    return res.json({error: 'Passowrd incorrecta Mor'});
                }
            }else{
                return res.json({error: 'El usario no está registrado Rey'});
            }
        }catch(error){
            return res.status(500).json({
                mensaje: 'Error rey',
                error
            });
        }
    },

    //Información del usuario
    //Mirar nuevamente cómo funciona, donde lo utiloz y para qué!!!!!
    profileUser: async(req, res) => {
        var decode = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

        try{
            var userExist = await user.findOne({_id: decode._id})

            if(userExist){
                res.json(userExist);
            }else{
                res.send('Rey no existes...');
            }
        }catch(error){
            return res.status(500).json({
                mensaje: 'Error rey',
                error
            });
        }
    },

    //Subir archivos
    uploadFile: async(req, res) => {
        var userId   = req.params.id;
        var workId   = req.params.work;

        if(req.files){
            var filePath  = req.files.archivo.path;
            
            var fileSplit = filePath.split('\\');

            var fileName  = fileSplit[1];
           
            var userDB = await user.findById({ _id: userId });

           
            try{
                if(userDB){
                    
                    const findWork = await userDB.trabajo.id(workId);
                    
                    findWork.set({
                        archivo: fileName
                    });
                    
                    userDB.save();

                    return res.status(200).json(userDB);

                }else{
                    return res.status(200).json({mensaje:'no hay nada'});
                }
            }catch(error){
                return res.status(404).send({
                    message: 'pailas mor'
                });
            }

        }else{
            return res.status(500).send({
                message: 'Unlucky rey'
            });
        }
    },

    getUsers: async(req, res) => {
        try{
            const usersDB = await user.find();
            
            if(usersDB){
                return res.status(200).send(usersDB);
            }

            return res.status(400).json({
                mesagge: 'No hay usuarios registrados'
            });

        }catch(error){
            return res.status(500).json({
                mesagge: 'Error en la petición'
            });
        }
    }
}

export default controller;