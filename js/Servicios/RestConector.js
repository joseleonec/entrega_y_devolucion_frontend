function GET(url) {
    fetch(url).then(function(response) {
        return response.json();
    }).catch(function() {
        console.log("Error on GET request ");
    });
}

function POST(url, data) {
    fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error on POST request :', error))
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
        .catch(error => console.error('Error on PUT request: ', error))
        .then(response => console.log('Success:', response));
    document.getElementById("labelid").readOnly = false;
}

function DELETE(url) {
    fetch(url, {
        method: "DELETE"
    });
}