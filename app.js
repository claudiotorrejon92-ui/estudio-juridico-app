// Sistema de gestión completo para estudio de abogados

// Datos iniciales
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let casos = JSON.parse(localStorage.getItem('casos')) || [];
let documentos = JSON.parse(localStorage.getItem('documentos')) || [];
let audiencias = JSON.parse(localStorage.getItem('audiencias')) || [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    actualizarDashboard();
    actualizarListaClientes();
    actualizarListaCasos();
    actualizarListaDocumentos();
    actualizarCalendarioAudiencias();
    actualizarSelects();
    
    // Mostrar notificación de bienvenida
    mostrarNotificacion('¡Bienvenido al Sistema de Gestión de tu Estudio!', 'success');
});

// Navegación entre secciones
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(seccionId).style.display = 'block';
    
    // Actualizar botones activos
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.nav-btn').classList.add('active');
}

// Dashboard
function actualizarDashboard() {
    document.getElementById('totalClientes').textContent = clientes.length;
    document.getElementById('totalCasos').textContent = casos.filter(c => c.estado !== 'Cerrado').length;
    document.getElementById('totalDocumentos').textContent = documentos.length;
    
    const hoy = new Date().toISOString().split('T')[0];
    const audienciasHoy = audiencias.filter(a => a.fecha === hoy).length;
    document.getElementById('totalAudiencias').textContent = audienciasHoy;
}

// Gestión de Clientes
function agregarCliente() {
    const nombre = document.getElementById('nombreCliente').value.trim();
    const email = document.getElementById('emailCliente').value.trim();
    const telefono = document.getElementById('telefonoCliente').value.trim();
    const direccion = document.getElementById('direccionCliente').value.trim();
    const notas = document.getElementById('notasCliente').value.trim();

    if (!nombre || !telefono) {
        mostrarNotificacion('Por favor complete los campos obligatorios (nombre y teléfono)', 'error');
        return;
    }

    const cliente = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        direccion,
        notas,
        fechaRegistro: new Date().toLocaleDateString(),
        casoIds: []
    };

    clientes.push(cliente);
    guardarDatos();
    actualizarListaClientes();
    actualizarSelects();
    limpiarFormularioCliente();
    actualizarDashboard();
    mostrarNotificacion('Cliente agregado exitosamente', 'success');
}

function actualizarListaClientes() {
    const lista = document.getElementById('listaClientes');
    
    if (clientes.length === 0) {
        lista.innerHTML = '<p class="no-data">No hay clientes registrados</p>';
        return;
    }

    lista.innerHTML = clientes.map(cliente => `
        <div class="data-item">
            <h4>${cliente.nombre}</h4>
            <p><i class="fas fa-phone"></i> ${cliente.telefono}</p>
            ${cliente.email ? `<p><i class="fas fa-envelope"></i> ${cliente.email}</p>` : ''}
            ${cliente.direccion ? `<p><i class="fas fa-map-marker-alt"></i> ${cliente.direccion}</p>` : ''}
            ${cliente.notas ? `<p><i class="fas fa-sticky-note"></i> ${cliente.notas}</p>` : ''}
            <p><small>Registrado: ${cliente.fechaRegistro}</small></p>
            <div class="actions">
                <button class="btn-small btn-edit" onclick="editarCliente(${cliente.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-small btn-delete" onclick="eliminarCliente(${cliente.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function buscarCliente() {
    const termino = document.getElementById('buscarCliente').value.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.telefono.includes(termino) ||
        cliente.email.toLowerCase().includes(termino)
    );
    
    const lista = document.getElementById('listaClientes');
    if (clientesFiltrados.length === 0) {
        lista.innerHTML = '<p class="no-data">No se encontraron clientes</p>';
        return;
    }

    lista.innerHTML = clientesFiltrados.map(cliente => `
        <div class="data-item">
            <h4>${cliente.nombre}</h4>
            <p><i class="fas fa-phone"></i> ${cliente.telefono}</p>
            ${cliente.email ? `<p><i class="fas fa-envelope"></i> ${cliente.email}</p>` : ''}
            <div class="actions">
                <button class="btn-small btn-edit" onclick="editarCliente(${cliente.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-small btn-delete" onclick="eliminarCliente(${cliente.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    document.getElementById('nombreCliente').value = cliente.nombre;
    document.getElementById('emailCliente').value = cliente.email;
    document.getElementById('telefonoCliente').value = cliente.telefono;
    document.getElementById('direccionCliente').value = cliente.direccion;
    document.getElementById('notasCliente').value = cliente.notas;

    const btnGuardar = document.querySelector('#clientes .btn-primary');
    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar Cliente';
    btnGuardar.onclick = () => actualizarCliente(id);
    
    mostrarNotificacion('Modifique los datos del cliente y guarde los cambios', 'warning');
}

function actualizarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    cliente.nombre = document.getElementById('nombreCliente').value.trim();
    cliente.email = document.getElementById('emailCliente').value.trim();
    cliente.telefono = document.getElementById('telefonoCliente').value.trim();
    cliente.direccion = document.getElementById('direccionCliente').value.trim();
    cliente.notas = document.getElementById('notasCliente').value.trim();

    guardarDatos();
    actualizarListaClientes();
    actualizarSelects();
    limpiarFormularioCliente();
    
    const btnGuardar = document.querySelector('#clientes .btn-primary');
    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Cliente';
    btnGuardar.onclick = agregarCliente;
    
    actualizarDashboard();
    mostrarNotificacion('Cliente actualizado exitosamente', 'success');
}

function eliminarCliente(id) {
    if (confirm('¿Está seguro de eliminar este cliente? Se eliminarán también sus casos asociados.')) {
        // Eliminar cliente
        clientes = clientes.filter(c => c.id !== id);
        
        // Eliminar casos asociados
        casos = casos.filter(c => c.clienteId !== id);
        
        // Eliminar documentos de esos casos
        documentos = documentos.filter(d => {
            const caso = casos.find(c => c.id === d.casoId);
            return caso && caso.clienteId !== id;
        });
        
        guardarDatos();
        actualizarListaClientes();
        actualizarListaCasos();
        actualizarListaDocumentos();
        actualizarSelects();
        actualizarDashboard();
        mostrarNotificacion('Cliente eliminado exitosamente', 'success');
    }
}

function limpiarFormularioCliente() {
    document.getElementById('nombreCliente').value = '';
    document.getElementById('emailCliente').value = '';
    document.getElementById('telefonoCliente').value = '';
    document.getElementById('direccionCliente').value = '';
    document.getElementById('notasCliente').value = '';
}

// Gestión de Casos
function agregarCaso() {
    const titulo = document.getElementById('tituloCaso').value.trim();
    const clienteId = document.getElementById('clienteCaso').value;
    const tipo = document.getElementById('tipoCaso').value;
    const descripcion = document.getElementById('descripcionCaso').value.trim();
    const fechaInicio = document.getElementById('fechaInicioCaso').value;
    const estado = document.getElementById('estadoCaso').value;

    if (!titulo || !clienteId) {
        mostrarNotificacion('Por favor complete los campos obligatorios', 'error');
        return;
    }

    const cliente = clientes.find(c => c.id == clienteId);
    const caso = {
        id: Date.now(),
        titulo,
        clienteId: parseInt(clienteId),
        clienteNombre: cliente.nombre,
        tipo,
        descripcion,
        fechaInicio: fechaInicio || new Date().toISOString().split('T')[0],
        estado,
        fechaRegistro: new Date().toLocaleDateString(),
        documentos: []
    };

    casos.push(caso);
    
    // Actualizar cliente con el ID del caso
    cliente.casoIds = cliente.casoIds || [];
    cliente.casoIds.push(caso.id);
    
    guardarDatos();
    actualizarListaCasos();
    limpiarFormularioCaso();
    actualizarDashboard();
    mostrarNotificacion('Caso agregado exitosamente', 'success');
}

function actualizarListaCasos() {
    const lista = document.getElementById('listaCasos');
    
    if (casos.length === 0) {
        lista.innerHTML = '<p class="no-data">No hay casos registrados</p>';
        return;
    }

    lista.innerHTML = casos.map(caso => `
        <div class="data-item">
            <h4>${caso.titulo}</h4>
            <p><i class="fas fa-user"></i> Cliente: ${caso.clienteNombre}</p>
            ${caso.tipo ? `<p><i class="fas fa-tag"></i> Tipo: ${caso.tipo}</p>` : ''}
            <p><i class="fas fa-info-circle"></i> Estado: <span class="estado-${caso.estado.toLowerCase()}">${caso.estado}</span></p>
            <p><i class="fas fa-calendar"></i> Inicio: ${caso.fechaInicio}</p>
            ${caso.descripcion ? `<p><i class="fas fa-align-left"></i> ${caso.descripcion}</p>` : ''}
            <div class="actions">
                <button class="btn-small btn-edit" onclick="editarCaso(${caso.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-small btn-delete" onclick="eliminarCaso(${caso.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function buscarCaso() {
    const termino = document.getElementById('buscarCaso').value.toLowerCase();
    const casosFiltrados = casos.filter(caso => 
        caso.titulo.toLowerCase().includes(termino) ||
        caso.clienteNombre.toLowerCase().includes(termino) ||
        caso.tipo.toLowerCase().includes(termino) ||
        caso.estado.toLowerCase().includes(termino)
    );
    
    const lista = document.getElementById('listaCasos');
    if (casosFiltrados.length === 0) {
        lista.innerHTML = '<p class="no-data">No se encontraron casos</p>';
        return;
    }

    lista.innerHTML = casosFiltrados.map(caso => `
        <div class="data-item">
            <h4>${caso.titulo}</h4>
            <p><i class="fas fa-user"></i> Cliente: ${caso.clienteNombre}</p>
            <p><i class="fas fa-tag"></i> Tipo: ${caso.tipo}</p>
            <p><i class="fas fa-info-circle"></i> Estado: ${caso.estado}</p>
            <div class="actions">
                <button class="btn-small btn-edit" onclick="editarCaso(${caso.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-small btn-delete" onclick="eliminarCaso(${caso.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function editarCaso(id) {
    const caso = casos.find(c => c.id === id);
    if (!caso) return;

    document.getElementById('tituloCaso').value = caso.titulo;
    document.getElementById('clienteCaso').value = caso.clienteId;
    document.getElementById('tipoCaso').value = caso.tipo;
    document.getElementById('descripcionCaso').value = caso.descripcion;
    document.getElementById('fechaInicioCaso').value = caso.fechaInicio;
    document.getElementById('estadoCaso').value = caso.estado;

    const btnGuardar = document.querySelector('#casos .btn-primary');
    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar Caso';
    btnGuardar.onclick = () => actualizarCaso(id);
    
    mostrarNotificacion('Modifique los datos del caso y guarde los cambios', 'warning');
}

function actualizarCaso(id) {
    const caso = casos.find(c => c.id === id);
    if (!caso) return;

    caso.titulo = document.getElementById('tituloCaso').value.trim();
    caso.clienteId = parseInt(document.getElementById('clienteCaso').value);
    caso.clienteNombre = clientes.find(c => c.id === caso.clienteId).nombre;
    caso.tipo = document.getElementById('tipoCaso').value;
    caso.descripcion = document.getElementById('descripcionCaso').value.trim();
    caso.fechaInicio = document.getElementById('fechaInicioCaso').value;
    caso.estado = document.getElementById('estadoCaso').value;

    guardarDatos();
    actualizarListaCasos();
    limpiarFormularioCaso();
    
    const btnGuardar = document.querySelector('#casos .btn-primary');
    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Caso';
    btnGuardar.onclick = agregarCaso;
    
    actualizarDashboard();
    mostrarNotificacion('Caso actualizado exitosamente', 'success');
}

function eliminarCaso(id) {
    if (confirm('¿Está seguro de eliminar este caso? Se eliminarán también sus documentos.')) {
        const caso = casos.find(c => c.id === id);
        
        // Eliminar caso
        casos = casos.filter(c => c.id !== id);
        
        // Eliminar documentos del caso
        documentos = documentos.filter(d => d.casoId !== id);
        
        // Actualizar cliente
        const cliente = clientes.find(c => c.id === caso.clienteId);
        if (cliente) {
            cliente.casoIds = cliente.casoIds.filter(casoId => casoId !== id);
        }
        
        guardarDatos();
        actualizarListaCasos();
        actualizarListaDocumentos();
        actualizarSelects();
        actualizarDashboard();
        mostrarNotificacion('Caso eliminado exitosamente', 'success');
    }
}

function limpiarFormularioCaso() {
    document.getElementById('tituloCaso').value = '';
    document.getElementById('clienteCaso').value = '';
    document.getElementById('tipoCaso').value = '';
    document.getElementById('descripcionCaso').value = '';
    document.getElementById('fechaInicioCaso').value = '';
    document.getElementById('estadoCaso').value = 'Activo';
}

// Gestión de Documentos
function subirDocumentos() {
    const casoId = document.getElementById('casoDocumento').value;
    const descripcion = document.getElementById('descripcionDocumento').value.trim();
    const archivos = document.getElementById('archivoDocumento').files;

    if (!casoId || archivos.length === 0) {
        mostrarNotificacion('Por favor seleccione un caso y al menos un archivo', 'error');
        return;
    }

    const caso = casos.find(c => c.id == casoId);
    
    Array.from(archivos).forEach(archivo => {
        const documento = {
            id: Date.now() + Math.random(),
            casoId: parseInt(casoId),
            casoTitulo: caso.titulo,
            nombreArchivo: archivo.name,
            tipoArchivo: archivo.type,
            tamaño: archivo.size,
            descripcion: descripcion,
            fechaSubida: new Date().toLocaleDateString(),
            url: URL.createObjectURL(archivo)
        };
        
        documentos.push(documento);
        caso.documentos = caso.documentos || [];
        caso.documentos.push(documento.id);
    });

    guardarDatos();
    actualizarListaDocumentos();
    limpiarFormularioDocumentos();
    actualizarDashboard();
    mostrarNotificacion('Documentos subidos exitosamente', 'success');
}

function actualizarListaDocumentos() {
    const lista = document.getElementById('listaDocumentos');
    
    if (documentos.length === 0) {
        lista.innerHTML = '<p class="no-data">No hay documentos registrados</p>';
        return;
    }

    lista.innerHTML = documentos.map(doc => `
        <div class="data-item">
            <h4><i class="fas fa-file-alt"></i> ${doc.nombreArchivo}</h4>
            <p><i class="fas fa-folder-open"></i> Caso: ${doc.casoTitulo}</p>
            ${doc.descripcion ? `<p><i class="fas fa-align-left"></i> ${doc.descripcion}</p>` : ''}
            <p><i class="fas fa-calendar"></i> Subido: ${doc.fechaSubida}</p>
            <p><i class="fas fa-hdd"></i> Tamaño: ${(doc.tamaño / 1024 / 1024).toFixed(2)} MB</p>
            <div class="actions">
                <button class="btn-small btn-primary" onclick="descargarDocumento('${doc.url}', '${doc.nombreArchivo}')">
                    <i class="fas fa-download"></i> Descargar
                </button>
                <button class="btn-small btn-delete" onclick="eliminarDocumento(${doc.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function descargarDocumento(url, nombre) {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
}

function eliminarDocumento(id) {
    if (confirm('¿Está seguro de eliminar este documento?')) {
        const documento = documentos.find(d => d.id === id);
        
        // Eliminar de la lista de documentos del caso
        const caso = casos.find(c => c.id === documento.casoId);
        if (caso && caso.documentos) {
            caso.documentos = caso.documentos.filter(docId => docId !== id);
        }
        
        // Eliminar documento
        documentos = documentos.filter(d => d.id !== id);
        
        guardarDatos();
        actualizarListaDocumentos();
        actualizarDashboard();
        mostrarNotificacion('Documento eliminado exitosamente', 'success');
    }
}

function limpiarFormularioDocumentos() {
    document.getElementById('casoDocumento').value = '';
    document.getElementById('descripcionDocumento').value = '';
    document.getElementById('archivoDocumento').value = '';
}

// Gestión de Audiencias
function agregarAudiencia() {
    const titulo = document.getElementById('tituloAudiencia').value.trim();
    const casoId = document.getElementById('casoAudiencia').value;
    const fecha = document.getElementById('fechaAudiencia').value;
    const hora = document.getElementById('horaAudiencia').value;
    const lugar = document.getElementById('lugarAudiencia').value.trim();
    const notas = document.getElementById('notasAudiencia').value.trim();

    if (!titulo || !casoId || !fecha || !hora) {
        mostrarNotificacion('Por favor complete los campos obligatorios', 'error');
        return;
    }

    const caso = casos.find(c => c.id == casoId);
    const audiencia = {
        id: Date.now(),
        titulo,
        casoId: parseInt(casoId),
        casoTitulo: caso.titulo,
        fecha,
        hora,
        lugar,
        notas,
        fechaRegistro: new Date().toLocaleDateString()
    };

    audiencias.push(audiencia);
    guardarDatos();
    actualizarCalendarioAudiencias();
    limpiarFormularioAudiencia();
    actualizarDashboard();
    mostrarNotificacion('Audiencia agendada exitosamente', 'success');
}

function actualizarCalendarioAudiencias() {
    const lista = document.getElementById('calendarioAudiencias');
    
    if (audiencias.length === 0) {
        lista.innerHTML = '<p class="no-data">No hay audiencias programadas</p>';
        return;
    }

    // Ordenar por fecha y hora
    const audienciasOrdenadas = [...audiencias].sort((a, b) => {
        const fechaA = new Date(a.fecha + ' ' + a.hora);
        const fechaB = new Date(b.fecha + ' ' + b.hora);
        return fechaA - fechaB;
    });

    // Agrupar por fecha
    const audienciasPorFecha = {};
    audienciasOrdenadas.forEach(audiencia => {
        if (!audienciasPorFecha[audiencia.fecha]) {
            audienciasPorFecha[audiencia.fecha] = [];
        }
        audienciasPorFecha[audiencia.fecha].push(audiencia);
    });

    let html = '';
    Object.keys(audienciasPorFecha).sort().forEach(fecha => {
        html += `<h4 class="fecha-header"><i class="fas fa-calendar-day"></i> ${formatearFecha(fecha)}</h4>`;
        audienciasPorFecha[fecha].forEach(audiencia => {
            html += `
                <div class="data-item">
                    <h4><i class="fas fa-gavel"></i> ${audiencia.titulo}</h4>
                    <p><i class="fas fa-folder-open"></i> Caso: ${audiencia.casoTitulo}</p>
                    <p><i class="fas fa-clock"></i> Hora: ${audiencia.hora}</p>
                    ${audiencia.lugar ? `<p><i class="fas fa-map-marker-alt"></i> Lugar: ${audiencia.lugar}</p>` : ''}
                    ${audiencia.notas ? `<p><i class="fas fa-sticky-note"></i> ${audiencia.notas}</p>` : ''}
                    <div class="actions">
                        <button class="btn-small btn-edit" onclick="editarAudiencia(${audiencia.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-small btn-delete" onclick="eliminarAudiencia(${audiencia.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        });
    });

    lista.innerHTML = html;
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function editarAudiencia(id) {
    const audiencia = audiencias.find(a => a.id === id);
    if (!audiencia) return;

    document.getElementById('tituloAudiencia').value = audiencia.titulo;
    document.getElementById('casoAudiencia').value = audiencia.casoId;
    document.getElementById('fechaAudiencia').value = audiencia.fecha;
    document.getElementById('horaAudiencia').value = audiencia.hora;
    document.getElementById('lugarAudiencia').value = audiencia.lugar;
    document.getElementById('notasAudiencia').value = audiencia.notas;

    const btnGuardar = document.querySelector('#agenda .btn-primary');
    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar Audiencia';
    btnGuardar.onclick = () => actualizarAudiencia(id);
    
    mostrarNotificacion('Modifique los datos de la audiencia y guarde los cambios', 'warning');
}

function actualizarAudiencia(id) {
    const audiencia = audiencias.find(a => a.id === id);
    if (!audiencia) return;

    audiencia.titulo = document.getElementById('tituloAudiencia').value.trim();
    audiencia.casoId = parseInt(document.getElementById('casoAudiencia').value);
    const caso = casos.find(c => c.id === audiencia.casoId);
    audiencia.casoTitulo = caso.titulo;
    audiencia.fecha = document.getElementById('fechaAudiencia').value;
    audiencia.hora = document.getElementById('horaAudiencia').value;
    audiencia.lugar = document.getElementById('lugarAudiencia').value.trim();
    audiencia.notas = document.getElementById('notasAudiencia').value.trim();

    guardarDatos();
    actualizarCalendarioAudiencias();
    limpiarFormularioAudiencia();
    
    const btnGuardar = document.querySelector('#agenda .btn-primary');
    btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Audiencia';
    btnGuardar.onclick = agregarAudiencia;
    
    actualizarDashboard();
    mostrarNotificacion('Audiencia actualizada exitosamente', 'success');
}

function eliminarAudiencia(id) {
    if (confirm('¿Está seguro de eliminar esta audiencia?')) {
        audiencias = audiencias.filter(a => a.id !== id);
        guardarDatos();
        actualizarCalendarioAudiencias();
        actualizarDashboard();
        mostrarNotificacion('Audiencia eliminada exitosamente', 'success');
    }
}

function limpiarFormularioAudiencia() {
    document.getElementById('tituloAudiencia').value = '';
    document.getElementById('casoAudiencia').value = '';
    document.getElementById('fechaAudiencia').value = '';
    document.getElementById('horaAudiencia').value = '';
    document.getElementById('lugarAudiencia').value = '';
    document.getElementById('notasAudiencia').value = '';
}

// Funciones auxiliares
function actualizarSelects() {
    // Actualizar select de clientes en casos
    const selectClienteCaso = document.getElementById('clienteCaso');
    selectClienteCaso.innerHTML = '<option value="">Seleccionar cliente *</option>';
    clientes.forEach(cliente => {
        selectClienteCaso.innerHTML += `<option value="${cliente.id}">${cliente.nombre}</option>`;
    });

    // Actualizar select de casos en documentos
    const selectCasoDocumento = document.getElementById('casoDocumento');
    selectCasoDocumento.innerHTML = '<option value="">Seleccionar caso</option>';
    casos.forEach(caso => {
        selectCasoDocumento.innerHTML += `<option value="${caso.id}">${caso.titulo} - ${caso.clienteNombre}</option>`;
    });

    // Actualizar select de casos en audiencias
    const selectCasoAudiencia = document.getElementById('casoAudiencia');
    selectCasoAudiencia.innerHTML = '<option value="">Seleccionar caso *</option>';
    casos.forEach(caso => {
        selectCasoAudiencia.innerHTML += `<option value="${caso.id}">${caso.titulo} - ${caso.clienteNombre}</option>`;
    });
}

function guardarDatos() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('casos', JSON.stringify(casos));
    localStorage.setItem('documentos', JSON.stringify(documentos));
    localStorage.setItem('audiencias', JSON.stringify(audiencias));
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = `notificacion ${tipo} show`;
    
    setTimeout(() => {
        notificacion.classList.remove('show');
    }, 3000);
}

// Estilos adicionales
const estilosEstados = document.createElement('style');
estilosEstados.textContent = `
    .estado-activo { color: var(--secondary); font-weight: bold; }
    .estado-en proceso { color: var(--warning); font-weight: bold; }
    .estado-pendiente { color: var(--warning); font-weight: bold; }
    .estado-cerrado { color: var(--gray); font-weight: bold; }
    .no-data { text-align: center; color: var(--gray); font-style: italic; padding: 40px; }
    .fecha-header { color: var(--primary); margin: 20px 0 10px 0; padding: 10px; background: var(--light); border-radius: 8px; }
`;
document.head.appendChild(estilosEstados);