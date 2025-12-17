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
    {x: 33654, y: 35433},
    {x: 11226, y: 35433},
    {x: 11226, y: 45694}
];

// ============ VARIABILI GLOBALI ============
let scrollProgress = 0;
let pathPoints = [];
let smoothPath = [];
let pathLength = 0;

// Sistema di nodi - 26 NODI
let nodes = [];
let currentNodeIndex = 0;

// Sistema di movimento
let movementState = 'STOPPED'; // 'STOPPED', 'MOVING_TO_NODE'
let targetNodeIndex = 0;
const MOVEMENT_SPEED = 0.15;

// Variabili per le immagini dei nodi
let nodoImages = {};
let showNodoImages = {};
let nodoImageAlphas = {};
const NODO_IMAGE_TARGET_ALPHA = 200;
const NODO_IMAGE_FADE_SPEED = 5;

// Impostazioni per le immagini (26 nodi) //sotto positivo. destra positivo
const NODO_IMAGE_SETTINGS = {
    1: { offsetX: -10000, offsetY: 1000, scale: 8 },
    2: { offsetX: -800, offsetY: -200, scale: 10 },
    3: { offsetX: -12000, offsetY: -6000, scale: 10 },
    4: { offsetX: -4000, offsetY: 1500, scale: 9 },
    5: { offsetX: -8000, offsetY: -1000, scale: 10 },
    6: { offsetX: 1000, offsetY: -5000, scale: 6.5 },
    7: { offsetX: -3200, offsetY: -6500, scale: 10 },//forse b
    8: { offsetX: 1000, offsetY: -2000, scale: 8 }, 
    9: { offsetX: -3000, offsetY: 2000, scale: 9 }, 
    10: { offsetX: -3000, offsetY: -6300, scale: 8 },
    11: { offsetX: -2500, offsetY: -7000, scale: 8 },
    12: { offsetX: -5500, offsetY: -7500, scale: 9 },
    13: { offsetX: 2000, offsetY: -3000, scale: 8 },
    14: { offsetX: -3000, offsetY: 1000, scale: 11 },
    15: { offsetX: -2500, offsetY: 1400, scale: 7 },
    16: { offsetX: 1000, offsetY: -2000, scale: 7 },
    17: { offsetX: 1500, offsetY: -1000, scale: 10 },
    18: { offsetX: -2000, offsetY: -6000, scale: 10 },
    19: { offsetX: 2000, offsetY: -3550, scale: 12 },
    20: { offsetX: -3200, offsetY: -6000, scale: 8 },
    21: { offsetX: -2400, offsetY: -7000, scale: 7 },
    22: { offsetX: -2600, offsetY: -7000, scale: 7 },
    23: { offsetX: -2000, offsetY: -5000, scale: 8 },
    24: { offsetX: 2000, offsetY: -2000, scale: 11 }, //    questa è la P
    25: { offsetX: -2000, offsetY: -5000, scale: 8 },
    26: { offsetX: 2000, offsetY: -2000, scale: 1.5 }
};

// Inizializza per 26 nodi
for (let i = 1; i <= 26; i++) {
    showNodoImages[i] = false;
    nodoImageAlphas[i] = 0;
}

// Particelle per effetto stellato
let starParticles = [];
const STAR_COUNT = 100;

// Descrizione Nodo 2
let showDescriptionNodo2 = false;
let textLines = [];
let descriptionAlpha = 0;

// Descrizione Nodo 3
let showDescriptionNodo3 = false;
let textLinesNodo3 = [];
let descriptionAlphaNodo3 = 0;

// Descrizione Nodo 13
let showDescriptionNodo13 = false;
let textLinesNodo13 = [];
let descriptionAlphaNodo13 = 0;

// Descrizione Nodo 21 - NUOVA
let showDescriptionNodo21 = false;
let textLinesNodo21 = [];
let descriptionAlphaNodo21 = 0;

const DESCRIPTION_FADE_SPEED = 8;

// Testi
const nodo3Text = `QuaLCosa si Avvolge… una CURVA che danza… 
ritmO… raPIdiTà…
LE grAzie conDuconO alla lettera, 
la CREAno, la fanno naSCerE:
Scende la priMa astA. 
Veloce, sPESSA non guarda DoVe VA… poi…ralLLEnta.
La barrA divEnta un PuNto di sospEnsiOne 
che deViA il moviMento vErSo destra,
un'altra asta … 

SLASH! 


Un taglio.  
E pOI… riNasCita.`;

const nodo2Text = `QuaLCosa si Avvolge… una CURVA che danza… 
ritmO… raPIdiTà… LE grAzie conDuconO alla lettera, 
la CREAno, la fanno naSCerE: Scende la priMa astE. 
Veloce, sPESSA non guarda DoVe VA… poi…ralLLEnta.
La barrA divEnta un PuNto di sospEnsiOne che deViA 
il moviMento vErSo destra,
un'altra asta … SLASH! 
Un taglio.  
E pOI… riNasCita.`;

// Testo per il nodo 13
const nodo13Text = `Il testo per il nodo 13 va qui...
Puoi scrivere quello che vuoi
su più righe
come preferisci`;

// Testo per il nodo 21
const nodo21Text = `Il testo per il nodo 21 va qui...
Puoi scrivere quello che vuoi
su più righe
come preferisci`;

// Variabili per animazione testo
let descriptionStartTime = 0;
let wordEntryStates = {};
let wordEntryStatesNodo3 = {};

// Spostamenti testo
const TEXT_OFFSET_X_NODO2 = -20000;
const TEXT_OFFSET_X_NODO3 = 22000;
const TEXT_OFFSET_X_NODO13 = 20000;
const TEXT_OFFSET_X_NODO21 = -18000; // Offset per il nodo 21
const BASE_TEXT_SIZE = 780;

// Funzione per aggiornare l'indicatore del nodo
function updateNodeIndicator() {
    const nodeElement = document.getElementById('current-node');
    if (!nodeElement) return;
    
    // Controlla se c'è una descrizione attiva
    const hasActiveDescription = showDescriptionNodo2 || showDescriptionNodo3 || 
                                showDescriptionNodo13 || showDescriptionNodo21;
    
    if (hasActiveDescription) {
        nodeElement.textContent = "Clicca per chiudere la descrizione";
        nodeElement.style.color = "#ffffff";
        nodeElement.style.fontStyle = "italic";
    } else {
        nodeElement.textContent = `Nodo ${currentNodeIndex + 1}`;
        nodeElement.style.color = "";
        nodeElement.style.fontStyle = "";
    }
}

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

// Calcola 26 nodi equidistanti
function calculateNodes() {
    nodes = [];
    const numNodes = 26;
    
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
        targetNodeIndex = currentNodeIndex + 1;
        if (targetNodeIndex >= nodes.length) {
            targetNodeIndex = 0;
        }
        
        movementState = 'MOVING_TO_NODE';
        
        // Resetta tutte le immagini
        for (let i = 1; i <= 26; i++) {
            showNodoImages[i] = false;
            nodoImageAlphas[i] = 0;
        }
        
        // Attiva l'immagine per il nodo target (se ha un'immagine)
        if (targetNodeIndex >= 1 && targetNodeIndex <= 26) {
            showNodoImages[targetNodeIndex] = true;
        }
    }
}

function updateMovement() {
    if (movementState === 'MOVING_TO_NODE') {
        const targetT = nodes[targetNodeIndex].t;
        const distanceToTarget = Math.abs(targetT - scrollProgress);
        
        // Controllo per le immagini dei nodi
        if (targetNodeIndex >= 1 && targetNodeIndex <= 26 && showNodoImages[targetNodeIndex]) {
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
            
            // Aggiorna l'indicatore del nodo
            updateNodeIndicator();
            
            // Mantieni l'immagine visibile quando arriviamo al nodo
            if (currentNodeIndex >= 1 && currentNodeIndex <= 26) {
                nodoImageAlphas[currentNodeIndex] = NODO_IMAGE_TARGET_ALPHA;
            } else {
                // Nascondi tutte le immagini
                for (let i = 1; i <= 26; i++) {
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
    
    // Listener per wheel
    window.addEventListener('wheel', function(e) {
        if (isProcessing) return;
        
        if (Math.abs(e.deltaY) > 5 || Math.abs(e.deltaX) > 5) {
            if (movementState === 'STOPPED') {
                isProcessing = true;
                startMovingToNextNode();
                
                setTimeout(() => {
                    isProcessing = false;
                }, 300);
            }
        }
    });
    
    // Listener per tastiera
    window.addEventListener('keydown', function(e) {
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

    // Listener per click sul canvas
    if (canvasElement) {
        canvasElement.addEventListener('click', handleCanvasClick);
        canvasElement.style.cursor = 'pointer';
    }
    
    function handleCanvasClick(e) {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const currentPoint = getPointOnPath(scrollProgress, smoothPath, pathLength);
        const zoom = 0.025;
        
        const worldX = (clickX - window.width/2) / zoom + currentPoint.x;
        const worldY = (clickY - window.height/2) / zoom + currentPoint.y;
        
        // Verifica se il click è sul nodo 2
        const nodo2 = nodes[1];
        const distToNodo2 = distance(worldX, worldY, nodo2.x, nodo2.y);
        
        // Verifica se il click è sul nodo 3
        const nodo3 = nodes[2];
        const distToNodo3 = distance(worldX, worldY, nodo3.x, nodo3.y);
        
        // Verifica se il click è sul nodo 13
        const nodo13 = nodes[12];
        const distToNodo13 = distance(worldX, worldY, nodo13.x, nodo13.y);
        
        // Verifica se il click è sul nodo 21
        const nodo21 = nodes[20];
        const distToNodo21 = distance(worldX, worldY, nodo21.x, nodo21.y);
        
        // Tolleranza per cliccare i nodi
        if (distToNodo2 < 1500) {
            showDescriptionNodo2 = !showDescriptionNodo2;
            showDescriptionNodo3 = false;
            showDescriptionNodo13 = false;
            showDescriptionNodo21 = false;
            
            // Aggiorna l'indicatore
            updateNodeIndicator();
            
            if (showDescriptionNodo2) {
                window.createTextLinesRequestedNodo2 = true;
            }
            return;
        }
        
        if (distToNodo3 < 1500) {
            showDescriptionNodo3 = !showDescriptionNodo3;
            showDescriptionNodo2 = false;
            showDescriptionNodo13 = false;
            showDescriptionNodo21 = false;
            
            // Aggiorna l'indicatore
            updateNodeIndicator();
            
            if (showDescriptionNodo3) {
                window.createTextLinesRequestedNodo3 = true;
            }
            return;
        }
        
        if (distToNodo13 < 1500) {
            showDescriptionNodo13 = !showDescriptionNodo13;
            showDescriptionNodo2 = false;
            showDescriptionNodo3 = false;
            showDescriptionNodo21 = false;
            
            // Aggiorna l'indicatore
            updateNodeIndicator();
            
            if (showDescriptionNodo13) {
                window.createTextLinesRequestedNodo13 = true;
            }
            return;
        }
        
        if (distToNodo21 < 1500) {
            showDescriptionNodo21 = !showDescriptionNodo21;
            showDescriptionNodo2 = false;
            showDescriptionNodo3 = false;
            showDescriptionNodo13 = false;
            
            // Aggiorna l'indicatore
            updateNodeIndicator();
            
            if (showDescriptionNodo21) {
                window.createTextLinesRequestedNodo21 = true;
            }
            return;
        }
    }
}

// ============ SKETCH P5 ============
const sketch = (p) => {
    let canvas;
    let starParticles = [];
    
    // Variabili locali per il testo del nodo 2
    let localTextLines = [];
    let localWordEntryStates = {};
    let localDescriptionStartTime = 0;
    
    // Variabili locali per il testo del nodo 3
    let localTextLinesNodo3 = [];
    let localWordEntryStatesNodo3 = {};
    let localDescriptionStartTimeNodo3 = 0;
    
    // Variabili locali per il testo del nodo 13
    let localTextLinesNodo13 = [];
    
    // Variabili locali per il testo del nodo 21
    let localTextLinesNodo21 = [];
    
    // Funzione per caricare immagini in modo sicuro
    function loadImageSafely(path, placeholderText) {
        return new Promise((resolve) => {
            const img = p.loadImage(
                path,
                (loadedImg) => {
                    console.log(`✅ Immagine caricata: ${path}`);
                    resolve(loadedImg);
                },
                (err) => {
                    console.log(`⚠️ Immagine non trovata: ${path}, creo placeholder`);
                    // Crea un'immagine placeholder
                    const placeholder = p.createGraphics(200, 200);
                    placeholder.background(50, 50, 100, 100);
                    placeholder.fill(200, 200, 255);
                    placeholder.textSize(24);
                    placeholder.textAlign(p.CENTER, p.CENTER);
                    placeholder.text(placeholderText, 100, 100);
                    resolve(placeholder);
                }
            );
        });
    }
    
    // Funzione generica per creare le righe di testo (per nodi 2 e 3)
    function createTextLinesGeneric(node, textContent, offsetX) {
        const textLines = [];
        const wordEntryStates = {};
        
        const lines = textContent.split('\n');
        const lineHeight = 800;
        const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
        
        const lineWaves = [];
        lines.forEach(() => {
            lineWaves.push({
                amplitude: p.random(50, 150),
                frequency: p.random(0.01, 0.03),
                phase: p.random(0, 1000),
                breakPoint: p.random(0.3, 0.7),
                angle: p.random(-0.2, 0.2),
                zigzag: p.random() > 0.5
            });
        });
        
        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') return;
            
            const words = trimmedLine.split(/\s+/);
            const wordsInLine = [];
            
            const estimatedCharWidth = 450;
            const wordSpacing = 750;
            
            let totalLineWidth = 0;
            words.forEach(word => {
                totalLineWidth += word.length * estimatedCharWidth + wordSpacing;
            });
            totalLineWidth -= wordSpacing;
            
            let currentX = (node.x + offsetX) - totalLineWidth / 2;
            const baseLineY = startY + lineIndex * lineHeight;
            const wave = lineWaves[lineIndex];
            
            words.forEach((word, wordIndex) => {
                const wordWidth = word.length * estimatedCharWidth;
                const t = wordIndex / Math.max(words.length - 1, 1);
                
                let waveX = 0;
                let waveY = 0;
                const sineWave = p.sin(t * Math.PI * 2 * wave.frequency + wave.phase) * wave.amplitude;
                
                if (wave.zigzag) {
                    const zigzagT = (t * 4) % 1;
                    waveY = (zigzagT < 0.5 ? zigzagT * 2 : 2 - zigzagT * 2) * wave.amplitude - wave.amplitude/2;
                    waveX = p.sin(t * Math.PI * 4) * 50;
                } else if (t > wave.breakPoint && words.length > 3) {
                    waveY = sineWave + 100;
                    waveX = 100;
                } else {
                    waveY = sineWave;
                    waveX = p.cos(t * Math.PI * 2 * wave.frequency + wave.phase) * 30;
                }
                
                const isSpecialWord = word.includes('SLASH') || 
                                      word.includes('CURVA') || 
                                      word.includes('ritmO') ||
                                      word.includes('raPIdiTà');
                
                const targetX = currentX + wordWidth / 2 + waveX;
                const targetY = baseLineY + waveY;
                
                const wordId = `${lineIndex}-${wordIndex}`;
                
                wordEntryStates[wordId] = {
                    entered: false,
                    startTime: 0,
                    delay: p.random(100, 1500),
                    startX: targetX + p.random(-600, 600),
                    startY: targetY + p.random(-400, 400),
                    startRotation: p.random(-1.5, 1.5),
                    moveSpeed: p.random(0.9, 1.3),
                    snapIntensity: p.random(0.8, 1.2),
                    postEntryWobble: p.random(0.2, 0.5),
                    entryDuration: p.random(400, 700)
                };
                
                const wordObj = {
                    text: word,
                    id: wordId,
                    targetX: targetX,
                    targetY: targetY,
                    x: targetX,
                    y: targetY,
                    baseX: currentX + wordWidth / 2,
                    baseY: baseLineY,
                    
                    targetRotation: isSpecialWord ? p.random(-0.4, 0.4) : 
                                  wave.angle + p.random(-0.08, 0.08) + (waveY / 200) * 0.1,
                    rotation: 0,
                    
                    waveAmpY: p.random(40, 80),
                    waveSpeedY: p.random(0.03, 0.04),
                    waveOffsetY: p.random(0, 1000),
                    
                    waveAmpX: isSpecialWord ? p.random(120, 300) : p.random(30, 50),
                    waveSpeedX: isSpecialWord ? p.random(0.03, 0.06) : p.random(0.015, 0.025),
                    waveOffsetX: p.random(0, 1000),
                    
                    specialMovement: isSpecialWord,
                    pulseAmp: isSpecialWord ? p.random(60, 120) : p.random(15, 25),
                    pulseSpeed: isSpecialWord ? p.random(0.04, 0.08) : p.random(0.025, 0.035),
                    
                    charRotations: [],
                    charSpacings: [],
                    
                    secondaryWaveAmp: p.random(15, 35),
                    secondaryWaveSpeed: p.random(0.08, 0.15),
                    wobbleAmount: p.random(0.1, 0.4),
                    isLineStart: wordIndex === 0,
                    isLineEnd: wordIndex === words.length - 1,
                    hasEntered: false
                };
                
                const baseCharSpacing = 350;
                
                for (let i = 0; i < word.length; i++) {
                    const charT = i / (word.length - 1 || 1);
                    const charWave = p.sin(charT * Math.PI * 3) * 0.2;
                    
                    wordObj.charRotations.push(
                        isSpecialWord ? p.random(-0.6, 0.6) : 
                        wave.angle * 0.3 + charWave + p.random(-0.1, 0.1)
                    );
                    
                    const spacingVariation = isSpecialWord ? 120 : 80;
                    const spacingPattern = p.sin(charT * Math.PI * 2) * spacingVariation * 0.3;
                    
                    wordObj.charSpacings.push(
                        baseCharSpacing + spacingPattern + 
                        (isSpecialWord ? p.random(-spacingVariation * 0.5, spacingVariation * 0.5) : 0)
                    );
                }
                
                wordsInLine.push(wordObj);
                
                const nextWordOffset = p.sin((wordIndex + 0.5) * 0.5) * 20;
                currentX += wordWidth + wordSpacing + nextWordOffset;
            });
            
            textLines.push(wordsInLine);
        });
        
        return { textLines, wordEntryStates };
    }
    
    function createTextLinesNodo2(node) {
        const result = createTextLinesGeneric(node, nodo2Text, TEXT_OFFSET_X_NODO2);
        localTextLines = result.textLines;
        localWordEntryStates = result.wordEntryStates;
        localDescriptionStartTime = p.millis();
    }
    
    function createTextLinesNodo3(node) {
        const result = createTextLinesGeneric(node, nodo3Text, TEXT_OFFSET_X_NODO3);
        localTextLinesNodo3 = result.textLines;
        localWordEntryStatesNodo3 = result.wordEntryStates;
        localDescriptionStartTimeNodo3 = p.millis();
    }
    
    // Funzione per creare le righe di testo per il nodo 13 (stile semplice)
    function createTextLinesNodo13(node) {
        localTextLinesNodo13 = [];
        
        const lines = nodo13Text.split('\n');
        const lineHeight = 800;
        const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') return;
            
            const textLine = {
                text: trimmedLine,
                x: node.x + TEXT_OFFSET_X_NODO13,
                y: startY + index * lineHeight,
                waveSpeed: p.random(0.01, 0.03),
                waveOffset: p.random(0, 1000),
                waveAmp: p.random(50, 150),
                rotation: p.random(-0.05, 0.05),
                charRotations: []
            };
            
            // Inizializza le rotazioni dei caratteri
            for (let i = 0; i < trimmedLine.length; i++) {
                textLine.charRotations.push(p.random(-0.1, 0.1));
            }
            
            localTextLinesNodo13.push(textLine);
        });
    }
    
    // Funzione per creare le righe di testo per il nodo 21 (stile che hai fornito)
    function createTextLinesNodo21(node) {
        localTextLinesNodo21 = [];
        
        // Dividi il testo in righe
        const lines = nodo21Text.split('\n');
        
        // PER MODIFICARE SPAZIATURA TRA RIGHE: cambia lineHeight (attualmente 800)
        const lineHeight = 800; // ← CAMBIA QUI per spazio tra righe
        
        // PER MODIFICARE POSIZIONE Y INIZIALE: startY calcola dove inizia il testo verticalmente
        const startY = node.y - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, lineIndex) => {
            // Rimuovi spazi extra all'inizio e alla fine
            const trimmedLine = line.trim();
            if (trimmedLine === '') return;
            
            // Suddividi la riga in parole per animazioni individuali
            const words = trimmedLine.split(/\s+/);
            const wordsInLine = [];
            
            // PER MODIFICARE SPAZIATURA TRA PAROLE: cambia wordSpacing (attualmente 200)
            const wordSpacing = 200; // ← CAMBIA QUI per spazio tra parole
            
            // PER MODIFICARE POSIZIONE X: cambia currentX (attualmente centrato)
            let currentX = node.x + TEXT_OFFSET_X_NODO21; // ← POSIZIONE X INIZIALE
            
            // Calcola larghezza approssimativa della riga per centrare
            const estimatedCharWidth = 180;
            let totalLineWidth = 0;
            words.forEach(word => {
                totalLineWidth += word.length * estimatedCharWidth + wordSpacing;
            });
            totalLineWidth -= wordSpacing;
            
            // Centra la riga
            currentX = currentX - totalLineWidth / 2; // ← GIUSTEZZA DELLA LINEA: cambia questa formula
            
            words.forEach((word, wordIndex) => {
                const wordWidth = word.length * estimatedCharWidth;
                
                // Determina se questa parola deve avere animazioni speciali
                const isSpecialWord = word.includes('SLASH') || 
                                      word.includes('CURVA') || 
                                      word.includes('ritmO') ||
                                      word.includes('raPIdiTà');
                
                wordsInLine.push({
                    text: word,
                    x: currentX + wordWidth / 2,
                    y: startY + lineIndex * lineHeight,
                    baseX: currentX + wordWidth / 2, // ← POSIZIONE BASE X
                    baseY: startY + lineIndex * lineHeight,
                    
                    // PER MODIFICARE ROTAZIONE INIZIALE:
                    rotation: isSpecialWord ? p.random(-0.3, 0.3) : p.random(-0.05, 0.05),
                    
                    // PER MODIFICARE ONDE VERTICALI:
                    waveAmpY: p.random(30, 80), // ← AMPIEZZA ONDA VERTICALE
                    waveSpeedY: p.random(0.02, 0.04), // ← VELOCITÀ ONDA VERTICALE
                    waveOffsetY: p.random(0, 1000), // ← OFFSET ONDA VERTICALE
                    
                    // PER MODIFICARE ONDE ORIZZONTALI (per parole speciali):
                    waveAmpX: isSpecialWord ? p.random(100, 300) : p.random(0, 30), // ← AMPIEZZA ONDA ORIZZONTALE
                    waveSpeedX: isSpecialWord ? p.random(0.03, 0.06) : p.random(0.01, 0.02), // ← VELOCITÀ ONDA ORIZZONTALE
                    waveOffsetX: p.random(0, 1000), // ← OFFSET ONDA ORIZZONTALE
                    
                    // Animazioni extra per parole speciali
                    specialMovement: isSpecialWord,
                    pulseAmp: isSpecialWord ? p.random(50, 100) : 0,
                    pulseSpeed: isSpecialWord ? p.random(0.05, 0.1) : 0,
                    
                    // PER MODIFICARE ROTAZIONI CARATTERI:
                    charRotations: [],
                    charSpacings: [] // Spazi individuali tra caratteri
                });
                
                // Inizializza rotazioni e spazi per ogni carattere
                const lastWord = wordsInLine[wordsInLine.length - 1];
                
                // PER MODIFICARE SPAZIATURA TRA CARATTERI: cambia baseCharSpacing (attualmente 180)
                const baseCharSpacing = 180; // ← SPAZIATURA BASE TRA CARATTERI
                
                for (let i = 0; i < word.length; i++) {
                    // Rotazioni caratteri
                    lastWord.charRotations.push(
                        isSpecialWord ? p.random(-0.5, 0.5) : p.random(-0.1, 0.1)
                    );
                    
                    // Spazi individuali tra caratteri (variazione casuale)
                    // PER MODIFICARE VARIABILITÀ SPAZI: cambia spacingVariation (attualmente 40)
                    const spacingVariation = 40;
                    lastWord.charSpacings.push(
                        baseCharSpacing + (isSpecialWord ? 
                            p.random(-spacingVariation * 2, spacingVariation * 2) : 
                            p.random(-spacingVariation, spacingVariation))
                    );
                }
                
                // Sposta currentX per la prossima parola
                currentX += wordWidth + wordSpacing;
            });
            
            localTextLinesNodo21.push(wordsInLine);
        });
    }
    
    // Funzione generica per disegnare la descrizione (per nodi 2 e 3)
    function drawDescriptionGeneric(textLines, wordEntryStates, descriptionStartTime, showDescription, descriptionAlphaVar) {
        if (!showDescription && descriptionAlphaVar <= 0) return descriptionAlphaVar;
        
        if (showDescription) {
            descriptionAlphaVar = 255;
        } else {
            descriptionAlphaVar = Math.max(descriptionAlphaVar - DESCRIPTION_FADE_SPEED, 0);
        }
        
        const currentTime = p.millis();
        const elapsedTime = currentTime - descriptionStartTime;
        const time = currentTime * 0.001;
        
        textLines.forEach((wordsInLine, lineIndex) => {
            wordsInLine.forEach((word, wordIndex) => {
                const wordState = wordEntryStates[word.id];
                
                if (!wordState.entered) {
                    if (elapsedTime > wordState.delay) {
                        wordState.entered = true;
                        wordState.startTime = currentTime;
                        word.hasEntered = true;
                    } else {
                        return;
                    }
                }
                
                p.push();
                
                let entryProgress = 0;
                if (wordState.entered) {
                    const entryElapsed = currentTime - wordState.startTime;
                    entryProgress = Math.min(entryElapsed / wordState.entryDuration, 1);
                }
                
                let easedProgress = 0;
                if (entryProgress > 0) {
                    if (entryProgress < 0.2) {
                        easedProgress = p.pow(entryProgress * 5, 2) * 0.2;
                    } else if (entryProgress < 0.8) {
                        easedProgress = 0.2 + (entryProgress - 0.2) * 1.2;
                    } else {
                        const t = (entryProgress - 0.8) * 5;
                        easedProgress = 0.92 + (1 - p.pow(1 - t, 3)) * 0.08;
                    }
                    easedProgress = Math.min(easedProgress, 1);
                }
                
                let currentX, currentY, currentRotation;
                
                if (easedProgress < 1) {
                    const t = easedProgress;
                    const easeOut = 1 - p.pow(1 - t, 2);
                    
                    const overshootX = p.sin(t * Math.PI * wordState.snapIntensity) * 30 * (1 - t);
                    const overshootY = p.cos(t * Math.PI * wordState.snapIntensity * 0.7) * 20 * (1 - t);
                    
                    currentX = p.lerp(wordState.startX, word.targetX, easeOut) + overshootX;
                    currentY = p.lerp(wordState.startY, word.targetY, easeOut) + overshootY;
                    currentRotation = p.lerp(wordState.startRotation, word.targetRotation, easeOut);
                    
                    if (t > 0.9) {
                        const snap = (t - 0.9) * 10;
                        const snapX = p.sin(snap * Math.PI * 3) * 15 * (1 - snap);
                        const snapY = p.cos(snap * Math.PI * 3) * 8 * (1 - snap);
                        currentX += snapX;
                        currentY += snapY;
                    }
                    
                    word.x = currentX;
                    word.y = currentY;
                    word.rotation = currentRotation;
                } else {
                    currentX = word.x;
                    currentY = word.y;
                    currentRotation = word.rotation;
                    
                    if (wordState.postEntryWobble > 0) {
                        const wobbleTime = (currentTime - wordState.startTime - wordState.entryDuration) * 0.001;
                        const wobble = p.sin(wobbleTime * 3) * wordState.postEntryWobble * 8;
                        currentX += wobble;
                        currentY += p.cos(wobbleTime * 2.5) * wobble * 0.4;
                    }
                }
                
                let waveY = 0, waveX = 0, secondaryWave = 0, pulse = 0, wobble = 0;
                
                if (easedProgress >= 0.7) {
                    const waveIntensity = p.smoothstep(0.7, 1, easedProgress);
                    
                    waveY = p.sin(time * word.waveSpeedY + word.waveOffsetY) * word.waveAmpY * waveIntensity;
                    waveX = p.cos(time * word.waveSpeedX + word.waveOffsetX) * word.waveAmpX * waveIntensity;
                    secondaryWave = p.sin(time * word.secondaryWaveSpeed * 2) * word.secondaryWaveAmp * waveIntensity;
                    pulse = p.sin(time * word.pulseSpeed) * word.pulseAmp * waveIntensity;
                    
                    if (word.specialMovement) {
                        wobble = p.sin(time * 2.5 + wordIndex) * word.wobbleAmount * 40 * waveIntensity;
                    }
                }
                
                let finalX = currentX + waveX + secondaryWave * 0.3 + wobble;
                let finalY = currentY + waveY + pulse + secondaryWave * 0.7;
                
                if (easedProgress >= 1) {
                    if (word.isLineStart) {
                        finalX += p.sin(time * 1.2) * 30;
                        finalY += p.cos(time * 1.2) * 15;
                    }
                    if (word.isLineEnd) {
                        finalX += p.cos(time * 1.0) * 30;
                        finalY += p.sin(time * 1.0) * 15;
                    }
                }
                
                p.translate(finalX, finalY);
                
                let wordRotation = currentRotation;
                
                if (word.specialMovement && easedProgress >= 0.7) {
                    const specialIntensity = p.smoothstep(0.7, 1, easedProgress);
                    wordRotation += p.sin(time * 1.5) * 0.3 * specialIntensity + 
                                  p.cos(time * 1.1 + wordIndex) * 0.15 * specialIntensity;
                } else if (easedProgress >= 1) {
                    wordRotation += p.sin(time * 0.6 + wordIndex * 0.15) * 0.08;
                }
                
                p.rotate(wordRotation);
                
                const baseTextSize = BASE_TEXT_SIZE;
                let sizeVariation = 0;
                
                if (word.specialMovement && easedProgress >= 0.7) {
                    const specialIntensity = p.smoothstep(0.7, 1, easedProgress);
                    sizeVariation = (p.sin(time * 1.5) * 40 + p.cos(time * 1.4) * 15) * specialIntensity;
                } else if (easedProgress >= 1) {
                    sizeVariation = p.sin(time * 0.7 + wordIndex) * 12;
                }
                
                p.textSize(baseTextSize + sizeVariation);
                p.textAlign(p.CENTER, p.CENTER);
                
                let totalWidth = 0;
                word.charSpacings.forEach(spacing => totalWidth += spacing);
                if (word.charSpacings.length > 0) {
                    totalWidth -= word.charSpacings[word.charSpacings.length - 1];
                }
                
                const startX = -totalWidth / 2;
                p.translate(startX, 0);
                
                let currentCharX = 0;
                for (let i = 0; i < word.text.length; i++) {
                    p.push();
                    
                    let charWaveX = 0, charWaveY = 0;
                    
                    if (easedProgress >= 0.7) {
                        const charIntensity = p.smoothstep(0.7, 1, easedProgress);
                        const charTime = time + i * 0.2;
                        charWaveX = p.sin(charTime * 3) * 4 * charIntensity;
                        charWaveY = p.cos(charTime * 4) * 6 * charIntensity;
                    }
                    
                    p.translate(currentCharX + charWaveX, charWaveY);
                    
                    let charRotation = word.charRotations[i];
                    
                    if (easedProgress >= 0.7) {
                        const charIntensity = p.smoothstep(0.7, 1, easedProgress);
                        const charTime = time + i * 0.2;
                        charRotation += p.sin(charTime * 5) * 0.12 * charIntensity;
                        
                        if (word.specialMovement) {
                            charRotation += p.sin(charTime * 6 + i) * 0.2 * charIntensity;
                        }
                    }
                    
                    p.rotate(charRotation);
                    
                    let brightness = 220;
                    
                    if (easedProgress >= 0.7) {
                        const colorIntensity = p.smoothstep(0.7, 1, easedProgress);
                        const pulseBright = p.sin(time * 2.5 + i * 0.15) * 15 * colorIntensity;
                        brightness = 220 + pulseBright;
                        
                        if (word.specialMovement) {
                            const specialPulse = p.sin(time * 4 + i * 0.4) * 40 * colorIntensity;
                            brightness = 235 + specialPulse;
                        }
                    }
                    
                    p.fill(brightness, brightness, brightness, descriptionAlphaVar);
                    p.noStroke();
                    
                    p.text(word.text[i], 0, 0);
                    
                    if (word.specialMovement && easedProgress >= 0.7) {
                        const glowIntensity = p.smoothstep(0.7, 1, easedProgress);
                        const glowAlpha = descriptionAlphaVar * (0.25 + p.sin(time * 5 + i) * 0.15) * glowIntensity;
                        p.fill(255, 255, 255, glowAlpha);
                        p.textSize(baseTextSize + sizeVariation + 8);
                        p.text(word.text[i], 0, 0);
                        p.textSize(baseTextSize + sizeVariation);
                    }
                    
                    p.pop();
                    
                    const spacing = word.charSpacings[i] || 350;
                    let spacingWave = 0;
                    
                    if (easedProgress >= 0.7) {
                        spacingWave = p.sin(time * 1.5 + i * 0.4) * 8;
                    }
                    
                    currentCharX += spacing + spacingWave;
                }
                
                p.pop();
            });
        });
        
        return descriptionAlphaVar;
    }
    
    function drawNodo2Description() {
        descriptionAlpha = drawDescriptionGeneric(
            localTextLines, 
            localWordEntryStates, 
            localDescriptionStartTime, 
            showDescriptionNodo2, 
            descriptionAlpha
        );
        
        if (!showDescriptionNodo2 && descriptionAlpha <= 0) {
            localTextLines = [];
            localWordEntryStates = {};
        }
    }
    
    function drawNodo3Description() {
        descriptionAlphaNodo3 = drawDescriptionGeneric(
            localTextLinesNodo3, 
            localWordEntryStatesNodo3, 
            localDescriptionStartTimeNodo3, 
            showDescriptionNodo3, 
            descriptionAlphaNodo3
        );
        
        if (!showDescriptionNodo3 && descriptionAlphaNodo3 <= 0) {
            localTextLinesNodo3 = [];
            localWordEntryStatesNodo3 = {};
        }
    }
    
    // Funzione per disegnare la descrizione del nodo 13 (stile semplice)
    function drawNodo13Description() {
        if (!showDescriptionNodo13 && descriptionAlphaNodo13 <= 0) return;
       
        // Anima l'alpha
        if (showDescriptionNodo13) {
            descriptionAlphaNodo13 = Math.min(descriptionAlphaNodo13 + DESCRIPTION_FADE_SPEED, 255);
        } else {
            descriptionAlphaNodo13 = Math.max(descriptionAlphaNodo13 - DESCRIPTION_FADE_SPEED, 0);
        }
       
        const time = p.millis() * 0.001;
       
        // Disegna ogni riga
        localTextLinesNodo13.forEach((line, lineIndex) => {
            p.push();
           
            // Calcola l'effetto onda per l'intera riga
            const waveY = p.sin(time * line.waveSpeed + line.waveOffset) * line.waveAmp;
           
            // Sposta all'inizio della riga (centrata)
            p.translate(line.x, line.y + waveY);
           
            // Leggera rotazione dell'intera riga
            p.rotate(line.rotation);
           
            // Imposta il colore bianco con alpha
            p.fill(255, 255, 255, descriptionAlphaNodo13);
            p.noStroke();
           
            // Imposta dimensioni del testo (molto grande)
            p.textSize(700);
            p.textAlign(p.CENTER, p.CENTER);
           
            // Disegna ogni carattere individualmente con rotazioni leggere
            const charSpacing = 750; // Spazio tra caratteri
            const totalWidth = (line.text.length - 1) * charSpacing;
           
            // Sposta indietro per centrare il testo
            p.translate(-totalWidth / 2, 0);
           
            for (let i = 0; i < line.text.length; i++) {
                p.push();
               
                // Sposta alla posizione del carattere
                p.translate(i * charSpacing, 0);
               
                // Rotazione individuale per ogni carattere (leggera e animata)
                const charRotation = line.charRotations[i] + p.sin(time * 2 + i * 0.3) * 0.1;
                p.rotate(charRotation);
               
                // Colore bianco con leggera variazione di luminosità
                const brightness = 200 + p.sin(time * 3 + i) * 55;
                p.fill(brightness, brightness, brightness, descriptionAlphaNodo13);
               
                // Disegna il carattere
                p.text(line.text[i], 0, 0);
               
                // Bagliore attorno al carattere (sottile)
                p.fill(255, 255, 255, descriptionAlphaNodo13 * 0.2);
                p.text(line.text[i], 0, 0);
               
                p.pop();
            }
           
            p.pop();
        });
       
        // Se stiamo chiudendo e alpha è 0, pulisci le righe
        if (!showDescriptionNodo13 && descriptionAlphaNodo13 <= 0) {
            localTextLinesNodo13 = [];
        }
    }
    
    // Funzione per disegnare la descrizione del nodo 21 (stile che hai fornito)
    function drawNodo21Description() {
        if (!showDescriptionNodo21 && descriptionAlphaNodo21 <= 0) return;
        
        // Anima l'alpha
        if (showDescriptionNodo21) {
            descriptionAlphaNodo21 = Math.min(descriptionAlphaNodo21 + DESCRIPTION_FADE_SPEED, 255);
        } else {
            descriptionAlphaNodo21 = Math.max(descriptionAlphaNodo21 - DESCRIPTION_FADE_SPEED, 0);
        }
        
        const time = p.millis() * 0.001;
        
        // Disegna ogni riga (ogni riga è un array di parole)
        localTextLinesNodo21.forEach((wordsInLine, lineIndex) => {
            // Disegna ogni parola della riga
            wordsInLine.forEach((word, wordIndex) => {
                p.push();
                
                // Calcola effetti ondulatori
                const waveY = p.sin(time * word.waveSpeedY + word.waveOffsetY) * word.waveAmpY;
                const waveX = word.specialMovement ? 
                    p.sin(time * word.waveSpeedX + word.waveOffsetX) * word.waveAmpX : 0;
                
                // Effetto pulsazione per parole speciali
                const pulse = word.specialMovement ? 
                    p.sin(time * word.pulseSpeed) * word.pulseAmp : 0;
                
                // Calcola posizione finale con tutti gli effetti
                const finalX = word.x + waveX;
                const finalY = word.y + waveY + pulse;
                
                // Sposta alla posizione della parola
                p.translate(finalX, finalY);
                
                // Rotazione dell'intera parola (con animazione per parole speciali)
                const wordRotation = word.rotation + 
                    (word.specialMovement ? p.sin(time * 0.5) * 0.2 : 0);
                p.rotate(wordRotation);
                
                // PER MODIFICARE DIMENSIONE TESTO: cambia textSize (attualmente 320)
                const baseTextSize = 320; // ← DIMENSIONE BASE DEL TESTO
                const sizeVariation = word.specialMovement ? 
                    p.sin(time * 1.5) * 30 : 0;
                p.textSize(baseTextSize + sizeVariation);
                
                p.textAlign(p.CENTER, p.CENTER);
                
                // Disegna ogni carattere individualmente
                // Calcola larghezza totale con spazi individuali
                let totalWidth = 0;
                word.charSpacings.forEach(spacing => {
                    totalWidth += spacing;
                });
                totalWidth -= word.charSpacings[word.charSpacings.length - 1];
                
                // PER MODIFICARE ALLINEAMENTO CARATTERI: cambia come calcoli startX
                // Attualmente: -totalWidth / 2 (centrato)
                const startX = -totalWidth / 2; // ← ALLINEAMENTO CARATTERI DENTRO PAROLA
                
                p.translate(startX, 0);
                
                let currentCharX = 0;
                for (let i = 0; i < word.text.length; i++) {
                    p.push();
                    
                    // Sposta alla posizione del carattere
                    p.translate(currentCharX, 0);
                    
                    // Rotazione individuale per ogni carattere
                    const charRotation = word.charRotations[i] + 
                        p.sin(time * 2 + i * 0.3) * 0.1;
                    p.rotate(charRotation);
                    
                    // Colore bianco con leggera variazione
                    // PER MODIFICARE LUMINOSITÀ: cambia i valori di brightness
                    const brightness = 220 + p.sin(time * 3 + i * 0.5) * 35;
                    p.fill(brightness, brightness, brightness, descriptionAlphaNodo21);
                    p.noStroke();
                    
                    // Disegna il carattere
                    p.text(word.text[i], 0, 0);
                    
                    // Bagliore per parole speciali
                    if (word.specialMovement) {
                        p.fill(255, 255, 255, descriptionAlphaNodo21 * 0.4);
                        p.text(word.text[i], 0, 0);
                    }
                    
                    p.pop();
                    
                    // Sposta alla posizione del prossimo carattere
                    currentCharX += word.charSpacings[i];
                }
                
                p.pop();
            });
        });
        
        // Se stiamo chiudendo e alpha è 0, pulisci le righe
        if (!showDescriptionNodo21 && descriptionAlphaNodo21 <= 0) {
            localTextLinesNodo21 = [];
        }
    }
    
    // Aggiungi funzione smoothstep
    p.smoothstep = function(edge0, edge1, x) {
        x = p.constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return x * x * (3.0 - 2.0 * x);
    };
    
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
    
    function drawDarkGradient() {
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
            const relX = (star.x - currentPoint.x * zoom) * zoom;
            const relY = (star.y - currentPoint.y * zoom) * zoom;
            
            if (relX > -p.width/2 && relX < p.width/2 && relY > -p.height/2 && relY < p.height/2) {
                const twinkle = p.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
                const brightness = star.brightness * twinkle;
                
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
            
            const threadPoints = [];
            
            for (let i = 0; i < smoothPath.length; i += 3) {
                const basePoint = smoothPath[i];
                const t = i / smoothPath.length;
                
                let nextIndex = Math.min(i + 1, smoothPath.length - 1);
                const dx = smoothPath[nextIndex].x - basePoint.x;
                const dy = smoothPath[nextIndex].y - basePoint.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                
                let normal = {x: 0, y: 1};
                if (length > 0) {
                    normal = { x: -dy / length, y: dx / length };
                }
                
                const spiralAngle = t * p.PI * 4 + phaseOffset + time * speed;
                const offsetX = Math.cos(spiralAngle) * radius;
                const offsetY = Math.sin(spiralAngle) * radius;
                
                threadPoints.push({
                    x: basePoint.x + normal.x * offsetX + normal.y * offsetY,
                    y: basePoint.y + normal.y * offsetX - normal.x * offsetY
                });
            }
            
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
        const pulse = p.sin(p.millis() * 0.002) * 20;
        const currentThickness = 80 + pulse;
        
        p.stroke(255, 255, 255, 220);
        p.strokeWeight(currentThickness);
        p.strokeCap(p.ROUND);
        
        p.drawingContext.setLineDash([100, 40]);
        
        p.noFill();
        p.beginShape();
        for (let i = 0; i < smoothPath.length; i += 1) {
            p.vertex(smoothPath[i].x, smoothPath[i].y);
        }
        p.endShape();
        
        p.drawingContext.setLineDash([]);
        
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
            
            const basePulse = p.sin(time * 3 + index * 0.5) * 0.3 + 0.7;
            const nodeSize = 200 * basePulse;
            
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
            
            p.push();
            p.translate(node.x, node.y);
            p.rotate(time * 0.5 + index * 0.1);
            
            p.strokeWeight(30);
            p.stroke(node.color[0], node.color[1], node.color[2], isCurrent ? 200 : 100);
            p.noFill();
            p.ellipse(0, 0, nodeSize * 1.5, nodeSize * 1.5);
            
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
            
            p.noStroke();
            p.fill(node.color[0], node.color[1], node.color[2], isCurrent ? 255 : 150);
            p.ellipse(node.x, node.y, nodeSize * 0.6, nodeSize * 0.6);
            
            p.fill(255, 255, 255, 255);
            p.ellipse(node.x, node.y, 40, 40);
            
            p.fill(255, 255, 255, 255);
            p.ellipse(node.x, node.y, 10, 10);
        });
    }
    
    function drawNodoImage(nodeIndex, img, alpha) {
        // Controllo sicuro per evitare errori
        if (!nodes || nodes.length <= nodeIndex) return;
        if (!img || alpha <= 0) return;
        
        const node = nodes[nodeIndex];
        if (!node) return;
        
        const settings = NODO_IMAGE_SETTINGS[nodeIndex];
        if (!settings) return;
        
        // Controlla se img è valida
        if (!img.width || !img.height) return;
        
        p.push();
        
        try {
            const imageX = node.x + settings.offsetX;
            const imageY = node.y + settings.offsetY;
            const desiredWidth = img.width * settings.scale;
            const desiredHeight = img.height * settings.scale;
            
            p.tint(255, alpha);
            p.image(img, imageX, imageY, desiredWidth, desiredHeight);
        } catch (e) {
            console.warn("Errore nel disegno dell'immagine del nodo", nodeIndex, e);
        }
        
        p.pop();
    }
    
    function drawMovingDot(currentPoint) {
        const time = p.millis() * 0.001;
        
        for (let i = 15; i > 0; i--) {
            const size = 300 + i * 40;
            const alpha = 8 - i * 0.4;
            const pulse = p.sin(time * 2 + i * 0.3) * 20;
            
            p.noStroke();
            p.fill(255, 255, 255, alpha);
            p.ellipse(currentPoint.x, currentPoint.y, size + pulse, size + pulse);
        }
        
        for (let i = 5; i > 0; i--) {
            const size = 150 + i * 30;
            const alpha = 15 - i * 2;
            const pulse = p.sin(time * 3 + i) * 15;
            
            p.fill(255, 255, 255, alpha);
            p.ellipse(currentPoint.x, currentPoint.y, size + pulse, size + pulse);
        }
        
        const mainPulse = p.sin(time * 5) * 25;
        p.noStroke();
        p.fill(255, 255, 255, 220);
        p.ellipse(currentPoint.x, currentPoint.y, 100 + mainPulse, 100 + mainPulse);
        
        p.fill(255, 255, 200, 255);
        p.ellipse(currentPoint.x, currentPoint.y, 50, 50);
        
        p.fill(255, 255, 255, 255);
        p.ellipse(currentPoint.x, currentPoint.y, 15, 15);
        
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
    
    p.preload = async function() {
        console.log("Caricamento immagini...");
        
        // Carica le immagini in modo asincrono e sicuro
        for (let i = 1; i <= 26; i++) {
            // Crea prima un placeholder
            const placeholder = p.createGraphics(100, 100);
            placeholder.background(50, 50, 100, 100);
            placeholder.fill(200, 200, 255);
            placeholder.textSize(14);
            placeholder.textAlign(p.CENTER, p.CENTER);
            placeholder.text(`Nodo ${i}`, 50, 50);
            nodoImages[i] = placeholder;
            
            // Prova a caricare l'immagine reale solo per i primi 24 nodi
            if (i <= 24) {
                try {
                    const imgPath = 'assets/nodo_' + i + '.png';
                    p.loadImage(imgPath, 
                        (img) => {
                            console.log(`✅ Immagine caricata: nodo_${i}.png`);
                            nodoImages[i] = img;
                        },
                        (err) => {
                            console.log(`⚠️ Immagine non trovata: nodo_${i}.png, uso placeholder`);
                            // Mantieni il placeholder già creato
                        }
                    );
                } catch (e) {
                    console.warn(`Errore nel caricamento di nodo_${i}.png:`, e);
                }
            }
        }
    };
    
    p.setup = function() {
        console.log("Setup p5.js - 26 nodi");
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
        updateNodeIndicator();
        
        console.log("Setup completato con", nodes.length, "nodi");
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
        
        // Disegna immagini dei nodi
        for (let i = 1; i <= 26; i++) {
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
        if (showDescriptionNodo2) {
            if (localTextLines.length === 0) {
                createTextLinesNodo2(nodes[1]);
            }
            drawNodo2Description();
        }
        
        // Disegna la descrizione del nodo 3 (se attiva)
        if (showDescriptionNodo3) {
            if (localTextLinesNodo3.length === 0) {
                createTextLinesNodo3(nodes[2]);
            }
            drawNodo3Description();
        }
        
        // Disegna la descrizione del nodo 13 (se attiva)
        if (showDescriptionNodo13) {
            if (localTextLinesNodo13.length === 0) {
                createTextLinesNodo13(nodes[12]);
            }
            drawNodo13Description();
        }
        
        // Disegna la descrizione del nodo 21 (se attiva)
        if (showDescriptionNodo21) {
            if (localTextLinesNodo21.length === 0) {
                createTextLinesNodo21(nodes[20]);
            }
            drawNodo21Description();
        }
        
        p.pop();
    };
    
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        window.width = p.width;
        window.height = p.height;
        initStarParticles();
    };
};

// ============ INIZIALIZZAZIONE ============
new p5(sketch);