// ============ PUNTI ORIGINALI ============
const originalPoints = [
    {x: 7853, y: 16849},
    {x: 10975, y: 21322},
    {x: 8947, y: 20178},
    {x: 11477, y: 18139},
    {x: 14239, y: 15658},
    {x: 10053, y: 13004},
    {x: 11477, y: 12162},
    {x: 16828, y: 13392},
    {x: 16577, y: 10112},
    {x: 13297, y: 5602},
    {x: 16577, y: 3789},
    {x: 16828, y: 4933},
    {x: 18166, y: 4291},
    {x: 19547, y: 6341},
    {x: 22309, y: 5602},
    {x: 24165, y: 7285},
    {x: 27035, y: 8105},
    {x: 25028, y: 11911},
    {x: 19798, y: 11409},
    {x: 23294, y: 9610},
    {x: 28861, y: 6783},
    {x: 31530, y: 5184},
    {x: 30516, y: 1861},
    {x: 34055, y: 2854},
    {x: 36321, y: 6532},
    {x: 37616, y: 9861},
    {x: 36688, y: 13011},
    {x: 30516, y: 8607},
    {x: 35372, y: 11544},
    {x: 31638, y: 18139},
    {x: 30265, y: 21613},
    {x: 35121, y: 25044},
    {x: 35833, y: 29619},
    {x: 33654, y: 35308},
    {x: 14492, y: 29676},
    {x: 2784, y: 32222}
];

// ============ VARIABILI GLOBALI ============
let scrollProgress = 0;
let pathPoints = [];
let smoothPath = [];
let pathLength = 0;

// Sistema di nodi
let nodes = [];
let currentNodeIndex = 0;

// Sistema di movimento
let movementState = 'STOPPED'; // 'STOPPED', 'MOVING_TO_NODE'
let targetNodeIndex = 0;
const MOVEMENT_SPEED = 0.15; // Velocità normale fissa

// Variabili per le immagini di tutti i nodi
let nodoImages = {}; // Oggetto per tutte le immagini
let showNodoImages = {}; // Oggetto per controllare quali immagini mostrare
let nodoImageAlphas = {}; // Oggetto per le alphas di ogni immagine
const NODO_IMAGE_TARGET_ALPHA = 200;
const NODO_IMAGE_FADE_SPEED = 5;

// Impostazioni per le immagini
const NODO_IMAGE_SETTINGS = {
    // Nodo 1 (indice 1)
    1: {
        offsetX: -9800,
        offsetY: -4000,
        scale: 8
    },
    // Nodo 2 (indice 2)
    2: {
        offsetX: -5000,
        offsetY: -3000,
        scale: 6
    },
    // Nodo 3 (indice 3)
    3: {
        offsetX: -4000,
        offsetY: -2000,
        scale: 6
    },
    // Nodo 4 (indice 4)
    4: {
        offsetX: -3000,
        offsetY: -1500,
        scale: 5
    },
    // Nodo 5 (indice 5)
    5: {
        offsetX: -2000,
        offsetY: -1000,
        scale: 5
    },
    // Nodo 6 (indice 6)
    6: {
        offsetX: -1500,
        offsetY: -800,
        scale: 4.5
    },
    // Nodo 7 (indice 7)
    7: {
        offsetX: -1200,
        offsetY: -600,
        scale: 4.5
    },
    // Nodo 8 (indice 8)
    8: {
        offsetX: -3500,
        offsetY: 500,
        scale: 8
    },
    // Nodo 9 (indice 9)
    9: {
        offsetX: -1000,
        offsetY: -400,
        scale: 4
    },
    // Nodo 10 (indice 10)
    10: {
        offsetX: -800,
        offsetY: -300,
        scale: 4
    },
    // Nodo 11 (indice 11)
    11: {
        offsetX: -600,
        offsetY: -200,
        scale: 3.5
    },
    // Nodo 12 (indice 12)
    12: {
        offsetX: -400,
        offsetY: -150,
        scale: 3.5
    },
    // Nodo 13 (indice 13)
    13: {
        offsetX: -300,
        offsetY: -100,
        scale: 3
    },
    // Nodo 14 (indice 14)
    14: {
        offsetX: -200,
        offsetY: -80,
        scale: 3
    },
    // Nodo 15 (indice 15)
    15: {
        offsetX: -150,
        offsetY: -60,
        scale: 2.5
    },
    // Nodo 16 (indice 16)
    16: {
        offsetX: 1000,
        offsetY: -450,
        scale: 8
    },
    // Nodo 17 (indice 17)
    17: {
        offsetX: 1500,
        offsetY: -300,
        scale: 2.5
    },
    // Nodo 18 (indice 18)
    18: {
        offsetX: 1800,
        offsetY: -200,
        scale: 2.5
    },
    // Nodo 19 (indice 19)
    19: {
        offsetX: 2000,
        offsetY: -150,
        scale: 2
    },
    // Nodo 20 (indice 20)
    20: {
        offsetX: 2200,
        offsetY: -100,
        scale: 2
    },
    // Nodo 21 (indice 21)
    21: {
        offsetX: 2400,
        offsetY: -80,
        scale: 1.8
    },
    // Nodo 22 (indice 22)
    22: {
        offsetX: 2600,
        offsetY: -60,
        scale: 1.8
    },
    // Nodo 23 (indice 23)
    23: {
        offsetX: 2800,
        offsetY: -40,
        scale: 1.5
    },
    // Nodo 24 (indice 24)
    24: {
        offsetX: 3000,
        offsetY: -20,
        scale: 1.5
    }
};

// Inizializza gli oggetti per le immagini
for (let i = 1; i <= 24; i++) {
    showNodoImages[i] = false;
    nodoImageAlphas[i] = 0;
}

// Particelle per effetto stellato (sostituiscono gli sfondi)
let starParticles = [];
const STAR_COUNT = 100;

// --- DESCRIZIONE NODO 2 (PAROLE FUTURISTE) ---
let showDescriptionNodo2 = false;
let textLines = [];
let descriptionAlpha = 0;
const DESCRIPTION_FADE_SPEED = 8;

// Testo del nodo 2
const nodo2Text = `QuaLCosa si Avvolge… una CURVA che danza… ritmO… raPIdiTà…
LE grAzie conDuconO alla lettera, la CREAno, la fanno naSCerE:
Scende la priMa astE. Veloce, sPESSA non guarda DoVe VA… poi…ralLLEnta.
La barrA divEnta un PuNto di sospEnsiOne che deViA il moviMento vErSo destra,
un'altra asta … SLASH! 
Un taglio.  
E pOI… riNasCita.`;

// ============ FUNZIONI UTILITY MATEMATICHE ============
function scalePoints(points, multiplier) {
    return points.map(p => ({
        x: p.x * multiplier,
        y: p.y * multiplier
    }));
}

function createSmoothPath(points, segmentsPerCurve = 20) {
    const smooth = [];
    
    for (let i = 0; i < points.length - 1; i++) {
        let p0, p1, p2, p3;
        
        if (i === 0) {
            p0 = points[0];
            p1 = points[0];
            p2 = points[1];
            p3 = points[2] || points[1];
        } else if (i === points.length - 2) {
            p0 = points[i-1];
            p1 = points[i];
            p2 = points[i+1];
            p3 = points[i+1];
        } else {
            p0 = points[i-1];
            p1 = points[i];
            p2 = points[i+1];
            p3 = points[i+2];
        }
        
        for (let j = 0; j <= segmentsPerCurve; j++) {
            const t = j / segmentsPerCurve;
            const t2 = t * t;
            const t3 = t2 * t;
            
            const x = 0.5 * ((2 * p1.x) +
                            (-p0.x + p2.x) * t +
                            (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 +
                            (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3);
            
            const y = 0.5 * ((2 * p1.y) +
                            (-p0.y + p2.y) * t +
                            (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 +
                            (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3);
            
            smooth.push({x, y});
        }
    }
    
    return smooth;
}

function calculatePathLength(points) {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i+1].x - points[i].x;
        const dy = points[i+1].y - points[i].y;
        length += Math.sqrt(dx*dx + dy*dy);
    }
    return length;
}

function getPointOnPath(t, points, totalLength) {
    t = Math.max(0, Math.min(1, t));
    
    if (t === 0) return points[0];
    if (t === 1) return points[points.length - 1];
    
    const targetLength = t * totalLength;
    
    let accumulated = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i+1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segmentLength = Math.sqrt(dx*dx + dy*dy);
        
        if (accumulated + segmentLength >= targetLength) {
            const segmentT = (targetLength - accumulated) / segmentLength;
            return {
                x: p1.x + dx * segmentT,
                y: p1.y + dy * segmentT
            };
        }
        accumulated += segmentLength;
    }
    
    return points[points.length - 1];
}

// Calcola 24 nodi equidistanti
function calculateNodes() {
    nodes = [];
    const numNodes = 24;
    
    for (let i = 0; i < numNodes; i++) {
        const t = i / (numNodes - 1);
        const point = getPointOnPath(t, smoothPath, pathLength);
        
        nodes.push({
            x: point.x,
            y: point.y,
            t: t,
            color: [
                [255, 220, 180],
                [180, 220, 255],
                [220, 255, 180],
                [255, 180, 220]
            ][i % 4]
        });
    }
}

// Sistema di movimento tra nodi
function startMovingToNextNode() {
    if (movementState === 'STOPPED') {
        // Determina il prossimo nodo
        targetNodeIndex = currentNodeIndex + 1;
        if (targetNodeIndex >= nodes.length) {
            targetNodeIndex = 0; // Torna all'inizio
        }
        
        movementState = 'MOVING_TO_NODE';
        
        // Resetta tutte le immagini
        for (let i = 1; i <= 24; i++) {
            showNodoImages[i] = false;
            nodoImageAlphas[i] = 0;
        }
        
        // Attiva l'immagine per il nodo target (se ha un'immagine)
        if (targetNodeIndex >= 1 && targetNodeIndex <= 24) {
            showNodoImages[targetNodeIndex] = true;
        }
    }
}

function updateMovement() {
    if (movementState === 'MOVING_TO_NODE') {
        // Calcola il target progress (posizione del nodo target)
        const targetT = nodes[targetNodeIndex].t;
        
        // Calcola la distanza dal target
        const distanceToTarget = Math.abs(targetT - scrollProgress);
        
        // Controllo per le immagini dei nodi
        if (targetNodeIndex >= 1 && targetNodeIndex <= 24 && showNodoImages[targetNodeIndex]) {
            if (distanceToTarget < 0.008) {
                nodoImageAlphas[targetNodeIndex] = Math.min(
                    nodoImageAlphas[targetNodeIndex] + NODO_IMAGE_FADE_SPEED, 
                    NODO_IMAGE_TARGET_ALPHA
                );
            }
        }
        
        // Muovi verso il target
        scrollProgress += (targetT - scrollProgress) * MOVEMENT_SPEED;
        
        // Se siamo arrivati abbastanza vicino, fermati
        if (distanceToTarget < 0.0005) {
            scrollProgress = targetT;
            currentNodeIndex = targetNodeIndex;
            movementState = 'STOPPED';
            if (document.getElementById('current-node')) {
                document.getElementById('current-node').textContent = (currentNodeIndex + 1);
            }
            
            // Mantieni l'immagine visibile quando arriviamo al nodo
            if (currentNodeIndex >= 1 && currentNodeIndex <= 24) {
                nodoImageAlphas[currentNodeIndex] = NODO_IMAGE_TARGET_ALPHA;
            } else {
                // Nascondi tutte le immagini se non siamo su un nodo con immagine
                for (let i = 1; i <= 24; i++) {
                    showNodoImages[i] = false;
                    nodoImageAlphas[i] = 0;
                }
            }
        }
    }
}

// Calcola distanza tra due punti
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// ============ SETUP SCROLL LISTENERS ============
function setupScrollListeners(canvasElement) {
    let isProcessing = false;
    
    // Listener per wheel (rotellina mouse) - SOLO QUESTO MUOVE IL PALLINO
    window.addEventListener('wheel', function(e) {
        if (isProcessing) return;
        
        // Solo scroll verso il basso o verso l'alto
        if (Math.abs(e.deltaY) > 5 || Math.abs(e.deltaX) > 5) {
            if (movementState === 'STOPPED') {
                isProcessing = true;
                startMovingToNextNode();
                
                // Evita input multipli troppo ravvicinati
                setTimeout(() => {
                    isProcessing = false;
                }, 300);
            }
        }
    });
    
    // Listener per tastiera - SOLO QUESTO MUOVE IL PALLINO
    window.addEventListener('keydown', function(e) {
        // Space, ArrowDown, ArrowRight
        if (['Space', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.code)) {
            e.preventDefault();
            if (movementState === 'STOPPED' && !isProcessing) {
                isProcessing = true;
                startMovingToNextNode();
                
                setTimeout(() => {
                    isProcessing = false;
                }, 300);
            }
        }
    });

    // Listener per click sul canvas - SOLO PER INTERAZIONE CON NODI, NON MUOVE IL PALLINO
    if (canvasElement) {
        canvasElement.addEventListener('click', handleCanvasClick);
        canvasElement.style.cursor = 'pointer';
    }
    
    function handleCanvasClick(e) {
        // Ottieni le coordinate del click relative al canvas
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Coordinate corrente del pallino
        const currentPoint = getPointOnPath(scrollProgress, smoothPath, pathLength);
        const zoom = 0.025;
        
        // Converte il click in coordinate mondo
        const worldX = (clickX - window.width/2) / zoom + currentPoint.x;
        const worldY = (clickY - window.height/2) / zoom + currentPoint.y;
        
        // Verifica se il click è sul nodo 2
        const nodo2 = nodes[1];
        const distToNodo2 = distance(worldX, worldY, nodo2.x, nodo2.y);
        
        // Tolleranza per cliccare il nodo
        if (distToNodo2 < 1500) {
            showDescriptionNodo2 = !showDescriptionNodo2;
            
            // NON avviare il movimento del pallino
            return;
        }
    }
}

// ============ SKETCH P5 ============
const sketch = (p) => {
    // Variabili locali a p5
    let canvas;
    let starParticles = [];
    let font;
    
    // Funzioni che usano p5
    function initStarParticles() {
        starParticles = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            starParticles.push({
                x: p.random(p.width * 100),
                y: p.random(p.height * 100),
                size: p.random(1, 4),
                brightness: p.random(50, 150),
                twinkleSpeed: p.random(0.01, 0.03),
                twinklePhase: p.random(p.TWO_PI)
            });
        }
    }
    
   function createTextLines(node) {
    textLines = [];
    
    // Dividi il testo in righe
    const lines = nodo2Text.split('\n');
    
    // PER MODIFICARE SPAZIATURA TRA RIGHE: cambia lineHeight (attualmente 800)
    const lineHeight = 800; // ← CAMBIA QUI per spazio tra righe
    
    // PER MODIFICARE POSIZIONE Y INIZIALE: startY calcola dove inizia il testo verticalmente
    const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
    
    // PARAMETRI ONDA PER OGNI RIGA
    const lineWaves = [];
    lines.forEach(() => {
        lineWaves.push({
            amplitude: p.random(50, 150),   // ← AMPIEZZA ONDA RIGA
            frequency: p.random(0.01, 0.03), // ← FREQUENZA ONDA RIGA
            phase: p.random(0, 1000),        // ← FASE INIZIALE
            breakPoint: p.random(0.3, 0.7),  // ← PUNTO DI SPEZZATURA (0-1)
            angle: p.random(-0.2, 0.2),      // ← ANGOLO INCLINAZIONE RIGA
            zigzag: p.random() > 0.5         // ← SE USARE ZIGZAG
        });
    });
    
    lines.forEach((line, lineIndex) => {
        // Rimuovi spazi extra all'inizio e alla fine
        const trimmedLine = line.trim();
        if (trimmedLine === '') return;
        
        // Suddividi la riga in parole per animazioni individuali
        const words = trimmedLine.split(/\s+/);
        const wordsInLine = [];
        
        // PER MODIFICARE SPAZIATURA TRA PAROLE: cambia wordSpacing (attualmente 200)
        const wordSpacing = 200; // ← CAMBIA QUI per spazio tra parole
        
        // Calcola larghezza approssimativa della riga per centrare
        const estimatedCharWidth = 180;
        let totalLineWidth = 0;
        words.forEach(word => {
            totalLineWidth += word.length * estimatedCharWidth + wordSpacing;
        });
        totalLineWidth -= wordSpacing;
        
        // POSIZIONE X INIZIALE CON ONDA
        const wave = lineWaves[lineIndex];
        let currentX = node.x - totalLineWidth / 2;
        
        // APPLICA ONDA ALLA RIGA
        const baseLineY = startY + lineIndex * lineHeight;
        
        words.forEach((word, wordIndex) => {
            const wordWidth = word.length * estimatedCharWidth;
            
            // Calcola posizione lungo la riga (0-1)
            const t = wordIndex / Math.max(words.length - 1, 1);
            
            // CALCOLA ONDA ORIZZONTALE E VERTICALE
            let waveX = 0;
            let waveY = 0;
            
            // Onda sinusoidale base
            const sineWave = p.sin(t * Math.PI * 2 * wave.frequency + wave.phase) * wave.amplitude;
            
            if (wave.zigzag) {
                // Effetto zigzag (onda triangolare)
                const zigzagT = (t * 4) % 1;
                waveY = (zigzagT < 0.5 ? zigzagT * 2 : 2 - zigzagT * 2) * wave.amplitude - wave.amplitude/2;
                waveX = p.sin(t * Math.PI * 4) * 50;
            } else if (t > wave.breakPoint && words.length > 3) {
                // Spezzatura della riga dopo breakPoint
                waveY = sineWave + 100;
                waveX = 100;
            } else {
                // Onda sinusoidale normale
                waveY = sineWave;
                waveX = p.cos(t * Math.PI * 2 * wave.frequency + wave.phase) * 30;
            }
            
            // Determina se questa parola deve avere animazioni speciali
            const isSpecialWord = word.includes('SLASH') || 
                                  word.includes('CURVA') || 
                                  word.includes('ritmO') ||
                                  word.includes('raPIdiTà');
            
            // POSIZIONE FINALE CON ONDA E INCLINAZIONE
            const rotatedX = currentX * p.cos(wave.angle) - baseLineY * p.sin(wave.angle);
            const rotatedY = currentX * p.sin(wave.angle) + baseLineY * p.cos(wave.angle);
            
            wordsInLine.push({
                text: word,
                x: currentX + wordWidth / 2 + waveX,
                y: baseLineY + waveY,
                baseX: currentX + wordWidth / 2,
                baseY: baseLineY,
                
                // PER MODIFICARE ROTAZIONE INIZIALE:
                rotation: isSpecialWord ? p.random(-0.5, 0.5) : 
                          wave.angle + p.random(-0.1, 0.1) + (waveY / 200) * 0.2,
                
                // PARAMETRI ONDA INDIVIDUALI
                waveAmpY: p.random(30, 100),
                waveSpeedY: p.random(0.02, 0.05),
                waveOffsetY: p.random(0, 1000),
                
                // ONDE ORIZZONTALI PER MOVIMENTO
                waveAmpX: isSpecialWord ? p.random(150, 400) : p.random(20, 60),
                waveSpeedX: isSpecialWord ? p.random(0.04, 0.08) : p.random(0.01, 0.03),
                waveOffsetX: p.random(0, 1000),
                
                // Animazioni extra per parole speciali
                specialMovement: isSpecialWord,
                pulseAmp: isSpecialWord ? p.random(80, 150) : p.random(10, 30),
                pulseSpeed: isSpecialWord ? p.random(0.06, 0.12) : p.random(0.02, 0.04),
                
                // PER MODIFICARE ROTAZIONI CARATTERI:
                charRotations: [],
                charSpacings: [], // Spazi individuali tra caratteri
                
                // NUOVI PARAMETRI PER ONDE COMPLESSE
                secondaryWaveAmp: p.random(20, 50),
                secondaryWaveSpeed: p.random(0.1, 0.2),
                wobbleAmount: p.random(0, 0.3),
                isLineStart: wordIndex === 0,
                isLineEnd: wordIndex === words.length - 1
            });
            
            // Inizializza rotazioni e spazi per ogni carattere
            const lastWord = wordsInLine[wordsInLine.length - 1];
            
            // PER MODIFICARE SPAZIATURA TRA CARATTERI: cambia baseCharSpacing (attualmente 180)
            const baseCharSpacing = 180;
            
            for (let i = 0; i < word.length; i++) {
                // Rotazioni caratteri con pattern ondulato
                const charT = i / (word.length - 1 || 1);
                const charWave = p.sin(charT * Math.PI * 3) * 0.3;
                
                lastWord.charRotations.push(
                    isSpecialWord ? p.random(-0.8, 0.8) : 
                    wave.angle * 0.5 + charWave + p.random(-0.15, 0.15)
                );
                
                // Spazi individuali tra caratteri con pattern
                const spacingVariation = isSpecialWord ? 80 : 60;
                const spacingPattern = p.sin(charT * Math.PI * 2) * spacingVariation * 0.5;
                
                lastWord.charSpacings.push(
                    baseCharSpacing + spacingPattern + 
                    (isSpecialWord ? p.random(-spacingVariation, spacingVariation) : 0)
                );
            }
            
            // Sposta currentX per la prossima parola con possibile offset ondulato
            const nextWordOffset = p.sin((wordIndex + 0.5) * 0.5) * 30;
            currentX += wordWidth + wordSpacing + nextWordOffset;
        });
        
        textLines.push(wordsInLine);
    });
}

function drawNodo2Description() {
    if (!showDescriptionNodo2 && descriptionAlpha <= 0) return;
    
    // Anima l'alpha
    if (showDescriptionNodo2) {
        descriptionAlpha = Math.min(descriptionAlpha + DESCRIPTION_FADE_SPEED, 255);
    } else {
        descriptionAlpha = Math.max(descriptionAlpha - DESCRIPTION_FADE_SPEED, 0);
    }
    
    const time = p.millis() * 0.001;
    
    // Disegna ogni riga (ogni riga è un array di parole)
    textLines.forEach((wordsInLine, lineIndex) => {
        // Disegna ogni parola della riga
        wordsInLine.forEach((word, wordIndex) => {
            p.push();
            
            // CALCOLA EFFETTI ONDULATORI MULTIPLI
            const waveY = p.sin(time * word.waveSpeedY + word.waveOffsetY) * word.waveAmpY;
            const waveX = p.cos(time * word.waveSpeedX + word.waveOffsetX) * word.waveAmpX;
            
            // Onda secondaria per movimento più complesso
            const secondaryWave = p.sin(time * word.secondaryWaveSpeed * 2) * word.secondaryWaveAmp;
            
            // Effetto pulsazione
            const pulse = p.sin(time * word.pulseSpeed) * word.pulseAmp;
            
            // Wobble per parole speciali
            const wobble = word.specialMovement ? 
                p.sin(time * 3 + wordIndex) * word.wobbleAmount * 50 : 0;
            
            // CALCOLA POSIZIONE FINALE
            let finalX = word.x + waveX + secondaryWave * 0.3 + wobble;
            let finalY = word.y + waveY + pulse + secondaryWave * 0.7;
            
            // Aggiungi offset per inizio/fine riga
            if (word.isLineStart) {
                finalX += p.sin(time * 1.5) * 40;
                finalY += p.cos(time * 1.5) * 20;
            }
            if (word.isLineEnd) {
                finalX += p.cos(time * 1.2) * 40;
                finalY += p.sin(time * 1.2) * 20;
            }
            
            // Sposta alla posizione della parola
            p.translate(finalX, finalY);
            
            // ROTAZIONE DINAMICA
            let wordRotation = word.rotation;
            
            if (word.specialMovement) {
                // Rotazione speciale per parole chiave
                wordRotation += p.sin(time * 2) * 0.4 + 
                              p.cos(time * 1.3 + wordIndex) * 0.2;
            } else {
                // Leggera rotazione naturale
                wordRotation += p.sin(time * 0.7 + wordIndex * 0.2) * 0.1;
            }
            
            p.rotate(wordRotation);
            
            // DIMENSIONE TESTO DINAMICA
            const baseTextSize = 320;
            let sizeVariation = 0;
            
            if (word.specialMovement) {
                sizeVariation = p.sin(time * 2) * 50 + 
                              p.cos(time * 1.7) * 20;
            } else {
                sizeVariation = p.sin(time * 0.8 + wordIndex) * 15;
            }
            
            p.textSize(baseTextSize + sizeVariation);
            p.textAlign(p.CENTER, p.CENTER);
            
            // DISEGNA OGNI CARATTERE INDIVIDUALMENTE
            // Calcola larghezza totale con spazi individuali
            let totalWidth = 0;
            word.charSpacings.forEach(spacing => {
                totalWidth += spacing;
            });
            if (word.charSpacings.length > 0) {
                totalWidth -= word.charSpacings[word.charSpacings.length - 1];
            }
            
            const startX = -totalWidth / 2;
            p.translate(startX, 0);
            
            let currentCharX = 0;
            for (let i = 0; i < word.text.length; i++) {
                p.push();
                
                // POSIZIONE CARATTERE CON ONDA
                const charTime = time + i * 0.3;
                const charWaveX = p.sin(charTime * 4) * 5;
                const charWaveY = p.cos(charTime * 5) * 8;
                
                p.translate(currentCharX + charWaveX, charWaveY);
                
                // ROTAZIONE CARATTERE DINAMICA
                let charRotation = word.charRotations[i];
                charRotation += p.sin(charTime * 6) * 0.15;
                
                if (word.specialMovement) {
                    charRotation += p.sin(charTime * 8 + i) * 0.3;
                }
                
                p.rotate(charRotation);
                
                // COLORE CON VARIAZIONI
                const pulseBright = p.sin(time * 3 + i * 0.2) * 20;
                let brightness = 220 + pulseBright;
                
                if (word.specialMovement) {
                    const specialPulse = p.sin(time * 5 + i * 0.5) * 50;
                    brightness = 240 + specialPulse;
                }
                
                p.fill(brightness, brightness, brightness, descriptionAlpha);
                p.noStroke();
                
                // Disegna il carattere
                p.text(word.text[i], 0, 0);
                
                // BAGLIORE PER PAROLE SPECIALI
                if (word.specialMovement) {
                    const glowAlpha = descriptionAlpha * (0.3 + p.sin(time * 6 + i) * 0.2);
                    p.fill(255, 255, 255, glowAlpha);
                    p.textSize(baseTextSize + sizeVariation + 10);
                    p.text(word.text[i], 0, 0);
                    p.textSize(baseTextSize + sizeVariation);
                }
                
                p.pop();
                
                // SPOSTA PER PROSSIMO CARATTERE CON ANIMAZIONE
                const spacing = word.charSpacings[i] || baseCharSpacing;
                const spacingWave = p.sin(time * 2 + i * 0.5) * 10;
                currentCharX += spacing + spacingWave;
            }
            
            p.pop();
        });
    });
    
    // Se stiamo chiudendo e alpha è 0, pulisci le righe
    if (!showDescriptionNodo2 && descriptionAlpha <= 0) {
        textLines = [];
    }
}
    
    
    function drawDarkGradient() {
        // Sfondo nero con leggera sfumatura per profondità
        for (let y = 0; y < p.height; y++) {
            const darkness = p.map(y, 0, p.height, 10, 0);
            p.stroke(darkness, darkness, darkness);
            p.line(0, y, p.width, y);
        }
    }
    
    function drawStars(currentPoint) {
        const time = p.millis() * 0.001;
        const zoom = 0.025;
        
        starParticles.forEach(star => {
            // Calcola posizione relativa al punto corrente
            const relX = (star.x - currentPoint.x * zoom) * zoom;
            const relY = (star.y - currentPoint.y * zoom) * zoom;
            
            // Controlla se la stella è visibile nella viewport
            if (relX > -p.width/2 && relX < p.width/2 && relY > -p.height/2 && relY < p.height/2) {
                // Effetto tremolio
                const twinkle = p.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
                const brightness = star.brightness * twinkle;
                
                // Disegna la stella
                p.noStroke();
                p.fill(255, 255, 255, brightness);
                p.ellipse(
                    p.width/2 + relX / zoom,
                    p.height/2 + relY / zoom,
                    star.size,
                    star.size
                );
            }
        });
    }
    
    function drawSpiralThreads() {
        const time = p.millis();
        
        // 8 fili spiraleggianti colorati
        const colors = [
            [255, 200, 220],
            [200, 220, 255],
            [220, 255, 200],
            [255, 255, 180],
            [255, 180, 220],
            [180, 220, 255],
            [220, 180, 255],
            [255, 220, 180]
        ];
        
        for (let threadIndex = 0; threadIndex < 8; threadIndex++) {
            const phaseOffset = (threadIndex / 8) * p.TWO_PI;
            const speed = 0.001;
            const radius = 200 * (0.7 + p.random(0.6));
            
            // Calcola i punti per questo filo spiraleggiante
            const threadPoints = [];
            
            for (let i = 0; i < smoothPath.length; i += 3) {
                const basePoint = smoothPath[i];
                const t = i / smoothPath.length;
                
                // Calcola la normale approssimativa
                let nextIndex = Math.min(i + 1, smoothPath.length - 1);
                const dx = smoothPath[nextIndex].x - basePoint.x;
                const dy = smoothPath[nextIndex].y - basePoint.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                
                let normal = {x: 0, y: 1};
                if (length > 0) {
                    normal = { x: -dy / length, y: dx / length };
                }
                
                // Calcola lo spostamento spiraleggiante
                const spiralAngle = t * p.PI * 4 + phaseOffset + time * speed;
                const offsetX = Math.cos(spiralAngle) * radius;
                const offsetY = Math.sin(spiralAngle) * radius;
                
                // Applica lo spostamento lungo la normale
                threadPoints.push({
                    x: basePoint.x + normal.x * offsetX + normal.y * offsetY,
                    y: basePoint.y + normal.y * offsetX - normal.x * offsetY
                });
            }
            
            // Disegna il filo spiraleggiante
            const color = colors[threadIndex % colors.length];
            p.stroke(color[0], color[1], color[2], 120);
            p.strokeWeight(15);
            p.strokeCap(p.ROUND);
            p.noFill();
            
            p.beginShape();
            threadPoints.forEach(point => {
                p.vertex(point.x, point.y);
            });
            p.endShape();
        }
    }
    
    function drawMainPath() {
        // LINEA PRINCIPALE BIANCA TRATTEGGIATA
        const pulse = p.sin(p.millis() * 0.002) * 20;
        const currentThickness = 80 + pulse;
        
        p.stroke(255, 255, 255, 220);
        p.strokeWeight(currentThickness);
        p.strokeCap(p.ROUND);
        
        // Effetto tratteggiato
        p.drawingContext.setLineDash([100, 40]);
        
        p.noFill();
        p.beginShape();
        for (let i = 0; i < smoothPath.length; i += 1) {
            p.vertex(smoothPath[i].x, smoothPath[i].y);
        }
        p.endShape();
        
        // Ripristina linea solida
        p.drawingContext.setLineDash([]);
        
        // Bagliore
        for (let i = 1; i <= 3; i++) {
            p.stroke(255, 255, 255, 40 - i * 10);
            p.strokeWeight(currentThickness + i * 60);
            
            p.beginShape();
            for (let j = 0; j < smoothPath.length; j += 2) {
                p.vertex(smoothPath[j].x, smoothPath[j].y);
            }
            p.endShape();
        }
    }
    
    function drawNodes() {
        const time = p.millis() * 0.001;
        
        nodes.forEach((node, index) => {
            const isCurrent = index === currentNodeIndex;
            
            // Animazione di pulsazione per tutti i nodi
            const basePulse = p.sin(time * 3 + index * 0.5) * 0.3 + 0.7;
            const nodeSize = 200 * basePulse;
            
            // Bagliore extra per nodo corrente
            if (isCurrent) {
                for (let i = 5; i > 0; i--) {
                    const alpha = 20 - i * 3;
                    const size = 400 + i * 80;
                    const extraPulse = p.sin(time * 2 + i) * 30;
                    p.noStroke();
                    p.fill(node.color[0], node.color[1], node.color[2], alpha);
                    p.ellipse(node.x, node.y, size + extraPulse, size + extraPulse);
                }
            }
            
            // Anello del nodo rotante
            p.push();
            p.translate(node.x, node.y);
            p.rotate(time * 0.5 + index * 0.1);
            
            p.strokeWeight(30);
            p.stroke(node.color[0], node.color[1], node.color[2], isCurrent ? 200 : 100);
            p.noFill();
            p.ellipse(0, 0, nodeSize * 1.5, nodeSize * 1.5);
            
            // Piccoli punti sull'anello
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * p.TWO_PI;
                const pointX = p.cos(angle) * nodeSize * 0.75;
                const pointY = p.sin(angle) * nodeSize * 0.75;
                const pointPulse = p.sin(time * 4 + i) * 10;
                
                p.fill(255, 255, 255, 200);
                p.noStroke();
                p.ellipse(pointX, pointY, 40 + pointPulse, 40 + pointPulse);
            }
            
            p.pop();
            
            // Centro del nodo
            p.noStroke();
            p.fill(node.color[0], node.color[1], node.color[2], isCurrent ? 255 : 150);
            p.ellipse(node.x, node.y, nodeSize * 0.6, nodeSize * 0.6);
            
            // Punto centrale luminoso
            p.fill(255, 255, 255, 255);
            p.ellipse(node.x, node.y, 40, 40);
            
            // Punto super luminoso
            p.fill(255, 255, 255, 255);
            p.ellipse(node.x, node.y, 10, 10);
        });
    }
    
    function drawNodoImage(nodeIndex, img, alpha) {
        if (nodes.length > nodeIndex && img) {
            const node = nodes[nodeIndex];
            const settings = NODO_IMAGE_SETTINGS[nodeIndex];
            
            if (!settings) return;
            
            p.push();
            
            // Calcola la posizione usando le impostazioni
            const imageX = node.x + settings.offsetX;
            const imageY = node.y + settings.offsetY;
            
            // Calcola dimensioni proporzionali
            const desiredWidth = img.width * settings.scale;
            const desiredHeight = img.height * settings.scale;
            
            // Applica la trasparenza
            p.tint(255, alpha);
            
            // Disegna l'immagine
            p.image(img, imageX, imageY, desiredWidth, desiredHeight);
            
            p.pop();
        }
    }
    
    function drawMovingDot(currentPoint) {
        const time = p.millis() * 0.001;
        
        // Bagliore esterno molto ampio
        for (let i = 15; i > 0; i--) {
            const size = 300 + i * 40;
            const alpha = 8 - i * 0.4;
            const pulse = p.sin(time * 2 + i * 0.3) * 20;
            
            p.noStroke();
            p.fill(255, 255, 255, alpha);
            p.ellipse(currentPoint.x, currentPoint.y, size + pulse, size + pulse);
        }
        
        // Bagliore intermedio
        for (let i = 5; i > 0; i--) {
            const size = 150 + i * 30;
            const alpha = 15 - i * 2;
            const pulse = p.sin(time * 3 + i) * 15;
            
            p.fill(255, 255, 255, alpha);
            p.ellipse(currentPoint.x, currentPoint.y, size + pulse, size + pulse);
        }
        
        // Cerchietto principale (pulsante)
        const mainPulse = p.sin(time * 5) * 25;
        p.noStroke();
        p.fill(255, 255, 255, 220);
        p.ellipse(currentPoint.x, currentPoint.y, 100 + mainPulse, 100 + mainPulse);
        
        // Nucleo brillante
        p.fill(255, 255, 200, 255);
        p.ellipse(currentPoint.x, currentPoint.y, 50, 50);
        
        // Punto centrale super luminoso
        p.fill(255, 255, 255, 255);
        p.ellipse(currentPoint.x, currentPoint.y, 15, 15);
        
        // Scie di movimento (solo quando si muove)
        if (movementState === 'MOVING_TO_NODE') {
            for (let i = 0; i < 12; i++) {
                const angle = time * 8 + (i / 12) * p.TWO_PI;
                const distance = 60 + p.sin(time * 6) * 30;
                const trailX = currentPoint.x + p.cos(angle) * distance;
                const trailY = currentPoint.y + p.sin(angle) * distance;
                const trailSize = 20 + p.sin(time * 7 + i) * 10;
                
                p.fill(255, 255, 255, 150);
                p.ellipse(trailX, trailY, trailSize, trailSize);
            }
        }
    }
    
    // Esponi le variabili globalmente per il click handler
    window.createTextLines = createTextLines;
    window.width = p.width;
    window.height = p.height;
    
    p.preload = function() {
        // Carica tutte le immagini per i nodi
        for (let i = 1; i <= 24; i++) {
            nodoImages[i] = p.loadImage('assets/nodo_' + i + '.png');
        }
    };
    
    p.setup = function() {
        console.log("Setup p5.js");
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-canvas');
        
        // Inizializza le variabili globali
        window.width = p.width;
        window.height = p.height;
        
        // Calcola il percorso
        pathPoints = scalePoints(originalPoints, 8);
        smoothPath = createSmoothPath(pathPoints, 30);
        pathLength = calculatePathLength(smoothPath);
        
        // Calcola i nodi
        calculateNodes();
        
        // Inizializza le stelle
        initStarParticles();
        
        // Setup event listeners
        setupScrollListeners(canvas.elt);
        
        // Aggiorna il contatore iniziale
        const nodeElement = document.getElementById('current-node');
        if (nodeElement) {
            nodeElement.textContent = (currentNodeIndex + 1);
        }
        
        console.log("Setup completato");
        console.log("Nodo 2:", nodes[1]);
    };
    
    p.draw = function() {
        // Aggiorna il movimento
        updateMovement();
        
        const currentPoint = getPointOnPath(scrollProgress, smoothPath, pathLength);
        
        // Disegna sfondo
        drawDarkGradient();
        
        // Disegna stelle
        drawStars(currentPoint);
        
        p.push();
        const zoom = 0.025;
        p.translate(p.width/2, p.height/2);
        p.scale(zoom);
        p.translate(-currentPoint.x, -currentPoint.y);
        
        // DISEGNA PRIMA LE IMMAGINI (COSÌ STANNO DIETRO AL FILO)
        for (let i = 1; i <= 24; i++) {
            if (showNodoImages[i] && nodoImageAlphas[i] > 0 && nodoImages[i]) {
                drawNodoImage(i, nodoImages[i], nodoImageAlphas[i]);
            }
        }
        
        // Disegna i fili spiraleggianti
        drawSpiralThreads();
        
        // Disegna il percorso principale
        drawMainPath();
        
        // Disegna i nodi
        drawNodes();
        
        // Disegna il cerchietto
        drawMovingDot(currentPoint);
        
        // Disegna la descrizione del nodo 2 (se attiva)
        drawNodo2Description();
        
        p.pop();
        
        // Se l'utente clicca sul nodo 2 e non abbiamo ancora creato le righe, creale
        if (showDescriptionNodo2 && textLines.length === 0) {
            createTextLines(nodes[1]);
        }
    };
    
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        window.width = p.width;
        window.height = p.height;
        // Ricrea le stelle per il nuovo dimensionamento
        initStarParticles();
    };
};

// ============ INIZIALIZZAZIONE ============
// Inizializza p5
new p5(sketch);