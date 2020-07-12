// Call the dataTables jQuery plugin
$(document).ready(function() {
    var dataTableMisRutas = $('#dataTable').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": `
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
            `
        }]
    });

    dataTableMisRutas.on('click', 'tbody tr', function(e) {
        const a = e.target.name;
        if (a === 'delete') {
            dataTableMisRutas.row(this).remove().draw();
            const ui = new UI();
            ui.mostrarMensaje('Ruta eliminada ', 'info');
        }
    });

    var dataTableCompras = $('#dataTableCompras').DataTable();
    var dataTableViajes = $('#dataTableViajes').DataTable();
    var dataTableSalidas = $('#dataTableSalidas').DataTable();
    var dataTableReservas = $('#dataTableReservas').DataTable();

});