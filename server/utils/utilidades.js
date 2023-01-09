const crearMensaje = ( nombre, mensaje, img = '0') => {
    
    return {
        nombre, 
        mensaje,
        img,
        fecha: new Date().getTime(),
    };

};

module.exports = {
    crearMensaje,
};