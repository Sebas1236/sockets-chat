

class Usuarios {
    constructor() {
        this.personas = [];
    };

    agregarPersona(id, nombre){
        let persona = { id, nombre, };

        this.personas.push(persona);
        //Sujeto a cambiar
        return this.personas;
    };

    getPersona( id ){
        let persona = this.personas.filter( persona => persona.id === id)[0];
        //Retorna undefined si no encontró la persona
        return persona;
    };

    getPersonas(){
        return this.personas;
    };

    getPersonasPorSala( sala ){
        //* ...
    };

    borrarPersona( id ) {
        let personaBorrada = this.getPersona(id);
        
        this.personas = this.personas.filter( persona => persona.id != id );
    
        return personaBorrada;

    };
}

module.exports = {
    Usuarios,
}