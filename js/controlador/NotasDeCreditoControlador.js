const url = 'https://springtest999.herokuapp.com/api/notadecredito/';

function addRow(datatable, nota) {
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
    datatable.row.add([nota.idNotaDeCredito, nota.solicitudDevolucion.idSolicitud, nota.monto, nota.autorizacionSRI, span]).draw();
}

function llenarTabla(datatable) {
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        data.forEach(i => {
            addRow(datatable, i);
        });
    }).catch(function() {
        console.log("Error al Llenar la tabla");
    });
}


$(document).ready(function() {

    var datatable = $('#tablaNota').DataTable({
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
    llenarTabla(datatable);
    // POST
    $("#btn-guardar-nota-de-credito").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value.toUpperCase();
        const idSolicitud = document.getElementById("labelidSolicitud").value.toUpperCase();
        const monto = document.getElementById("labelmonto").value.toUpperCase();
        const autorizacionSRI = document.getElementById("labelautorizacionSRI").value.toUpperCase();

        var solicitudDevolucion;
        fetch('https://springtest999.herokuapp.com/api/solicituddevolucion/' + idSolicitud).then(function(response) {
            return response.json();
        }).then(function(data) {
            solicitudDevolucion = data;
        }).catch(function() {
            console.log("Error al recuperar registro compuesto");
        });

        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || idSolicitud === '' || autorizacionSRI === '' || monto === '' || solicitudDevolucion == null) {

            mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            const data = {
                "idEntregaDomicilio": id,
                "solicitudDevolucion": solicitudDevolucion,
                "monto": monto,
                "autorizacionSRI": autorizacionSRI
            };
            if (document.getElementById("labelid").readOnly) {

                PUT(url, data);
                vaciarTabla(datatable);
                llenarTabla(datatable);

            } else {

                POST(url, data);
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

            DELETE(url, ID);
            console.log(this);
            datatable.row(this).remove().draw();
            mostrarMensaje('Elemento eliminado ', 'info');

        } else if (botonname === 'edit') {

            document.getElementById("labelid").readOnly = true;
            document.getElementById("labelid").value = columns[0].innerText;

            document.getElementById("labelidSolicitud").value = columns[1].innerText;
            document.getElementById("labelmonto").value = columns[2].innerText;
            document.getElementById("labelautorizacionSRI").value = columns[3].innerText;


        }
    });
});