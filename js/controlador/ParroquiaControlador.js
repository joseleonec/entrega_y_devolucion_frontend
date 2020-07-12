const url = 'https://springtest999.herokuapp.com/api/parroquia';

function addRow(datatable, parroquia) {
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
    datatable.row.add([parroquia.idParroquia, parroquia.nombreParroquia, span]).draw();
}

// function vaciarTabla(datatable) {
//     datatable.clear().draw();
// }

function llenarTablaParroquias(datatable) {
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        data.forEach(i => {
            addRow(datatable, i);
            // console.log(i.nombre);
        });
    }).catch(function() {
        console.log("Error al Llenar la tabla");
    });
}

// function mostrarMensaje(mensaje, cssClass) {
//     const div = document.createElement('div');
//     div.className = `alert alert-${cssClass} mt-2`;
//     div.appendChild(document.createTextNode(mensaje));
//     const container = document.querySelector('.container-fluid');
//     container.appendChild(div);
//     setTimeout(function() {
//         div.remove();
//     }, 100);
// }

function POST(data) {
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

function PUT(data) {
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

function DELETE(id) {
    fetch(url + '/' + id, {
        method: "DELETE"
    });
}

$(document).ready(function() {

    var datatable = $('#tablaParroquia').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": `
                <button name="edit" type="submit"
                    class="btn btn-warning btn-rounded btn-sm my-0" data-toggle="modal" data-target="#exampleModal">
                    Editar
                </button>
                <button name='delete' class="btn btn-danger btn-rounded btn-sm my-0" >
                    Eliminar
                </button>`

        }]
    });
    // LLENAR TABLA
    llenarTablaParroquias(datatable);
    // POST
    $("#btn-guardar-parroquia").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value.toUpperCase();
        const nombreParroquia = document.getElementById("labelnombreParroquia").value.toUpperCase();
        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || nombreParroquia === '') {
            mostrarMensaje('Asegurese de llenar todos los campos', 'danger');
        } else {
            const data = {
                "idEmpresa": id,
                "nombreParroquia": nombreParroquia
            }
            if (document.getElementById("labelid").readOnly) {
                PUT(data);
                vaciarTabla(datatable);
                llenarTablaParroquias(datatable);
            } else {
                POST(data);
                vaciarTabla(datatable)
                llenarTablaParroquias(datatable);
                addRow(datatable, data);
            }
            $('#exampleModal').modal('hide');
            mostrarMensaje('Elemento regisrado con exito', 'success');
        }
    });
    $('#exampleModal').on('hidden.bs.modal', function() {
        $(this).find('form')[0].reset();
    });
    // DELETE
    datatable.on('click', 'tbody tr', function(e) {
        const botonname = e.target.name;
        const columns = e.target.parentElement.parentElement.getElementsByTagName('td');
        const ID = columns[0].innerText;
        if (botonname === 'delete') {
            DELETE(ID);
            console.log(this);
            datatable.row(this).remove().draw();
            mostrarMensaje('Elemento eliminado ', 'info');
        } else if (botonname === 'edit') {
            // console.log(datos[1]);
            document.getElementById("labelid").readOnly = true;
            document.getElementById("labelid").value = columns[0].innerText;
            document.getElementById("labelnombreParroquia").value = columns[1].innerText;
            // Eliminamos el registro que indica que la tabla esta vacia
        }
    });
});