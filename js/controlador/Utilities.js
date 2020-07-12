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


function POST(url, data) {
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

function PUT(url, data) {
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

function DELETE(url, id) {
    fetch(url + id, {
        method: "DELETE"
    });
}