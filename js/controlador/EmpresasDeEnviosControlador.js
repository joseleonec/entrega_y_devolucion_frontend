const url = 'https://springtest999.herokuapp.com/api/empresa';

function addRow(datatable, empresa) {
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
    datatable.row.add([empresa.idEmpresa, empresa.razonSocial, empresa.costoKgExtra, empresa.pesoMaximoDelPaquete, span]).draw();
}

function llenarTablaEmpresas(datatable) {
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


$(document).ready(function() {

    var datatable = $('#tableEmpresas').DataTable({
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
    llenarTablaEmpresas(datatable);
    // POST
    $("#btn-guardar-empresa").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value.toUpperCase();
        const razonSocial = document.getElementById("labelRazonSocial").value.toUpperCase();
        const CostoKgExtra = document.getElementById("labelCostoKgExtra").value.toUpperCase();
        const PesoMaximo = document.getElementById("labelPesoMaximo").value.toUpperCase();
        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || razonSocial === '' || CostoKgExtra === '' || PesoMaximo === '') {
            mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            const data = {
                "idEmpresa": id,
                "razonSocial": razonSocial,
                "costoKgExtra": CostoKgExtra,
                "pesoMaximoDelPaquete": PesoMaximo
            }
            if (document.getElementById("labelid").readOnly) {
                PUT(url, data);
                vaciarTabla(datatable);
                llenarTablaEmpresas(datatable);
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
            document.getElementById("labelRazonSocial").value = columns[1].innerText;
            document.getElementById("labelCostoKgExtra").value = columns[2].innerText;
            document.getElementById("labelPesoMaximo").value = columns[3].innerText;
            // Eliminamos el registro que indica que la tabla esta vacia
        }
    });
});