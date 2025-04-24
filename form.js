// Generador de números de ticket
function generarNumeroTicket() {
    const contador = localStorage.getItem('ticketCounter') || 0;
    const nuevoContador = parseInt(contador) + 1;
    localStorage.setItem('ticketCounter', nuevoContador);
    return `PTF-${String(nuevoContador).padStart(3, '0')}`;
}

// Categorías por área
const categoriasPorArea = {
    'Catálogo': ['Error en descripción', 'Falta de imagen', 'Precio incorrecto'],
    'Category': ['Error en navegación', 'Falta categoría', 'Problema con filtros'],
    'Plataformas': ['Error en la web', 'Problema con la app', 'Integración fallida']
};

// Actualizar categorías al seleccionar área
document.getElementById('area').addEventListener('change', function() {
    const categoriaSelect = document.getElementById('categoria');
    const areaSeleccionada = this.value;

    if (areaSeleccionada) {
        categoriaSelect.innerHTML = categoriasPorArea[areaSeleccionada]
            .map(opcion => `<option value="${opcion}">${opcion}</option>`)
            .join('');
        categoriaSelect.disabled = false;
    } else {
        categoriaSelect.innerHTML = '<option value="">Primero selecciona un área</option>';
        categoriaSelect.disabled = true;
    }
});

// Envío del formulario
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ticketData = {
        nombre: document.getElementById('nombre').value,
        area: document.getElementById('area').value,
        categoria: document.getElementById('categoria').value,
        descripcion: document.getElementById('descripcion').value,
        imagenes: await procesarImagenes(),
        ticketNumber: generarNumeroTicket(),
        estado: 'Pendiente',
        fecha: new Date().toISOString()
    };

    // Validación extra
    if (!ticketData.categoria) {
        alert('Por favor selecciona una categoría');
        return;
    }

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby8TiuX9ND1XYyliE4284nmHw1RyzuplK_vcDkGVbhrCmkG6QQvbG0QxgzwIJzmKxrofg/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData)
        });
        
        document.getElementById('mensaje').innerHTML = `
            <div class="success">
                <p>✅ Ticket <strong>${ticketData.ticketNumber}</strong> creado correctamente.</p>
            </div>
        `;
        document.getElementById('ticketForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el ticket');
    }
});

// Procesar imágenes como Base64 (solución temporal)
async function procesarImagenes() {
    const files = document.getElementById('imagenes').files;
    if (files.length === 0) return [];
    
    return Promise.all([...files].map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }));
}