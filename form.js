// form.js
document.getElementById('area').addEventListener('change', function() {
    const categorias = {
        'Catálogo': ['Error en descripción', 'Falta de imagen', 'Precio incorrecto'],
        'Category': ['Error en navegación', 'Falta categoría', 'Problema con filtros'],
        'Plataformas': ['Error en la web', 'Problema con la app', 'Integración fallida']
    };
    
    const categoriaSelect = document.getElementById('categoria');
    categoriaSelect.innerHTML = categorias[this.value]
        .map(opcion => `<option>${opcion}</option>`)
        .join('');
});

document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ticketData = {
        nombre: document.getElementById('nombre').value,
        area: document.getElementById('area').value,
        categoria: document.getElementById('categoria').value,
        descripcion: document.getElementById('descripcion').value,
        imagenes: await handleImages(),
        ticketNumber: `TKT-${Date.now()}`
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby8TiuX9ND1XYyliE4284nmHw1RyzuplK_vcDkGVbhrCmkG6QQvbG0QxgzwIJzmKxrofg/exec', {
            method: 'POST',
            body: JSON.stringify(ticketData)
        });
        
        document.getElementById('mensaje').textContent = `Ticket ${ticketData.ticketNumber} creado!`;
        document.getElementById('ticketForm').reset();
    } catch (error) {
        console.error('Error:', error);
    }
});

async function handleImages() {
    const files = document.getElementById('imagenes').files;
    return Promise.all([...files].map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }));
}