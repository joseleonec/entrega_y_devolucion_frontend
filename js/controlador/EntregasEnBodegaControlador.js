const url = 'https://springtest999.herokuapp.com/api/entregaenbodega';

function addRow(datatable, entregaEnBodega) {
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
    datatable.row.add([entregaEnBodega.idEntregaBodega, entregaEnBodega.idUbicacion, entregaEnBodega.idDespachador,
        entregaEnBodega.idFactura, entregaEnBodega.prioridad,
        entregaEnBodega.estado, entregaEnBodega.pesoKg, span
    ]).draw();
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

    var datatable = $('#tablaEntregaEnBodega').DataTable({
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
    $("#btn-guardar-entrega-en-bodega").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value.toUpperCase();
        const idUbicacion = document.getElementById("labelidUbicacion").value.toUpperCase();
        const idDespachador = document.getElementById("labelidDespachador").value.toUpperCase();
        const idFactura = document.getElementById("labelidFactura").value.toUpperCase();
        const prioridad = document.getElementById("labelprioridad").value.toUpperCase();
        const estado = document.getElementById("labelestado").value.toUpperCase();
        const pesoKg = document.getElementById("labelpesoKg").value.toUpperCase();
        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || idUbicacion === '' || idFactura === '' || idDespachador === '' || pesoKg === '') {
            mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            const data = {
                "idEntregaBodega": id,
                "idUbicacion": idUbicacion,
                "idDespachador": idDespachador,
                "idFactura": idFactura,
                "prioridad": prioridad,
                "estado": estado,
                "pesoKg": pesoKg
            }

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
            // console.log(datos[1]);

            document.getElementById("labelid").readOnly = true;
            document.getElementById("labelid").value = columns[0].innerText;

            document.getElementById("labelidUbicacion").value = columns[1].innerText;
            document.getElementById("labelidDespachador").value = columns[2].innerText;
            document.getElementById("labelidFactura").value = columns[3].innerText;

            document.getElementById("labelprioridad").value = columns[4].innerText;
            document.getElementById("labelestado").value = columns[5].innerText;
            document.getElementById("labelpesoKg").value = columns[6].innerText;

        }
    });
});