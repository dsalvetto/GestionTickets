// Variables globales
let ticketsData = [];

// Cargar tickets desde Google Sheets
async function cargarTickets() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby8TiuX9ND1XYyliE4284nmHw1RyzuplK_vcDkGVbhrCmkG6QQvbG0QxgzwIJzmKxrofg/exec');
        ticketsData = await response.json();
        mostrarTickets(ticketsData);
    } catch (error) {
        console.error("Error al cargar tickets:", error);
        alert("Error al cargar los tickets. Intenta nuevamente.");
    }
}

// Mostrar tickets en el panel
function mostrarTickets(tickets) {
    const container = document.getElementById('ticketsContainer');
    const filtro = document.getElementById('filtroEstado').value;
    
    const ticketsFiltrados = filtro === 'Todos' 
        ? tickets 
        : tickets.filter(t => t.estado === filtro);

    container.innerHTML = ticketsFiltrados.map(ticket => `
        <div class="ticket-card ${ticket.estado === 'Listo' ? 'resuelto' : ''}">
            <div class="ticket-header">
                <span class="ticket-number">${ticket.ticketNumber}</span>
                <span class="ticket-status ${ticket.estado.toLowerCase()}">${ticket.estado}</span>
            </div>
            <div class="ticket-body">
                <p><strong>Área:</strong> ${ticket.area}</p>
                <p><strong>Categoría:</strong> ${ticket.categoria}</p>
                <p class="ticket-desc"><strong>Descripción:</strong> ${ticket.descripcion.substring(0, 100)}...</p>
            </div>
            <div class="ticket-footer">
                <select class="status-select" data-ticket="${ticket.ticketNumber}">
                    <option value="Pendiente" ${ticket.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Listo" ${ticket.estado === 'Listo' ? 'selected' : ''}>Resuelto</option>
                </select>
                <button class="ver-detalles-btn" data-ticket="${ticket.ticketNumber}">
                    <i class="fas fa-eye"></i> Detalles
                </button>
            </div>
        </div>
    `).join('');

    // Event listeners para los controles
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            actualizarEstado(e.target.dataset.ticket, e.target.value);
        });
    });

    document.querySelectorAll('.ver-detalles-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            mostrarDetallesCompletos(e.target.dataset.ticket || e.target.closest('button').dataset.ticket);
        });
    });
}

// Mostrar detalles completos en modal
function mostrarDetallesCompletos(ticketNumber) {
    const ticket = ticketsData.find(t => t.ticketNumber === ticketNumber);
    if (!ticket) return;

    const modal = document.getElementById('detallesModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <p><strong>Solicitante:</strong> ${ticket.nombre}</p>
        <p><strong>Fecha:</strong> ${new Date(ticket.fecha).toLocaleString()}</p>
        <p><strong>Área:</strong> ${ticket.area}</p>
        <p><strong>Categoría:</strong> ${ticket.categoria}</p>
        <p><strong>Descripción:</strong></p>
        <div class="descripcion-completa">${ticket.descripcion}</div>
        
        ${ticket.imagenes && ticket.imagenes.length > 0 ? `
            <p><strong>Imágenes:</strong></p>
            <div class="imagenes-container">
                ${ticket.imagenes.map(img => 
                    `<a href="${img}" target="_blank" class="enlace-imagen">
                        <img src="${img}" alt="Imagen del ticket" class="thumb-imagen">
                    </a>`
                ).join('')}
            </div>
        ` : ''}
    `;

    modal.style.display = 'block';
}

// Actualizar estado del ticket
async function actualizarEstado(ticketNumber, nuevoEstado) {
    try {
        await fetch('https://script.google.com/macros/s/AKfycby8TiuX9ND1XYyliE4284nmHw1RyzuplK_vcDkGVbhrCmkG6QQvbG0QxgzwIJzmKxrofg/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'updateStatus',
                ticketNumber,
                nuevoEstado
            })
        });
        cargarTickets(); // Recargar la lista
    } catch (error) {
        console.error("Error al actualizar estado:", error);
    }
}

// Cerrar modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('detallesModal').style.display = 'none';
});

// Filtros y botón de refresh
document.getElementById('filtroEstado').addEventListener('change', () => {
    mostrarTickets(ticketsData);
});

document.getElementById('refreshBtn').addEventListener('click', cargarTickets);

// Inicialización
document.addEventListener('DOMContentLoaded', cargarTickets);