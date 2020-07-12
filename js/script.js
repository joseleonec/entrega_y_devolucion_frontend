// codigo propio
class Ruta {
    constructor(origen, destino, descripcion, fechaUltimaSalida) {
        this.origen = origen;
        this.destino = destino;
        this.descripcion = descripcion;
        this.fechaUltimaSalida = fechaUltimaSalida;
    }
}

class UI {
    addRuta(ruta) {
        const registrosRutas = document.getElementById('registrosRutas');
        const element = document.createElement('tr');
        var table = $('#dataTable').DataTable();
        const span = document.createElement('span');
        span.className = 'table-remove';
        span.innerHTML = `
            <button name='delete' class="btn btn-danger btn-rounded btn-sm my-0">
                Eliminar
            </button>`;
        table.row.add([ruta.origen, ruta.destino, ruta.descripcion, ruta.fechaUltimaSalida, span]).draw();
        this.mostrarMensaje('Ruta regisrada con exito', 'success');
    }

    resetForm() {
        document.getElementById("formulario").reset();
    }
    eliminarRuta(element) {
        if (element.name === 'delete') {
            element.parentElement.parentElement.parentElement.remove();
            registrosRutas
            this.mostrarMensaje('Ruta eliminada ', 'info');
        }
    }

    mostrarMensaje(mensaje, cssClass) {
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
}
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// ---------------------- CAPTURA DE EVENTOS -----------------------

// EVENTO INGRESO DE RUTAS
$(document).ready(function() {
    $("#btnguardar").click(function() {
        console.log("Evento capturado");
        const origen = document.getElementById("labelorigen").value;
        const destino = document.getElementById("labeldestino").value;
        const descripcion = document.getElementById("labeldescripcion").value;
        const fechaUltimaSalida = document.getElementById("labelfecha").value;
        const ruta = new Ruta(origen, destino, descripcion, fechaUltimaSalida);
        // const data = {
        //     "origen": $ { origen },
        //     "destino": $ { destino },
        //     "descripcion": $ { descripcion },
        //     "fechaUltimaSalida": $ { fechaUltimaSalida }
        // }
        const ui = new UI();
        // Eliminamos el registro que indica que la tabla esta vacia
        // Input User Validation
        if (origen === '' || destino === '' || descripcion === '') {
            ui.mostrarMensaje('Please Insert data in all fields', 'danger');
        } else {
            ui.addRuta(ruta);
            $('#exampleModal').modal('hide');
        }
        // metodo get
        const url = 'http://192.168.1.100:9099//api/persona';
        fetch(url).then(function(response) {
            return response.json();
        }).then(function(data) {

            data.forEach(element => {
                console.log(element);
            });
        }).catch(function() {
            console.log("Booo");
        });
        // metodo post
        // var form = new FormData(document.getElementById('login-form'));
        // fetch("/login", {
        //     method: "POST",
        //     body: form
        // });

    });
    $('#exampleModal').on('hidden.bs.modal', function() {
        $(this).find('form')[
            0].reset();
    });
});