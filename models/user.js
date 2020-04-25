import mongose from 'mongoose';

const Schema = mongose.Schema;

//Creamos el Schema de la colección
const trabajoSchema = new Schema({
    nombre:      {type: String},
    descripcion: {type: String},
    archivo:     {type: String},
    materia:     {type: String},
    dia:         {type: String},
    mes:         {type: String},
    year:        {type: String, required: true},
    pago:        {type: String}
});

const userSchema = new Schema({
    nombre:   {type: String},
    telefono: {type: String},
    email:    {type: String, required: true},
    password: {type: String, required: true},
    trabajo:  [trabajoSchema],
    date:     {type: Date, default: Date.now}
});


//Eliminar la pass del objeto que returna de una respuesta al back-end
userSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

const user = mongose.model('user', userSchema);

export default user;