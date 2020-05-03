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
            
            return res.status(200).json(pqrDB);
        
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
                return res.status(200).json(pqrsDB);
            }
            
            return res.status(404).json({
                mensaje: 'No hay ninguna PQR'
            });

        }catch(error){
            return res.status(500).json({
                mensaje: 'Error al pedir las PQRs',
                error
            });
        }
    }
}

export default controller;