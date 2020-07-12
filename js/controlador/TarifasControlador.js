const url = 'https://springtest999.herokuapp.com/api/tarifa/';

function addRow(datatable, tarifa) {
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
    datatable.row.add([tarifa.idTarifa, tarifa.costo, tarifa.minutosEstimados, tarifa.parroquia.idParroquia, tarifa.empresa.idEmpresa, span]).draw();
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

    var datatable = $('#tablaTarifa').DataTable({
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
    $("#btn-guardar-tarifa").click(function() {
        // console.log("Evento capturado");
        const id = document.getElementById("labelid").value.toUpperCase();
        const costo = document.getElementById("labelcosto").value.toUpperCase();
        const minutosEstimados = document.getElementById("labelminutosEstimados").value.toUpperCase();
        const idParroquia = document.getElementById("labelidParroquia").value.toUpperCase();
        const idEmpresa = document.getElementById("labelidEmpresa").value.toUpperCase();

        var parroquia;
        fetch('https://springtest999.herokuapp.com/api/parroquia/' + idParroquia).then(function(response) {
            return response.json();
        }).then(function(data) {
            parroquia = data;
        }).catch(function() {
            console.log("Error al recuperar registro compuesto");
        });

        var empresa;
        fetch('https://springtest999.herokuapp.com/api/empresa/' + idEmpresa).then(function(response) {
            return response.json();
        }).then(function(data) {
            empresa = data;
        }).catch(function() {
            console.log("Error al recuperar registro compuesto");
        });
        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (id === '' || minutosEstimados === '' || idParroquia === '' || costo === '' || idEmpresa == '' || parroquia == null || empresa == null) {
            mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            const data = {
                "idTarifa": id,
                "costo": costo,
                "minutosEstimados": minutosEstimados,
                "parroquia": parroquia,
                "parroquia": empresa
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

            document.getElementById("labelcosto").value = columns[1].innerText;
            document.getElementById("labelminutosEstimados").value = columns[2].innerText;
            document.getElementById("labelidParroquia").value = columns[3].innerText;
            document.getElementById("labelidEmpresa").value = columns[4].innerText;

        }
    });

});