var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var divSalaTitulo = $('#divTituloSala');
var searchInput = $('#searchInput');

//* Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    console.log(personas);

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li class="list-group-item">';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/' + [i] + '.jpg' + '" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
};

const renderizarSalaTitulo = () => {
    var html = '';
    html += '<h3 class="box-title">Sala de chat <small>'+params.get('sala')+'</small></h3>';
    divSalaTitulo.html(html);
}

function renderizarMensajes(mensaje, yo) {
    console.log(mensaje);
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ":" + fecha.getMinutes();
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/0.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {

        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/7.jpg" alt="user" />';
        }
        html += '    </div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }

    divChatbox.append(html);
};

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
};

//* Listeners
divUsuarios.on('click', 'a', function () {

    var id = $(this).data('id');

    if (id) {
        console.log(id);
        // window.location.replace(`http://localhost:3000/chat.html?nombre=Sebas&sala=Amigos&id=${id}`);
        // socket.emit('mensajePrivado', {
        //     nombre,
        //     mensaje: txtMensaje.val(),
        //     para: id,
        // }, function (mensaje) {
        //     txtMensaje.val('').focus();
        //     renderizarMensajes(mensaje, true);
        //     scrollBottom();
        // });
    }
});

searchInput.on('input', filterList);

function filterList(){
    const searchInput2 = document.querySelector('#searchInput');
    const filter = searchInput2.value.toLowerCase();
    const listItems = document.querySelectorAll('.list-group-item');
    listItems.forEach((item) => {
        let text = item.textContent;
        if(text.toLowerCase().includes(filter.toLowerCase())){
            item.style.display = '';
        }else{
            item.style.display = 'none';
        }
    })
}

formEnviar.on('submit', function (e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje.val(),
    }, function (mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});