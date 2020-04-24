import mongose from 'mongoose';

const Schema = mongose.Schema;

const soporteSchema = new Schema({
    nombre:        {type: String},
    email:         {type: String, required: [true, 'Emai requerido']},
    descripcion:   {type: String},
    fechaPeticion: {type: Date, default: Date.now}
});

const soporte = mongose.model('Soporte', soporteSchema);

export default soporte;
