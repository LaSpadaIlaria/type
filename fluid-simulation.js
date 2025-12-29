// fluid-simulation.js
(function() {
    console.log("🎮 Caricamento fluid simulation...");
    
    // Attendi che il DOM sia completamente caricato
    document.addEventListener('DOMContentLoaded', function() {
        // Configurazione ottimizzata per la fluid simulation
        const config = {
            id: "smokey-fluid-canvas",
            transparent: true,
            densityDissipation: 0.98,
            velocityDissipation: 0.99,
            pressure: 0.08,
            curl: 15,
            splatRadius: 0.2,
            splatForce: 6000,
            shading: true,
            colorUpdateSpeed: 6,
            paused: false,
            color: [
                [0, 255, 255],    // Ciano
                [255, 0, 255],    // Magenta
                [255, 255, 0]     // Giallo
            ],
            interactive: true,
            cursor: true,
            backColor: [0, 0, 0, 0],
            blendMode: 'screen'
        };
        
        // Carica la libreria
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/smokey-fluid-cursor@latest/dist/index.global.js';
        
        script.onload = function() {
            if (window.SmokyFluid) {
                console.log("✅ Libreria fluid simulation caricata");
                
                // Inizializza la fluid simulation
                const fluidInstance = SmokyFluid.initFluid(config);
                console.log("🎮 Fluid simulation avviata con colori CMYK");
                
                // Variabili per tracciare il mouse
                let lastX = 0, lastY = 0;
                let isMouseMoving = false;
                let mouseTimer;
                
                // Evento per il movimento del mouse - crea effetti fluidi
                document.addEventListener('mousemove', function(e) {
                    const canvas = document.getElementById('smokey-fluid-canvas');
                    if (!canvas || !fluidInstance || !fluidInstance.splat) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    // Calcola la velocità del movimento
                    const dx = e.clientX - lastX;
                    const dy = e.clientY - lastY;
                    const velocity = Math.sqrt(dx * dx + dy * dy);
                    
                    // Crea effetti fluidi solo se il mouse si muove abbastanza veloce
                    if (velocity > 3 && fluidInstance.splat) {
                        const force = Math.min(velocity * 0.2, 8);
                        const colorIndex = Math.floor(Math.random() * 3);
                        
                        // Crea l'effetto fluido
                        fluidInstance.splat(
                            x,
                            y,
                            dx * 0.005,
                            dy * 0.005,
                            config.color[colorIndex]
                        );
                    }
                    
                    lastX = e.clientX;
                    lastY = e.clientY;
                    isMouseMoving = true;
                    
                    // Aggiorna lo stato del mouse
                    clearTimeout(mouseTimer);
                    mouseTimer = setTimeout(() => {
                        isMouseMoving = false;
                    }, 50);
                });
                
                // Click per creare un'esplosione di colori
                document.addEventListener('click', function(e) {
                    const canvas = document.getElementById('smokey-fluid-canvas');
                    if (!canvas || !fluidInstance || !fluidInstance.splat) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    // Crea un'esplosione con tutti e 3 i colori
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            const angle = (i / 3) * Math.PI * 2;
                            fluidInstance.splat(
                                x + Math.cos(angle) * 0.05,
                                y + Math.sin(angle) * 0.05,
                                Math.cos(angle) * 4,
                                Math.sin(angle) * 4,
                                config.color[i]
                            );
                        }, i * 50);
                    }
                });
                
                // Scroll per creare effetti verticali
                window.addEventListener('wheel', function(e) {
                    const canvas = document.getElementById('smokey-fluid-canvas');
                    if (!canvas || !fluidInstance || !fluidInstance.splat) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    const force = Math.min(Math.abs(e.deltaY) * 0.1, 6);
                    const direction = e.deltaY > 0 ? 1 : -1;
                    
                    // Crea l'effetto di scorrimento
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            fluidInstance.splat(
                                x + (Math.random() - 0.5) * 0.1,
                                y + (Math.random() - 0.5) * 0.1,
                                (Math.random() - 0.5) * 2,
                                direction * force,
                                config.color[i % 3]
                            );
                        }, i * 30);
                    }
                }, { passive: true });
                
                // Funzione per controllare l'opacità in base al nodo
                window.controlFluidEffect = function(nodeIndex, totalNodes) {
                    const canvas = document.getElementById('smokey-fluid-canvas');
                    if (!canvas) return;
                    
                    const progress = nodeIndex / (totalNodes - 1);
                    const startOpacity = 0.4;
                    // Effetto di dissolvenza non lineare
                    const opacity = startOpacity * (1 - Math.pow(progress, 1.5));
                    
                    canvas.style.opacity = opacity;
                    
                    // Opzionale: cambia l'intensità in base al nodo
                    if (fluidInstance && fluidInstance.setDensityDissipation) {
                        const newDissipation = 0.96 + progress * 0.1;
                        fluidInstance.setDensityDissipation?.(newDissipation);
                    }
                    
                    console.log(`🎨 Fluid simulation - Nodo ${nodeIndex + 1}/${totalNodes}: opacità = ${(opacity * 100).toFixed(1)}%`);
                    
                    // All'ultimo nodo, scompare completamente
                    if (nodeIndex === totalNodes - 1) {
                        setTimeout(() => {
                            canvas.style.opacity = '0';
                        }, 500);
                    }
                };
                
                // Inizializza con opacità massima
                setTimeout(() => {
                    if (window.controlFluidEffect) {
                        window.controlFluidEffect(0, 26);
                    }
                }, 500);
                
                console.log("✅ Fluid simulation completamente configurata");
                
            } else {
                console.error("❌ Libreria fluid simulation non caricata correttamente");
            }
        };
        
        script.onerror = function() {
            console.error("❌ Errore nel caricamento della libreria fluid simulation");
        };
        
        document.head.appendChild(script);
    });
})();