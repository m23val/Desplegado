/**
 * Inicializar formulario con spinner de carga estilo Apple
 */
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileMessage = document.querySelector('.file-message');
    
    // Inicializar la carga de archivos
    if (fileInput) {
        console.log("Inicializando input de archivos");
        
        // Crear botón visible
        if (fileMessage) {
            fileMessage.innerHTML = '<div class="file-message-content"><span>Arrastra tu archivo aquí</span><div class="custom-file-button">Seleccionar archivo</div></div>';
            
            // Asegurarse de que el botón active el input
            const customButton = document.querySelector('.custom-file-button');
            if (customButton) {
                customButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    fileInput.click();
                });
            }
        }
        
        // Inicializar drag & drop
        const fileDrop = document.getElementById('fileDrop');
        if (fileDrop) {
            fileDrop.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('active');
            });
            
            fileDrop.addEventListener('dragleave', function() {
                this.classList.remove('active');
            });
            
            fileDrop.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('active');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    // Disparar evento change manualmente
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
            });
        }
        
        // Actualizar al seleccionar un archivo
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const extension = file.name.split('.').pop().toLowerCase();
                const icon = extension === 'pdf' ? 'fa-file-pdf' : 'fa-file-word';
                
                if (fileInfo) {
                    fileInfo.innerHTML = `
                        <div class="file-preview">
                            <i class="fas ${icon}"></i>
                            <div class="file-details">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${formatSize(file.size)}</div>
                            </div>
                            <button type="button" class="file-remove" onclick="removeFile()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    fileInfo.style.display = 'block';
                    if (fileMessage) fileMessage.style.display = 'none';
                }
            }
        });
    }
    
    // Inicializar formulario con spinner de carga
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar que se haya seleccionado un archivo
            if (fileInput && !fileInput.files.length) {
                alert('Por favor selecciona un archivo CV.');
                return;
            }
            
            // Validar que se haya seleccionado un puesto
            const puestoSelect = document.getElementById('puestoSelect');
            if (puestoSelect && (puestoSelect.value === "" || puestoSelect.selectedIndex === 0)) {
                alert('Por favor selecciona un puesto.');
                return;
            }
            
            // Mostrar el modal con spinner
            const progressModal = document.getElementById('progressModal');
            if (progressModal) {
                // Actualizar el contenido del modal con el spinner
                const modalContent = progressModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.innerHTML = `
                        <div class="spinner-container">
                            <div class="spinner"></div>
                            <div class="spinner-text">Analizando tu currículum...</div>
                            <div class="spinner-timer">Tiempo restante: <span id="countdown">7</span> segundos</div>
                        </div>
                    `;
                }
                
                // Mostrar el modal
                progressModal.style.display = 'flex';
                
                // Iniciar el contador regresivo
                let segundosRestantes = 7;
                const countdownElement = document.getElementById('countdown');
                
                const contador = setInterval(function() {
                    segundosRestantes--;
                    
                    if (countdownElement) {
                        countdownElement.textContent = segundosRestantes;
                    }
                    
                    // Actualizar el texto según el progreso
                    const spinnerText = document.querySelector('.spinner-text');
                    if (spinnerText) {
                        if (segundosRestantes <= 6 && segundosRestantes > 4) {
                            spinnerText.textContent = 'Procesando estructura del CV...';
                        } else if (segundosRestantes <= 4 && segundosRestantes > 2) {
                            spinnerText.textContent = 'Evaluando contenido...';
                        } else if (segundosRestantes <= 2) {
                            spinnerText.textContent = 'Generando recomendaciones...';
                        }
                    }
                    
                    // Cuando el contador llega a cero, enviar el formulario
                    if (segundosRestantes <= 0) {
                        clearInterval(contador);
                        uploadForm.submit();
                    }
                }, 1000);
            } else {
                // Si no hay modal, enviar directamente
                uploadForm.submit();
            }
        });
    }
    
    // Inicializar pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const tabId = this.getAttribute('data-tab') || this.textContent.trim().toLowerCase();
                openTab(e, tabId);
            });
        });
    }
});

// Función para formatear el tamaño del archivo
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Función para eliminar el archivo
function removeFile() {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileMessage = document.querySelector('.file-message');
    
    if (fileInput) fileInput.value = '';
    if (fileInfo) {
        fileInfo.innerHTML = '';
        fileInfo.style.display = 'none';
    }
    if (fileMessage) fileMessage.style.display = 'block';
}

// Función para cambiar de pestaña
function openTab(event, tabId) {
    // Ocultar todos los contenidos de pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function(content) {
        content.classList.remove('active');
    });
    
    // Desactivar todos los botones de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(function(button) {
        button.classList.remove('active');
    });
    
    // Mostrar el contenido de la pestaña seleccionada
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar el botón de la pestaña seleccionada
    if (event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Función para copiar una recomendación
function copiarRecomendacion(boton, texto) {
    // Usamos un textarea temporal para copiar texto con formato
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Cambiar el ícono temporalmente
    const iconoOriginal = boton.innerHTML;
    boton.innerHTML = '<i class="fas fa-check"></i>';
    
    setTimeout(function() {
        boton.innerHTML = iconoOriginal;
    }, 2000);
}
// Sistema de tooltips para la tabla de resultados
document.addEventListener('DOMContentLoaded', function() {
    // Crear el tooltip como un elemento fijo en el DOM
    if (!document.getElementById('custom-tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            width: 350px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.95);
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s ease;
            transform: translateY(10px);
            line-height: 1.5;
        `;
        document.body.appendChild(tooltip);
    }
    
    const tooltip = document.getElementById('custom-tooltip');
    
    // Función para mostrar los tooltips
    function showTooltip(seccion, puntos, elemento) {
        // Calcular porcentaje
        const [obtenidos, total] = puntos.split('/').map(n => parseInt(n.trim()));
        const porcentaje = (obtenidos / total) * 100;
        
        // Determinar icono y mensaje según la sección y puntuación
        let icono = '';
        let mensaje = '';
        let iconoColor = '';
        
        if (porcentaje < 40) {
            icono = '<i class="fas fa-exclamation-triangle"></i>';
            iconoColor = '#FF453A';
        } else if (porcentaje < 70) {
            icono = '<i class="fas fa-exclamation-circle"></i>';
            iconoColor = '#FFD60A';
        } else {
            icono = '<i class="fas fa-check-circle"></i>';
            iconoColor = '#30D158';
        }
        
        // Corrección para la sección Perfil
        if (seccion === "Perfil") {
            if (porcentaje < 40) {
                mensaje = "Tu perfil profesional necesita una mejora significativa. Añade un resumen claro de 3-5 líneas que destaque tus principales fortalezas y experiencia relevante para el puesto.";
            } else if (porcentaje < 70) {
                mensaje = "Tu perfil es básico pero funcional. Para mejorarlo, personalízalo según el puesto específico, destacando experiencias y habilidades directamente relevantes.";
            } else {
                mensaje = "Excelente perfil profesional. Comunica claramente tu propuesta de valor y está bien alineado con el puesto. Es conciso pero informativo, destacando tus fortalezas clave.";
                
                // Si tiene perfil excelente pero puntuación < 15, mejorar
                if (porcentaje >= 70 && porcentaje < 95) {
                    setTimeout(() => {
                        // Si tiene perfil realmente completo y bien estructurado (emojis, nombre, rol al inicio)
                        let perfilCompleto = tiene_emojis && 
                                            texto_cv.toLowerCase().includes("perfil") &&
                                            texto_cv.split('\n').slice(0, 5).join(' ').length > 100;
                        
                        if (perfilCompleto) {
                            // Actualizar a 15/15
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement) {
                                puntosElement.textContent = "15 / 15";
                            }
                            
                            // Actualizar la barra de progreso
                            const progressElement = elemento.querySelector('.progress');
                            if (progressElement) {
                                progressElement.style.width = "100%";
                            }
                            
                            // Actualizar el mensaje de feedback
                            const feedbackElement = elemento.querySelector('td:nth-child(4)');
                            if (feedbackElement) {
                                feedbackElement.innerHTML = "✅ Excelente";
                            }
                            
                            // Cambiar el color de la fila a verde
                            elemento.classList.remove('bajo', 'medio');
                            elemento.classList.add('alto');
                        }
                    }, 100);
                }
            }
        } 
        // Corrección para la sección Educación
        else if (seccion === "Educación") {
            if (porcentaje < 40) {
                mensaje = "La sección de educación requiere más detalles. Incluye el nombre completo de las instituciones, titulaciones obtenidas, fechas precisas y cursos relevantes para el puesto.";
            } else if (porcentaje < 70) {
                mensaje = "Tu sección de educación contiene información básica pero podría ser más completa. Añade especialización, logros académicos destacados o proyectos relevantes.";
            } else {
                mensaje = "Muy buena sección de educación con detalles completos de tu formación. La información está bien estructurada y destaca aspectos relevantes para el puesto.";
                
                // Si tiene educación bien detallada pero puntuación < 15, mejorar
                if (porcentaje >= 70 && porcentaje < 95) {
                    setTimeout(() => {
                        const educacionCompleta = texto_cv.match(/universidad|máster|grado|licenciatura|ingenier[íi]a|doctorado/gi);
                        
                        if (educacionCompleta && educacionCompleta.length >= 2) {
                            // Actualizar a 15/15
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement) {
                                puntosElement.textContent = "15 / 15";
                            }
                            
                            // Actualizar la barra de progreso
                            const progressElement = elemento.querySelector('.progress');
                            if (progressElement) {
                                progressElement.style.width = "100%";
                            }
                            
                            // Actualizar el mensaje de feedback
                            const feedbackElement = elemento.querySelector('td:nth-child(4)');
                            if (feedbackElement) {
                                feedbackElement.innerHTML = "✅ Excelente";
                            }
                            
                            // Cambiar el color de la fila a verde
                            elemento.classList.remove('bajo', 'medio');
                            elemento.classList.add('alto');
                        }
                    }, 100);
                }
            }
        }
        // Corrección para la sección Educación
        else if (seccion === "Habilidades") {
            if (porcentaje < 40) {
                mensaje = "Tu sección de habilidades necesita una mejora importante. Organiza las habilidades por categorías (técnicas, herramientas, metodologías) y asegúrate de incluir aquellas más relevantes para el puesto.";
            } else if (porcentaje < 70) {
                mensaje = "Tu sección de habilidades está presente pero podría optimizarse. Prioriza las habilidades más relevantes para el puesto y considera agruparlas por categorías para mejorar la legibilidad.";
            } else {
                mensaje = "Excelente sección de habilidades, bien organizada y completa. Las habilidades listadas son altamente relevantes para el puesto y la categorización facilita la lectura.";
                
                // Si tiene habilidades bien organizadas pero puntuación < 15, mejorar
                if (porcentaje >= 70 && porcentaje < 95) {
                    setTimeout(() => {
                        const habilidadesCompletas = texto_cv.match(/lenguajes|frameworks|librerías|herramientas|tecnologías|stack|skills/gi);
                        const tieneViñetas = texto_cv.match(/•|✓|✅|✔|■|◆|★|►|-\s/g);
                        
                        if (habilidadesCompletas && habilidadesCompletas.length >= 2 && tieneViñetas && tieneViñetas.length > 5) {
                            // Actualizar a 15/15
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement) {
                                puntosElement.textContent = "15 / 15";
                            }
                            
                            // Actualizar la barra de progreso
                            const progressElement = elemento.querySelector('.progress');
                            if (progressElement) {
                                progressElement.style.width = "100%";
                            }
                            
                            // Actualizar el mensaje de feedback
                            const feedbackElement = elemento.querySelector('td:nth-child(4)');
                            if (feedbackElement) {
                                feedbackElement.innerHTML = "✅ Excelente";
                            }
                            
                            // Cambiar el color de la fila a verde
                            elemento.classList.remove('bajo', 'medio');
                            elemento.classList.add('alto');
                        }
                    }, 100);
                }
            }
        }
        else if (seccion === "Experiencia") {
            if (porcentaje < 40) {
                mensaje = "La sección de experiencia profesional necesita más detalle. Estructura cada posición con: cargo, empresa, fechas, responsabilidades clave y logros medibles. Utiliza verbos de acción y cuantifica resultados.";
            } else if (porcentaje < 70) {
                mensaje = "Tu experiencia profesional está descrita de manera básica. Mejora enfocándote en resultados y logros cuantificables en lugar de solo responsabilidades. Destaca proyectos exitosos y contribuciones.";
            } else {
                mensaje = "Experiencia profesional muy bien detallada con logros cuantificables. La estructura es clara y la progresión profesional evidente. Demuestra claramente tu capacidad para generar resultados.";
                
                // Si tiene experiencia bien detallada pero puntuación < 15, mejorar
                if (porcentaje >= 70 && porcentaje < 95) {
                    setTimeout(() => {
                        const tieneEmpresas = texto_cv.match(/S\.A\.|S\.L\.|Inc\.|Ltd\.|LLC|GmbH|Corp/g);
                        const tieneFechas = texto_cv.match(/20\d\d\s*[-–]\s*(20\d\d|presente|actualidad|actual|present)/gi);
                        const tieneLogros = texto_cv.match(/\d+%|reduc|aument|implement|desarroll|liderad/gi);
                        
                        if ((tieneEmpresas || tieneFechas) && tieneLogros && tieneLogros.length > 2) {
                            // Actualizar a 15/15 o al menos mejorar a 14/15
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement) {
                                const puntosActuales = parseInt(puntosElement.textContent);
                                if (puntosActuales < 14) {
                                    puntosElement.textContent = "14 / 15";
                                    
                                    // Actualizar la barra de progreso
                                    const progressElement = elemento.querySelector('.progress');
                                    if (progressElement) {
                                        progressElement.style.width = "93%";
                                    }
                                    
                                    // Actualizar el mensaje de feedback
                                    const feedbackElement = elemento.querySelector('td:nth-child(4)');
                                    if (feedbackElement) {
                                        feedbackElement.innerHTML = "✅ Muy bueno";
                                    }
                                    
                                    // Cambiar el color de la fila a verde
                                    elemento.classList.remove('bajo', 'medio');
                                    elemento.classList.add('alto');
                                }
                            }
                        }
                    }, 100);
                }
            }
        }
        else if (seccion === "Certificados") {
            // Extraer los puntos actuales de la sección
            const [puntosActuales, puntosTotales] = puntos.split('/').map(n => parseInt(n.trim()));
            
            // Cálculo de porcentaje correcto
            const porcentajeReal = (puntosActuales / puntosTotales) * 100;
            
            // Determinación del mensaje basado en el porcentaje real
            if (porcentajeReal >= 90) {
                mensaje = "Excelentes certificaciones, actualizadas y altamente relevantes para el puesto. Demuestran compromiso con el desarrollo profesional y validación formal de tus conocimientos técnicos.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 70) {
                mensaje = "Buenas certificaciones. Podrías complementar con más específicas para el puesto. Las certificaciones reconocidas en la industria mejoran significativamente tu perfil.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 50) {
                mensaje = "Certificaciones básicas presentes. Para destacar, añade certificaciones más relevantes y actuales relacionadas con las tecnologías clave del puesto.";
                icono = '<i class="fas fa-exclamation-circle"></i>';
                iconoColor = '#FFD60A';
            } else {
                mensaje = "Faltan certificaciones relevantes. Incluye certificaciones actuales relacionadas con el puesto, especificando institución emisora y fecha de obtención.";
                icono = '<i class="fas fa-exclamation-triangle"></i>';
                iconoColor = '#FF453A';
            }
            
            // Verificar si hay inconsistencia entre el puntaje visual y el texto
            const feedbackElement = elemento.querySelector('td:nth-child(4)');
            if (feedbackElement) {
                const feedbackActual = feedbackElement.textContent.trim();
                
                // Si hay una inconsistencia grave (ej: puntuación alta con mensaje deficiente)
                if (porcentajeReal >= 70 && feedbackActual.includes("Deficiente")) {
                    // Corrección inmediata del feedback para alinearlo con la puntuación real
                    setTimeout(() => {
                        if (feedbackElement) {
                            if (porcentajeReal >= 90) {
                                feedbackElement.innerHTML = "✅ Excelente: Certificaciones completas y relevantes";
                            } else if (porcentajeReal >= 70) {
                                feedbackElement.innerHTML = "✅ Bueno: Complementa con más certificaciones";
                            }
                            
                            // Actualizar clases para colores correctos
                            elemento.classList.remove('bajo');
                            elemento.classList.add('alto');
                        }
                    }, 50);
                }
                // Caso inverso: puntuación baja con mensaje excelente
                else if (porcentajeReal < 50 && feedbackActual.includes("Excelente")) {
                    setTimeout(() => {
                        if (feedbackElement) {
                            feedbackElement.innerHTML = "❌ Deficiente: Añade certificaciones relevantes";
                            
                            // Actualizar clases para colores correctos
                            elemento.classList.remove('alto');
                            elemento.classList.add('bajo');
                        }
                    }, 50);
                }
            }
        }
        else if (seccion === "Idiomas") {
            // Extraer los puntos actuales de la sección
            const [puntosActuales, puntosTotales] = puntos.split('/').map(n => parseInt(n.trim()));
            
            // Cálculo de porcentaje correcto
            const porcentajeReal = (puntosActuales / puntosTotales) * 100;
            
            // Determinación del mensaje basado en el porcentaje real
            if (porcentajeReal >= 90) {
                mensaje = "Excelente sección de idiomas con niveles claramente especificados según estándares reconocidos. El dominio lingüístico demostrado es adecuado para las exigencias del puesto y potencia tu perfil internacional.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 70) {
                mensaje = "Buena información de idiomas. Para mejorar, especifica niveles según marcos reconocidos (A1-C2) y menciona experiencias prácticas como redacción técnica o participación en reuniones internacionales.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 50) {
                mensaje = "Información básica de idiomas presente. Es importante detallar mejor tus niveles en cada idioma y destacar tu dominio del inglés técnico, esencial para roles en tecnología.";
                icono = '<i class="fas fa-exclamation-circle"></i>';
                iconoColor = '#FFD60A';
            } else {
                mensaje = "Falta información detallada sobre idiomas. Añade todos los idiomas que dominas con niveles específicos (A1-C2 o básico/intermedio/avanzado/nativo). El inglés es especialmente importante en roles técnicos.";
                icono = '<i class="fas fa-exclamation-triangle"></i>';
                iconoColor = '#FF453A';
            }
            
            // Verificar si hay inconsistencia entre el puntaje visual y el texto
            const feedbackElement = elemento.querySelector('td:nth-child(4)');
            if (feedbackElement) {
                const feedbackActual = feedbackElement.textContent.trim();
                
                // Si hay una inconsistencia grave (ej: puntuación alta con mensaje deficiente)
                if (porcentajeReal >= 70 && feedbackActual.includes("Deficiente")) {
                    // Corrección inmediata del feedback para alinearlo con la puntuación real
                    setTimeout(() => {
                        if (feedbackElement) {
                            if (porcentajeReal >= 90) {
                                feedbackElement.innerHTML = "✅ Excelente: Niveles de idiomas claramente especificados";
                            } else if (porcentajeReal >= 70) {
                                feedbackElement.innerHTML = "✅ Bueno: Detalla competencias específicas";
                            }
                            
                            // Actualizar clases para colores correctos
                            elemento.classList.remove('bajo');
                            elemento.classList.add('alto');
                        }
                    }, 50);
                }
                // Caso inverso: puntuación baja con mensaje positivo
                else if (porcentajeReal < 50 && (feedbackActual.includes("Excelente") || feedbackActual.includes("Bueno"))) {
                    setTimeout(() => {
                        if (feedbackElement) {
                            feedbackElement.innerHTML = "❌ Deficiente: Especifica mejor tus niveles de idiomas";
                            
                            // Actualizar clases para colores correctos
                            elemento.classList.remove('alto', 'medio');
                            elemento.classList.add('bajo');
                        }
                    }, 50);
                }
            }
        }

        // Sección de Datos con evaluación MÁS ESTRICTA
        // Modifica esta parte en app.js - función showTooltip
        else if (seccion === "Datos") {
            // Extraer los puntos actuales de la sección
            const [puntosActuales, puntosTotales] = puntos.split('/').map(n => parseInt(n.trim()));
            
            // Cálculo de porcentaje correcto
            const porcentajeReal = (puntosActuales / puntosTotales) * 100;
            
            // Determinación del mensaje basado en la puntuación real
            if (porcentajeReal >= 100) {
                mensaje = "Información de contacto completa y bien presentada. Incluye todos los canales profesionales relevantes y facilita múltiples vías para que los reclutadores te contacten.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 90) {
                mensaje = "Muy buena información de contacto, casi completa. Contiene los elementos esenciales y algún perfil profesional. Para ser excelente, considera añadir más vías de contacto profesional.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 70) {
                mensaje = "Buena información de contacto con datos esenciales. Considera añadir más enlaces a perfiles profesionales como LinkedIn, GitHub o portafolio personal.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 60) {
                mensaje = "Información de contacto básica pero suficiente. Añade perfiles profesionales online (LinkedIn, GitHub) para facilitar que los reclutadores conozcan mejor tu experiencia y proyectos.";
                icono = '<i class="fas fa-exclamation-circle"></i>';
                iconoColor = '#FFD60A';
            } else if (porcentajeReal >= 40) {
                mensaje = "La información de contacto es incompleta. Asegúrate de incluir al menos tu nombre completo, email profesional, teléfono y algún perfil en redes profesionales como LinkedIn.";
                icono = '<i class="fas fa-exclamation-circle"></i>';
                iconoColor = '#FFD60A';
            } else {
                mensaje = "La información de contacto es insuficiente. Asegúrate de incluir email profesional, teléfono, ubicación, LinkedIn actualizado y GitHub para roles técnicos. Esta información debe ser fácilmente visible.";
                icono = '<i class="fas fa-exclamation-triangle"></i>';
                iconoColor = '#FF453A';
            }
            
            // Verificar contenido real del CV mediante la vista previa
            const previewContainer = document.querySelector('.preview-container pre');
            if (previewContainer) {
                const textoCV = previewContainer.textContent || '';
                
                // Detección más estricta y detallada de elementos de contacto
                const tieneNombreCompleto = /Nombre\s*:\s*[A-Z][a-z]+/.test(textoCV) || /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(textoCV);
                const tieneEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(textoCV);
                const tieneTelefono = /(\+\d{1,3}[ -]?)?(\(\d{1,3}\)[ -]?)?\d{3}[ -]?\d{3,4}[ -]?\d{3,4}/.test(textoCV);
                const tieneLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(textoCV.toLowerCase());
                const tieneGitHub = /github\.com\/[a-zA-Z0-9_-]+/.test(textoCV.toLowerCase());
                const tieneWeb = /(portfolio|portafolio|web|website|sitio|blog)[:;\s]+[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(textoCV.toLowerCase());
                const tieneUbicacion = /(ciudad|ubicación|location|dirección|address|city)[:;]?\s*[A-Z][a-zA-Z]+|[📍🌍🌎🌏🏙️]\s*[A-Z][a-zA-Z]+/.test(textoCV);
                
                // Contar perfiles profesionales
                const perfilesCount = [tieneLinkedIn, tieneGitHub, tieneWeb].filter(Boolean).length;
                
                // Calcular un puntaje real basado en lo que tiene
                let puntajeCalculado = 0;
                if (tieneNombreCompleto) puntajeCalculado += 2;
                if (tieneEmail) puntajeCalculado += 2;
                if (tieneTelefono) puntajeCalculado += 1.5;
                if (tieneLinkedIn) puntajeCalculado += 1.5;
                if (tieneGitHub) puntajeCalculado += 1;
                if (tieneWeb) puntajeCalculado += 1;
                if (tieneUbicacion) puntajeCalculado += 1;
                
                // Asegurar que el puntaje no exceda el máximo
                puntajeCalculado = Math.min(10, Math.round(puntajeCalculado));
                
                // Log para debugging
                console.log("Datos detectados:", {
                    tieneNombreCompleto, tieneEmail, tieneTelefono, tieneLinkedIn, 
                    tieneGitHub, tieneWeb, tieneUbicacion, puntajeCalculado
                });
                
                // Determinar mensaje basado en contenido real
                if (puntajeCalculado <= 5) {
                    mensaje = "La información de contacto es básica o incompleta. Asegúrate de incluir al menos nombre completo, email profesional, teléfono y algún perfil en redes profesionales como LinkedIn.";
                    iconoColor = '#FFD60A';
                    icono = '<i class="fas fa-exclamation-circle"></i>';
                } else if (puntajeCalculado <= 7) {
                    mensaje = "Información de contacto básica pero suficiente. Añade perfiles profesionales online (LinkedIn, GitHub) para facilitar que los reclutadores conozcan mejor tu experiencia y proyectos.";
                    iconoColor = '#FFD60A';
                    icono = '<i class="fas fa-exclamation-circle"></i>';
                } else {
                    mensaje = "Buena información de contacto con los elementos esenciales. Incluye múltiples vías de contacto profesional, lo que facilita que los reclutadores te localicen.";
                    iconoColor = '#30D158';
                    icono = '<i class="fas fa-check-circle"></i>';
                }
                
                // Corregir casos específicos
                if (tieneNombreCompleto && tieneEmail && tieneTelefono && perfilesCount === 0) {
                    // Tiene lo básico sin perfiles profesionales (caso común)
                    mensaje = "Información de contacto básica pero suficiente. Añade perfiles profesionales online (LinkedIn, GitHub) para facilitar que los reclutadores conozcan mejor tu experiencia y proyectos.";
                    iconoColor = '#FFD60A';
                    icono = '<i class="fas fa-exclamation-circle"></i>';
                    
                    // ELIMINAR BLOQUE DE MODIFICACIÓN DE UI
                    /*
                    const feedbackElement = elemento.querySelector('td:nth-child(4)');
                    if (feedbackElement) {
                        const feedbackActual = feedbackElement.textContent || '';
                        const puntosElement = elemento.querySelector('td:nth-child(2)');
                        
                        if (feedbackActual.includes("Excelente") || porcentajeReal > 80) {
                            setTimeout(() => {
                                if (puntosElement && parseInt(puntosElement.textContent) > 7) {
                                    puntosElement.textContent = "7 / 10";
                                    
                                    const progressElement = elemento.querySelector('.progress');
                                    if (progressElement) {
                                        progressElement.style.width = "70%";
                                    }
                                }
                                
                                feedbackElement.innerHTML = "⚠️ Aceptable: Información básica, añade perfiles profesionales";
                                elemento.classList.remove('alto');
                                elemento.classList.add('medio');
                            }, 50);
                        }
                    }
                    */
                }
                // Si no tiene email o teléfono, esto es un problema serio
                else if (!tieneEmail || !tieneTelefono) {
                    mensaje = "La información de contacto es incompleta. Asegúrate de incluir al menos tu nombre completo, email profesional y teléfono. Estos son elementos esenciales para que los reclutadores puedan contactarte.";
                    iconoColor = '#FF453A';
                    icono = '<i class="fas fa-exclamation-triangle"></i>';
                    
                    // ELIMINAR BLOQUE DE MODIFICACIÓN DE UI
                    /*
                    const feedbackElement = elemento.querySelector('td:nth-child(4)');
                    if (feedbackElement && !feedbackElement.textContent.includes("Deficiente")) {
                        setTimeout(() => {
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement && parseInt(puntosElement.textContent) > 5) {
                                puntosElement.textContent = "4 / 10";
                                
                                const progressElement = elemento.querySelector('.progress');
                                if (progressElement) {
                                    progressElement.style.width = "40%";
                                }
                            }
                            
                            feedbackElement.innerHTML = "❌ Deficiente: Información de contacto incompleta";
                            elemento.classList.remove('alto', 'medio');
                            elemento.classList.add('bajo');
                        }, 50);
                    }
                    */
                }
                // Si tiene perfiles profesionales completos, es una buena sección
                else if (perfilesCount >= 2 && tieneNombreCompleto && tieneEmail && tieneTelefono) {
                    mensaje = "Excelente información de contacto completa y bien presentada. Incluye múltiples vías profesionales de contacto, facilitando que los reclutadores te conozcan y contacten fácilmente.";
                    iconoColor = '#30D158';
                    icono = '<i class="fas fa-check-circle"></i>';
                    
                    // ELIMINAR BLOQUE DE MODIFICACIÓN DE UI
                    /*
                    const feedbackElement = elemento.querySelector('td:nth-child(4)');
                    if (feedbackElement && (feedbackElement.textContent.includes("Deficiente") || feedbackElement.textContent.includes("Regular"))) {
                        setTimeout(() => {
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement && parseInt(puntosElement.textContent) < 8) {
                                puntosElement.textContent = "9 / 10";
                                
                                const progressElement = elemento.querySelector('.progress');
                                if (progressElement) {
                                    progressElement.style.width = "90%";
                                }
                            }
                            
                            feedbackElement.innerHTML = "✅ Excelente: Información de contacto completa y bien presentada";
                            elemento.classList.remove('bajo', 'medio');
                            elemento.classList.add('alto');
                        }, 50);
                    }
                    */
                }
                
                // ELIMINAR BLOQUE DE MODIFICACIÓN DE UI PARA CASO 10/10
                /*
                if (porcentajeReal === 100) {
                    const feedbackElement = elemento.querySelector('td:nth-child(4)');
                    const realmenteExcelente = tieneNombreCompleto && tieneEmail && tieneTelefono && perfilesCount >= 1;
                    
                    if (!realmenteExcelente) {
                        setTimeout(() => {
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement) {
                                puntosElement.textContent = "6 / 10";
                                
                                const progressElement = elemento.querySelector('.progress');
                                if (progressElement) {
                                    progressElement.style.width = "60%";
                                }
                            }
                            
                            if (feedbackElement) {
                                feedbackElement.innerHTML = "⚠️ Aceptable: Información básica, añade perfiles profesionales";
                                elemento.classList.remove('alto');
                                elemento.classList.add('medio');
                            }
                        }, 50);
                    }
                }
                */
            }
            
            // ELIMINAR BLOQUE DE MODIFICACIÓN DE UI PARA CASO 10/10
            /*
            if (porcentajeReal === 100) {
                const feedbackElement = elemento.querySelector('td:nth-child(4)');
                if (feedbackElement && !feedbackElement.textContent.includes("Excelente")) {
                    setTimeout(() => {
                        feedbackElement.innerHTML = "✅ Excelente: Información de contacto completa y bien presentada";
                        elemento.classList.remove('bajo', 'medio');
                        elemento.classList.add('alto');
                    }, 50);
                }
            }
            */
        }


        else if (seccion === "Formato") {
            // Extraer los puntos actuales de la sección
            const [puntosActuales, puntosTotales] = puntos.split('/').map(n => parseInt(n.trim()));
            
            // Cálculo de porcentaje correcto
            const porcentajeReal = (puntosActuales / puntosTotales) * 100;
            
            // Determinación del mensaje basado en el porcentaje real
            if (porcentajeReal >= 90) {
                mensaje = "Excelente formato, profesional y bien estructurado. Es visualmente atractivo y prioriza eficazmente la información más relevante. La consistencia visual facilita la lectura rápida del CV.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 70) {
                mensaje = "Buen formato, claro y organizado. Para mejorar aún más, considera ajustar la consistencia visual y optimizar el uso del espacio para destacar tus logros y habilidades más relevantes.";
                icono = '<i class="fas fa-check-circle"></i>';
                iconoColor = '#30D158';
            } else if (porcentajeReal >= 50) {
                mensaje = "Formato aceptable pero mejorable. Trabaja en la consistencia visual (espaciado, fuentes, estilo), uso de viñetas para facilitar el escaneo rápido, y priorización de información relevante.";
                icono = '<i class="fas fa-exclamation-circle"></i>';
                iconoColor = '#FFD60A';
            } else {
                mensaje = "El formato de tu CV necesita una mejora significativa. Utiliza una estructura clara con secciones bien definidas, viñetas para facilitar la lectura, espaciado consistente, y limita la extensión a 1-2 páginas.";
                icono = '<i class="fas fa-exclamation-triangle"></i>';
                iconoColor = '#FF453A';
            }
            
            // Verificar el contenido real del CV para detectar características específicas de formato
            const previewContainer = document.querySelector('.preview-container pre');
            if (previewContainer) {
                const textoCV = previewContainer.textContent || '';
                
                // Detectar características de formato
                const tieneSeccionesClaras = /\n[A-ZÑÁÉÍÓÚ][A-ZÑÁÉÍÓÚa-zñáéíóú\s]+\n/.test(textoCV);
                const tieneViñetas = textoCV.includes('• ') || textoCV.includes('- ') || textoCV.includes('* ') || textoCV.includes('◦ ') || textoCV.includes('▪ ');
                const tieneEspaciado = textoCV.includes('\n\n');
                const tieneEmojis = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(textoCV);
                const tieneFormatoModerno = tieneEmojis || /\|\s+\|/.test(textoCV);
                
                // CV con buen formato pero puntuación baja
                if ((tieneSeccionesClaras && tieneViñetas && tieneEspaciado) || tieneFormatoModerno) {
                    // Si tiene buen formato real pero puntuación baja, ajustar mensaje y verificar UI
                    if (porcentajeReal < 60) {
                        mensaje = "El formato tiene elementos positivos como secciones claras y uso de viñetas. Para mejorar, trabaja en la consistencia visual y asegúrate de priorizar la información más relevante.";
                        iconoColor = '#FFD60A';
                        icono = '<i class="fas fa-exclamation-circle"></i>';
                        
                        // Verificar si hay inconsistencia con UI y corregirla
                        const feedbackElement = elemento.querySelector('td:nth-child(4)');
                        if (feedbackElement && feedbackElement.textContent.includes("Deficiente")) {
                            setTimeout(() => {
                                feedbackElement.innerHTML = "⚠️ Regular: Algunos elementos necesitan mejora";
                                
                                // Actualizar visualmente la puntuación si es muy baja
                                const puntosElement = elemento.querySelector('td:nth-child(2)');
                                if (puntosElement && parseInt(puntosElement.textContent) < 4) {
                                    puntosElement.textContent = "5 / 10";
                                    
                                    // Actualizar la barra de progreso
                                    const progressElement = elemento.querySelector('.progress');
                                    if (progressElement) {
                                        progressElement.style.width = "50%";
                                    }
                                }
                                
                                elemento.classList.remove('bajo');
                                elemento.classList.add('medio');
                            }, 50);
                        }
                    }
                    
                    // Si tiene formato moderno (con emojis) pero puntuación media, mejorar a bueno
                    if (tieneFormatoModerno && porcentajeReal >= 50 && porcentajeReal < 70) {
                        mensaje = "Buen formato con elementos modernos como emojis o estructura visual atractiva. Esto facilita la lectura y demuestra atención al detalle en la presentación.";
                        iconoColor = '#30D158';
                        icono = '<i class="fas fa-check-circle"></i>';
                        
                        // Verificar si hay inconsistencia con UI y corregirla
                        const feedbackElement = elemento.querySelector('td:nth-child(4)');
                        if (feedbackElement && !feedbackElement.textContent.includes("Bueno")) {
                            setTimeout(() => {
                                // Actualizar visualmente la puntuación a un mejor valor
                                const puntosElement = elemento.querySelector('td:nth-child(2)');
                                if (puntosElement) {
                                    // Si la puntuación es < 7, actualizar a 7/10
                                    if (parseInt(puntosElement.textContent) < 7) {
                                        puntosElement.textContent = "7 / 10";
                                        
                                        // Actualizar la barra de progreso
                                        const progressElement = elemento.querySelector('.progress');
                                        if (progressElement) {
                                            progressElement.style.width = "70%";
                                        }
                                        
                                        feedbackElement.innerHTML = "✅ Bueno: Formato moderno";
                                        elemento.classList.remove('bajo', 'medio');
                                        elemento.classList.add('alto');
                                    }
                                }
                            }, 50);
                        }
                    }
                }
                
                // CV con formato pobre pero puntuación alta (caso de inconsistencia)
                if (!tieneSeccionesClaras && !tieneViñetas && porcentajeReal > 70) {
                    mensaje = "El formato necesita mejoras importantes. Estructura el CV con secciones claramente definidas y usa viñetas para facilitar la lectura rápida de la información.";
                    iconoColor = '#FF453A';
                    icono = '<i class="fas fa-exclamation-triangle"></i>';
                    
                    // Verificar si hay inconsistencia con UI y corregirla
                    const feedbackElement = elemento.querySelector('td:nth-child(4)');
                    if (feedbackElement && (feedbackElement.textContent.includes("Excelente") || feedbackElement.textContent.includes("Bueno"))) {
                        setTimeout(() => {
                            feedbackElement.innerHTML = "❌ Deficiente: Requiere revisión de estructura";
                            
                            // Actualizar visualmente la puntuación
                            const puntosElement = elemento.querySelector('td:nth-child(2)');
                            if (puntosElement) {
                                puntosElement.textContent = "3 / 10";
                                
                                // Actualizar la barra de progreso
                                const progressElement = elemento.querySelector('.progress');
                                if (progressElement) {
                                    progressElement.style.width = "30%";
                                }
                            }
                            
                            elemento.classList.remove('alto', 'medio');
                            elemento.classList.add('bajo');
                        }, 50);
                    }
                }
            }
        }
        
        // Actualizar contenido del tooltip con diseño similar a la imagen
        tooltip.innerHTML = `
            <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                <span style="color: ${iconoColor}; font-size: 18px; margin-right: 10px;">${icono}</span>
                <div style="font-weight: 500; font-size: 16px;">${seccion}</div>
            </div>
            <div style="color: rgba(255, 255, 255, 0.85); line-height: 1.6; font-size: 14px;">
                ${mensaje}
            </div>
        `;
        
        // Posicionar tooltip alineado con la fila y ligeramente por encima
        const rect = elemento.getBoundingClientRect();
        
        // Calcular posición óptima (siempre a la derecha)
        let leftPos = rect.right + 20;

        // Comprobar el ancho de la ventana para confirmar que hay espacio
        const windowWidth = window.innerWidth;
        const tableRect = document.querySelector('.tabla-resultados').getBoundingClientRect();
        const availableSpace = windowWidth - tableRect.right;

        console.log('Espacio disponible a la derecha:', availableSpace, 'px');

        // Forzar que siempre aparezca a la derecha si hay al menos 100px disponibles
        if (availableSpace >= 100) {
            // Hay espacio suficiente, colocar a la derecha con margen
            leftPos = rect.right + 20;
        } else {
            // Si realmente no hay espacio, entonces mostrar a la izquierda
            leftPos = rect.left - 370;
            
            // Como última opción, si no hay espacio ni a la izquierda, centrar debajo
            if (leftPos < 10) {
                leftPos = Math.max(20, (tableRect.left + tableRect.right - 350) / 2);
                const offsetY = rect.height + 10; // Mostrar debajo con margen
                tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
            }
        }

        // Posicionar el tooltip ligeramente más arriba que la fila
        const offsetY = -10; // Ajusta este valor para subirlo más o menos

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${rect.top + window.scrollY + offsetY}px`;

        // Mostrar tooltip con animación
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }
    
    // Función para ocultar el tooltip
    function hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        }
    }
    
    // Añadir eventos a las filas de la tabla
    const filas = document.querySelectorAll('.tabla-resultados tbody tr');
    
    filas.forEach(fila => {
        // Hacer que el cursor cambie al pasar sobre la fila
        fila.style.cursor = 'pointer';
        
        fila.addEventListener('mouseenter', function() {
            const seccion = this.querySelector('td:first-child strong').textContent;
            const puntos = this.querySelector('td:nth-child(2)').textContent;
            showTooltip(seccion, puntos, this);
            
            // Resaltar la fila
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        });
        
        fila.addEventListener('mouseleave', function() {
            hideTooltip();
            this.style.backgroundColor = '';
        });
    });
    
    // Ocultar tooltip al hacer scroll
    window.addEventListener('scroll', hideTooltip);
});

// Función adicional para manejar la interacción táctil (para dispositivos móviles)
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el dispositivo es táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Añadir clases específicas para dispositivos táctiles
        document.body.classList.add('touch-device');
        
        // Cambiar comportamiento para mostrar tooltips en dispositivos táctil
        const filas = document.querySelectorAll('.tabla-resultados tbody tr');
        
        filas.forEach(fila => {
            // Eliminar eventos de hover en dispositivos táctiles
            fila.classList.add('touch-row');
            
            // Modificar el evento click para dispositivos táctiles
            const existingClickHandler = fila.onclick;
            fila.onclick = null;
            
            fila.addEventListener('click', function(e) {
                // En dispositivos táctiles, mostrar directamente el modal completo
                mostrarModalDetallado(this);
                
                // Prevenir la propagación del evento
                e.stopPropagation();
            });
        });
    }
});


// Configurar barras de similitud BERT
document.addEventListener('DOMContentLoaded', function() {
    // Barras de progreso normales
    const progressBars = document.querySelectorAll('.progress[data-puntos]');
    progressBars.forEach(function(bar) {
        const puntos = parseFloat(bar.dataset.puntos) || 0;
        const total = parseFloat(bar.dataset.total) || 1;
        const porcentaje = Math.round((puntos / total) * 100 * 10) / 10;
        bar.style.width = porcentaje + '%';
    });
    
    // Barras de similitud BERT
    const similitudBars = document.querySelectorAll('.similitud-bar[data-similitud]');
    similitudBars.forEach(function(bar) {
        const similitud = parseFloat(bar.dataset.similitud) || 0;
        bar.style.width = similitud + '%';
    });
});