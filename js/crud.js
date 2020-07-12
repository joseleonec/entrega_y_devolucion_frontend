const url = 'http://192.168.1.100:9099//api/persona';

function addPersona(persona) {
    const registrosRutas = document.getElementById('tabla-personas');
    const element = document.createElement('tr');
    var table = $('#tabla').DataTable();
    const span = document.createElement('span');
    span.className = 'table-remove';
    span.innerHTML = `
        <span class="table-remove">
            <button name="delete" type="submit"
                class="btn btn-danger btn-rounded btn-sm my-0">
                Eliminar
            </button>
            <button name="edit" type="submit"
            class="btn btn-warning btn-rounded btn-sm my-0">
                Editar
            </button>
        </span>
            `;
    table.row.add([persona.id, persona.nombre, persona.cedula, span]).draw();
}

function vaciarTabla() {
    tablaPersonas.row(this).remove().draw();
}

function llenarTabla() {
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        data.forEach(i => {
            addPersona(i);
            // console.log(i.nombre);
        });
    }).catch(function() {
        console.log("Error al Llenar la tabla");
    });
}

function mostrarMensaje(mensaje, cssClass) {
    const div = document.createElement('div');
    div.className = `alert alert-${cssClass} mt-2`;
    div.appendChild(document.createTextNode(mensaje));
    const container = document.querySelector('.container-fluid');
    const grupobotones = document.querySelector('#grupobotones');
    container.appendChild(div);
    setTimeout(function() {
        div.remove();
    }, 100);
}

function postPersona(data) {
    fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}

function putPersona(data) {
    fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    document.getElementById("labelid").readOnly = false;
}

function deletePersona(id) {
    fetch(url + '/' + id, {
        method: "DELETE"
    });
}
// CAPTURA DE EVENTOS
$(document).ready(function() {

    var tablaPersonas = $('#tabla').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": `
                <button name='delete' class="btn btn-danger btn-rounded btn-sm my-0" >
                    Eliminar
                </button>
                <button name="edit" type="submit"
                    class="btn btn-warning btn-rounded btn-sm my-0" data-toggle="modal" data-target="#exampleModal">
                    Editar
                </button>`
        }]
    });
    // LLENAR TABLA
    llenarTabla();
    // GET

    // PUT

    // POST
    $("#btn-guardar-persona").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value;
        const nombre = document.getElementById("labelnombre").value;
        const cedula = document.getElementById("labelcedula").value;
        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || nombre === '' || cedula === '') {
            mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            const data = {
                "id": id,
                "nombre": nombre,
                "cedula": cedula
            }
            if (document.getElementById("labelid").readOnly) {
                putPersona(data);
                tablaPersonas.clear().draw();
                llenarTabla();
            } else {
                postPersona(data);
                addPersona(data);
            }

            $('#exampleModal').modal('hide');
            mostrarMensaje('Persona regisrada con exito', 'success');
        }
    });
    $('#exampleModal').on('hidden.bs.modal', function() {
        $(this).find('form')[0].reset();
    });
    // DELETE
    tablaPersonas.on('click', 'tbody tr', function(e) {
        const botonname = e.target.name;
        const datos = e.target.parentElement.parentElement.getElementsByTagName('td');
        const idPersona = datos[0].innerText;
        // console.log(idPersona);
        if (botonname === 'delete') {
            deletePersona(idPersona);
            console.log(this);
            tablaPersonas.row(this).remove().draw();
            mostrarMensaje('Ruta eliminada ', 'info');
        } else if (botonname === 'edit') {
            // console.log(datos[1]);
            document.getElementById("labelid").value = datos[0].innerText;
            document.getElementById("labelid").readOnly = true;
            document.getElementById("labelnombre").value = datos[1].innerText;
            document.getElementById("labelcedula").value = datos[2].innerText;
        }

    });
});