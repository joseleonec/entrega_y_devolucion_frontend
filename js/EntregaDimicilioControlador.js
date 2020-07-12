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