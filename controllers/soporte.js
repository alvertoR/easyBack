import soporte from '../models/soporte';

var controller = {
    addPqr: async(req, res) => {
        const body = {
            nombre:      req.body.nombre,
            email:       req.body.email,
            descripcion: req.body.descripcion
        }

        try{
            const pqrDB = await soporte.create(body);
            
            res.status(200).json(pqrDB);
        }catch(error){
            return res.status(500).json({
                mensaje: 'Error al hacer el PQR',
                error
            });
        }
    },
    getPqrs: async(req, res) => {
        try{
            const pqrsDB = await soporte.find();

            if(pqrsDB != ''){
                res.status(200).json(pqrsDB);
            }else{
                res.status(400).json({
                    mensaje: 'No hay ni monda Rey'
                });
            }

        }catch(error){
            return res.status(500).json({
                mensaje: 'Error al pedir las PQRs',
                error
            });
        }
    }
}

export default controller;