function vaciarTabla(datatable) {
    datatable.clear().draw();
}

function mostrarMensaje(mensaje, cssClass) {
    const div = document.createElement('div');
    div.className = `alert alert-${cssClass} mt-2`;
    div.appendChild(document.createTextNode(mensaje));
    const container = document.querySelector('.container-fluid');
    container.appendChild(div);
    setTimeout(function() {
        div.remove();
    }, 100);
}