// panel.js
async function cargarTickets() {
    const response = await fetch('https://script.google.com/macros/s/AKfycby8TiuX9ND1XYyliE4284nmHw1RyzuplK_vcDkGVbhrCmkG6QQvbG0QxgzwIJzmKxrofg/exec');
    const tickets = await response.json();
    
    const container = document.getElementById('ticketsContainer');
    container.innerHTML = tickets
        .map(ticket => `
            <div class="ticket ${ticket.estado}">
                <h3>${ticket.ticketNumber}</h3>
                <p>${ticket.descripcion.substring(0, 50)}...</p>
                <p>Estado: 
                    <select class="estado" data-ticket="${ticket.ticketNumber}">
                        <option ${ticket.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option ${ticket.estado === 'Listo' ? 'selected' : ''}>Listo</option>
                    </select>
                </p>
            </div>
        `).join('');

    document.querySelectorAll('.estado').forEach(select => {
        select.addEventListener('change', async (e) => {
            await actualizarEstado(e.target.dataset.ticket, e.target.value);
        });
    });
}

async function actualizarEstado(ticketNumber, nuevoEstado) {
    await fetch('https://script.google.com/macros/s/AKfycby8TiuX9ND1XYyliE4284nmHw1RyzuplK_vcDkGVbhrCmkG6QQvbG0QxgzwIJzmKxrofg/exec', {
        method: 'POST',
        body: JSON.stringify({
            action: 'updateStatus',
            ticketNumber,
            nuevoEstado
        })
    });
    cargarTickets();
}

// Inicializar
cargarTickets();