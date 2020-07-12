const url = 'https://springtest999.herokuapp.com/api/entregadomicilio';

function addRow(datatable, entregaADomicilio) {
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
    datatable.row.add([entregaADomicilio.idEntregaDomicilio, entregaADomicilio.idUbicacion, entregaADomicilio.empresa.idEmpresa,
        entregaADomicilio.idFactura, entregaADomicilio.prioridad,
        entregaADomicilio.estado, entregaADomicilio.pesoKg, span
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

    var datatable = $('#tablaEntregADomicilio').DataTable({
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
    $("#btn-guardar-entrega-a-domicilio").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value.toUpperCase();
        const idUbicacion = document.getElementById("labelidUbicacion").value.toUpperCase();
        const idDespachador = document.getElementById("labelidDespachador").value.toUpperCase();
        const idFactura = document.getElementById("labelidFactura").value.toUpperCase();
        var prioridad = document.getElementById("labelprioridad").value.toUpperCase();
        const estado = document.getElementById("labelestado").value.toUpperCase();
        const pesoKg = document.getElementById("labelpesoKg").value.toUpperCase();
        if (prioridad === "ALTA") {
            prioridad = 3;
        } else if (prioridad === "MEDIA") {
            prioridad = 2;
        } else if (prioridad === "BAJA") {
            prioridad = 1;
        }

        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || idUbicacion === '' || idFactura === '' || idDespachador === '' || pesoKg === '') {
            mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            const data = {
                "idEntregaDomicilio": id,
                "idUbicacion": idUbicacion,
                "empresa": empresa,
                "idFactura": idFactura,
                "prioridad": prioridad,
                "estado": estado,
                "pesoKg": pesoKg
            }
            const x = {
                "idEntregaDomicilio": 1,
                "idUbicacion": 1,
                "empresa": {
                    "idEmpresa": 1,
                    "razonSocial": "SERVIENTREGA S.A.",
                    "costoKgExtra": 0.25,
                    "pesoMaximoDelPaquete": 300.0
                },
                "idFactura": 1,
                "prioridad": 3,
                "estado": "ENTREGADO",
                "pesoKg": 30.0
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