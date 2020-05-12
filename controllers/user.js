import user from '../models/user';
import bcrypt  from 'bcrypt';
import jwt     from 'jsonwebtoken';
//import path    from 'path';
const salt = 10;

process.env.SECRET_KEY = 'secret';

var controller = {

    registerUser: async(req, res) => {
        
        const body = {
            nombre:   req.body.nombre,
            telefono: req.body.apellido,
            email:    req.body.email,
            trabajo: [{
                archivo: '',
                nombre: '',
                descripcion: '',
                materia: '',
                dia: '',
                mes: '',
                year: '1',
                pago: ''           
            }]
        };

        body.password = bcrypt.hashSync(req.body.password, salt);

        const emailExist = await user.findOne({ email: body.email });
        
        if(!emailExist){
            try{

                const userDB = await user.create(body);
                
                res.status(200).send(userDB);

            }catch(error){
                return res.status(500).json({
                    mensaje: 'Error del servidor',
                    error
                });
            }
        }
        
        return res.status(404).json({
            mensaje: 'El email ya está registrado'
        });
    
    
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
    
                    return res.status(200).json(token);
    
                }
                
                return res.status(404).json({error: 'Passowrd incorrecta'});
            
            }
            
            return res.status(404).json({error: 'El usario no está registrado Rey'});

        }catch(error){
            return res.status(500).json({
                mensaje: 'Error rey',
                error
            });
        }
    },

    getUsers: async(req, res) => {
        try{
            const usersDB = await user.find();
            
            if(usersDB){
                return res.status(200).send(usersDB);
            }

            return res.status(404).json({
                mesagge: 'No hay usuarios registrados'
            });

        }catch(error){
            return res.status(500).json({
                mesagge: 'Error del servidor'
            });
        }
    },

    getWorks: async(req, res) => {
        try{
            var works = [];

            const worksDB = await user.find();

            worksDB.forEach(usuario => {
                works.push(usuario.trabajo);
            })

            if(worksDB){
                res.status(200).json({
                    trabajos: works
                });
            }

            return res.status(400).json({
                mesagge: 'Trabajos no encontrados'
            })

        }catch(error){
            res.status(500).json({
                mesagge: 'Error del servidor'
            })
        }
    },

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

                    const lengthWork = saveWorkDB.trabajo.length;

                    res.status(200).json(saveWorkDB.trabajo[lengthWork-1]);
                    
                }

                return res.status(400).json({
                    mesagge: 'No se puedo registrar el trabajo'
                });

            }catch(error){
                return res.status(500).json({
                    mesagge: 'Error del servidor',
                });
            }
        }

    },

    uploadFile: async(req, res) => {

        var id   = req.params.id;
        var workId   = req.params.work;

        if(req.files){
            var filePath  = req.files.archivo.path;
            
            console.log(filePath);

            var fileSplit = filePath.split('/.*[\/|\\]/');

            console.log(fileSplit);

            var fileName  = fileSplit[1];
           
            console.log(fileName);

            var fileSize  = req.files.archivo.size;

            var userDB = await user.findOne({_id: id});
            
            if(fileSize > 0){

                try{
                    if(userDB){
                        
                        if(fileName){
                            const findWork = await userDB.trabajo.id(workId);
                        
                            const addFile =  await findWork.set({
                                archivo: fileName
                            });
                    
                            if(addFile){
                                
                                const saveWorkUser = await userDB.save();
                            
                                if(saveWorkUser){
                                    return res.status(200).json(findWork);
                                }
        
                            }
                            
                            return res.status(400).json({mensaje:'No se puedo agregar el archivo'});
                        }
    
                    }
                    
                    return res.status(400).json({mensaje:'Usuario no registrado'});
                    
                }catch(error){
                    return res.status(500).send({
                        message: 'Error '
                    });
                }
            }
            
            return res.status(200).json({
                message: 'No selecciono el archivo'
            });
            
        }

    }

}

export default controller;