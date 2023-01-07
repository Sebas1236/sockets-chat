const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        
        if( !data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario',
            });
        }

        //* Conectar un usuario a una sala
        client.join(data.sala);

        usuarios.agregarPersona( client.id, data.nombre, data.sala );

        //Cuando una persona entra al chat
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala) );

        callback( usuarios.getPersonasPorSala( data.sala ) );

    });

    client.on('crearMensaje', (data)=>{

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', 
            crearMensaje('Administrador', `${personaBorrada.nombre} salió del chat`)
        );
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala) );

    });

    //Mensajes privados. Data debe contener id del usuario al que se mandará
    client.on('mensajePrivado', data => {
        //La persona que manda el mensaje
        let persona = usuarios.getPersona( client.id );
        //Un usuario en particular
        client.broadcast.to(data.para).emit( 'mensajePrivado', crearMensaje( persona.nombre, data.mensaje ) );

    });

});