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
let canvas;
let pathPoints = [];
let smoothPath = [];
let pathLength = 0;

// Sistema di nodi
let nodes = [];
let currentNodeIndex = 0;

// Sistema di movimento
let movementState = 'STOPPED'; // 'STOPPED', 'MOVING_TO_NODE'
let targetNodeIndex = 0;
const MOVEMENT_SPEED = 0.25; // Velocità normale fissa

// Variabili per le immagini dei nodi
let nodo1Img, nodo8Img, nodo16Img; // Immagini per i nodi 1, 9 e 17
let showNodo1Image = false;
let showNodo8Image = false;
let showNodo16Image = false;
let nodo1ImageAlpha = 0;
let nodo8ImageAlpha = 0;
let nodo16ImageAlpha = 0;
const NODO_IMAGE_TARGET_ALPHA = 200;
const NODO_IMAGE_FADE_SPEED = 5;

// Impostazioni per le immagini
const NODO_IMAGE_SETTINGS = {
    // Nodo 1 (indice 1)
    1: {
        offsetX: -9800, // Spostamento orizzontale (negativo = sinistra)
        offsetY: -4000,  // Spostamento verticale (negativo = sopra)
        scale: 8        // Fattore di scala
    },
    // Nodo 9 (indice 8)
    8: {
        offsetX: -3500, // Spostamento ancora più a sinistra
        offsetY: 500,  // Spostamento verticale
        scale: 8        // Fattore di scala
    },
    // Nodo 17 (indice 16)
    16: {
        offsetX: 1000, // Spostamento orizzontale
        offsetY: -450,  // Spostamento verticale
        scale: 8        // Fattore di scala
    }
};

// Particelle per effetto stellato (sostituiscono gli sfondi)
let starParticles = [];
const STAR_COUNT = 100;

// ============ VARIABILI P5 ============
let width, height;
let p5Instance;

// ============ FUNZIONI UTILITY ============
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

// Inizializza le particelle stellato
function initStarParticles() {
    starParticles = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        starParticles.push({
            x: Math.random() * width * 100, // Coordinate molto grandi per lo zoom
            y: Math.random() * height * 100,
            size: Math.random() * 3 + 1,
            brightness: Math.random() * 100 + 50,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
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
        
        // Controlla se ci stiamo avvicinando ai nodi con immagini
        if (targetNodeIndex === 1) {
            showNodo1Image = true;
            showNodo8Image = false;
            showNodo16Image = false;
        } else if (targetNodeIndex === 8) {
            showNodo1Image = false;
            showNodo8Image = true;
            showNodo16Image = false;
        } else if (targetNodeIndex === 16) {
            showNodo1Image = false;
            showNodo8Image = false;
            showNodo16Image = true;
        } else {
            showNodo1Image = false;
            showNodo8Image = false;
            showNodo16Image = false;
            nodo1ImageAlpha = 0;
            nodo8ImageAlpha = 0;
            nodo16ImageAlpha = 0;
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
        if (targetNodeIndex === 1 && showNodo1Image) {
            // Quando siamo abbastanza vicini al nodo, inizia la dissolvenza
            if (distanceToTarget < 0.008) {
                nodo1ImageAlpha = Math.min(nodo1ImageAlpha + NODO_IMAGE_FADE_SPEED, NODO_IMAGE_TARGET_ALPHA);
            }
        } else if (targetNodeIndex === 8 && showNodo8Image) {
            if (distanceToTarget < 0.008) {
                nodo8ImageAlpha = Math.min(nodo8ImageAlpha + NODO_IMAGE_FADE_SPEED, NODO_IMAGE_TARGET_ALPHA);
            }
        } else if (targetNodeIndex === 16 && showNodo16Image) {
            if (distanceToTarget < 0.008) {
                nodo16ImageAlpha = Math.min(nodo16ImageAlpha + NODO_IMAGE_FADE_SPEED, NODO_IMAGE_TARGET_ALPHA);
            }
        }
        
        // Muovi verso il target
        scrollProgress += (targetT - scrollProgress) * MOVEMENT_SPEED;
        
        // Se siamo arrivati abbastanza vicino, fermati
        if (distanceToTarget < 0.0005) {
            scrollProgress = targetT;
            currentNodeIndex = targetNodeIndex;
            movementState = 'STOPPED';
            document.getElementById('current-node').textContent = (currentNodeIndex + 1);
            
            // Mantieni l'immagine visibile quando arriviamo al nodo
            if (currentNodeIndex === 1) {
                nodo1ImageAlpha = NODO_IMAGE_TARGET_ALPHA;
            } else if (currentNodeIndex === 8) {
                nodo8ImageAlpha = NODO_IMAGE_TARGET_ALPHA;
            } else if (currentNodeIndex === 16) {
                nodo16ImageAlpha = NODO_IMAGE_TARGET_ALPHA;
            } else {
                // Nascondi tutte le immagini
                showNodo1Image = false;
                showNodo8Image = false;
                showNodo16Image = false;
                nodo1ImageAlpha = 0;
                nodo8ImageAlpha = 0;
                nodo16ImageAlpha = 0;
            }
        }
    }
}

function setupScrollListeners() {
    let lastScrollTime = 0;
    let isProcessing = false;
    
    // Listener per wheel (rotellina mouse)
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
    
    // Listener per tastiera
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
    
    // Click su qualsiasi parte della pagina (per mobile e semplicità)
    window.addEventListener('click', function() {
        if (movementState === 'STOPPED' && !isProcessing) {
            isProcessing = true;
            startMovingToNextNode();
            
            setTimeout(() => {
                isProcessing = false;
            }, 300);
        }
    });
}

// ============ FUNZIONI P5 ============
function preload() {
    // Carica le immagini per i nodi
    nodo1Img = loadImage('assets/nodo_1.png');
    nodo8Img = loadImage('assets/nodo_8.png');
    nodo16Img = loadImage('assets/nodo_16.png');
}

function setup() {
    p5Instance = window;
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas');
    
    // Imposta le variabili width e height
    width = windowWidth;
    height = windowHeight;
    
    pathPoints = scalePoints(originalPoints, 8);
    smoothPath = createSmoothPath(pathPoints, 30);
    pathLength = calculatePathLength(smoothPath);
    
    // Calcola i 24 nodi equidistanti
    calculateNodes();
    
    // Inizializza le particelle stellato
    initStarParticles();
    
    // Setup event listeners per scroll
    setupScrollListeners();
    
    // Aggiorna il contatore iniziale
    document.getElementById('current-node').textContent = (currentNodeIndex + 1);
}

function draw() {
    // Aggiorna il movimento
    updateMovement();
    
    const currentPoint = getPointOnPath(scrollProgress, smoothPath, pathLength);
    
    // Sfondo nero con leggera sfumatura per profondità
    drawDarkGradient();
    
    // Disegna le stelle
    drawStars(currentPoint);
    
    push();
    const zoom = 0.025;
    translate(width/2, height/2);
    scale(zoom);
    translate(-currentPoint.x, -currentPoint.y);
    
    // DISEGNA PRIMA LE IMMAGINI (COSÌ STANNO DIETRO AL FILO)
    if (showNodo1Image && nodo1ImageAlpha > 0 && nodo1Img) {
        drawNodoImage(1, nodo1Img, nodo1ImageAlpha);
    }
    
    if (showNodo8Image && nodo8ImageAlpha > 0 && nodo8Img) {
        drawNodoImage(8, nodo8Img, nodo8ImageAlpha);
    }
    
    if (showNodo16Image && nodo16ImageAlpha > 0 && nodo16Img) {
        drawNodoImage(16, nodo16Img, nodo16ImageAlpha);
    }
    
    // Disegna i fili spiraleggianti
    drawSpiralThreads();
    
    // Disegna il percorso principale
    drawMainPath();
    
    // Disegna i nodi
    drawNodes();
    
    // Disegna il cerchietto
    drawMovingDot(currentPoint);
    
    pop();
}

function drawDarkGradient() {
    // Sfondo nero con leggera sfumatura per profondità
    for (let y = 0; y < height; y++) {
        const darkness = map(y, 0, height, 10, 0);
        stroke(darkness, darkness, darkness);
        line(0, y, width, y);
    }
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function drawStars(currentPoint) {
    const time = millis() * 0.001;
    const zoom = 0.025;
    
    // Per ogni stella
    starParticles.forEach(star => {
        // Calcola posizione relativa al punto corrente (considerando lo zoom)
        const relX = (star.x - currentPoint.x * zoom) * zoom;
        const relY = (star.y - currentPoint.y * zoom) * zoom;
        
        // Controlla se la stella è visibile nella viewport
        if (relX > -width/2 && relX < width/2 && relY > -height/2 && relY < height/2) {
            // Effetto tremolio
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
            const brightness = star.brightness * twinkle;
            
            // Disegna la stella
            noStroke();
            fill(255, 255, 255, brightness);
            ellipse(
                width/2 + relX / zoom,
                height/2 + relY / zoom,
                star.size,
                star.size
            );
            
            // Bagliore per stelle più grandi
            if (star.size > 2) {
                fill(255, 255, 255, brightness * 0.3);
                ellipse(
                    width/2 + relX / zoom,
                    height/2 + relY / zoom,
                    star.size * 2,
                    star.size * 2
                );
            }
        }
    });
}

function drawSpiralThreads() {
    const time = millis();
    
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
        const phaseOffset = (threadIndex / 8) * Math.PI * 2;
        const speed = 0.001;
        const radius = 200 * (0.7 + Math.random() * 0.6);
        
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
            const spiralAngle = t * Math.PI * 4 + phaseOffset + time * speed;
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
        stroke(color[0], color[1], color[2], 120);
        strokeWeight(15);
        strokeCap(ROUND);
        noFill();
        
        beginShape();
        threadPoints.forEach(point => {
            vertex(point.x, point.y);
        });
        endShape();
    }
}

function drawMainPath() {
    // LINEA PRINCIPALE BIANCA TRATTEGGIATA
    const pulse = Math.sin(millis() * 0.002) * 20;
    const currentThickness = 80 + pulse;
    
    stroke(255, 255, 255, 220);
    strokeWeight(currentThickness);
    strokeCap(ROUND);
    
    // Effetto tratteggiato
    drawingContext.setLineDash([100, 40]);
    
    noFill();
    beginShape();
    for (let i = 0; i < smoothPath.length; i += 1) {
        vertex(smoothPath[i].x, smoothPath[i].y);
    }
    endShape();
    
    // Ripristina linea solida
    drawingContext.setLineDash([]);
    
    // Bagliore
    for (let i = 1; i <= 3; i++) {
        stroke(255, 255, 255, 40 - i * 10);
        strokeWeight(currentThickness + i * 60);
        
        beginShape();
        for (let j = 0; j < smoothPath.length; j += 2) {
            vertex(smoothPath[j].x, smoothPath[j].y);
        }
        endShape();
    }
}

function drawNodes() {
    const time = millis() * 0.001;
    
    nodes.forEach((node, index) => {
        const isCurrent = index === currentNodeIndex;
        
        // Animazione di pulsazione per tutti i nodo
        const basePulse = Math.sin(time * 3 + index * 0.5) * 0.3 + 0.7;
        const nodeSize = 200 * basePulse;
        
        // Bagliore extra per nodo corrente
        if (isCurrent) {
            for (let i = 5; i > 0; i--) {
                const alpha = 20 - i * 3;
                const size = 400 + i * 80;
                const extraPulse = Math.sin(time * 2 + i) * 30;
                noStroke();
                fill(node.color[0], node.color[1], node.color[2], alpha);
                ellipse(node.x, node.y, size + extraPulse, size + extraPulse);
            }
        }
        
        // Anello del nodo rotante
        push();
        translate(node.x, node.y);
        rotate(time * 0.5 + index * 0.1);
        
        strokeWeight(30);
        stroke(node.color[0], node.color[1], node.color[2], isCurrent ? 200 : 100);
        noFill();
        ellipse(0, 0, nodeSize * 1.5, nodeSize * 1.5);
        
        // Piccoli punti sull'anello
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const pointX = Math.cos(angle) * nodeSize * 0.75;
            const pointY = Math.sin(angle) * nodeSize * 0.75;
            const pointPulse = Math.sin(time * 4 + i) * 10;
            
            fill(255, 255, 255, 200);
            noStroke();
            ellipse(pointX, pointY, 40 + pointPulse, 40 + pointPulse);
        }
        
        pop();
        
        // Centro del nodo
        noStroke();
        fill(node.color[0], node.color[1], node.color[2], isCurrent ? 255 : 150);
        ellipse(node.x, node.y, nodeSize * 0.6, nodeSize * 0.6);
        
        // Punto centrale luminoso
        fill(255, 255, 255, 255);
        ellipse(node.x, node.y, 40, 40);
        
        // Punto super luminoso
        fill(255, 255, 255, 255);
        ellipse(node.x, node.y, 10, 10);
    });
}

function drawNodoImage(nodeIndex, img, alpha) {
    if (nodes.length > nodeIndex && img) {
        const node = nodes[nodeIndex];
        const settings = NODO_IMAGE_SETTINGS[nodeIndex];
        
        if (!settings) return;
        
        push();
        
        // Calcola la posizione usando le impostazioni
        const imageX = node.x + settings.offsetX;
        const imageY = node.y + settings.offsetY;
        
        // Calcola dimensioni proporzionali
        const desiredWidth = img.width * settings.scale;
        const desiredHeight = img.height * settings.scale;
        
        // Applica la trasparenza SENZA STROKE/BORDO
        tint(255, alpha);
        
        // Disegna l'immagine senza alcun bordo
        image(img, imageX, imageY, desiredWidth, desiredHeight);
        
        pop();
    }
}

function drawMovingDot(currentPoint) {
    const time = millis() * 0.001;
    
    // Bagliore esterno molto ampio
    for (let i = 15; i > 0; i--) {
        const size = 300 + i * 40;
        const alpha = 8 - i * 0.4;
        const pulse = Math.sin(time * 2 + i * 0.3) * 20;
        
        noStroke();
        fill(255, 255, 255, alpha);
        ellipse(currentPoint.x, currentPoint.y, size + pulse, size + pulse);
    }
    
    // Bagliore intermedio
    for (let i = 5; i > 0; i--) {
        const size = 150 + i * 30;
        const alpha = 15 - i * 2;
        const pulse = Math.sin(time * 3 + i) * 15;
        
        fill(255, 255, 255, alpha);
        ellipse(currentPoint.x, currentPoint.y, size + pulse, size + pulse);
    }
    
    // Cerchietto principale (pulsante)
    const mainPulse = Math.sin(time * 5) * 25;
    noStroke();
    fill(255, 255, 255, 220);
    ellipse(currentPoint.x, currentPoint.y, 100 + mainPulse, 100 + mainPulse);
    
    // Nucleo brillante
    fill(255, 255, 200, 255);
    ellipse(currentPoint.x, currentPoint.y, 50, 50);
    
    // Punto centrale super luminoso
    fill(255, 255, 255, 255);
    ellipse(currentPoint.x, currentPoint.y, 15, 15);
    
    // Scie di movimento (solo quando si muove)
    if (movementState === 'MOVING_TO_NODE') {
        for (let i = 0; i < 12; i++) {
            const angle = time * 8 + (i / 12) * Math.PI * 2;
            const distance = 60 + Math.sin(time * 6) * 30;
            const trailX = currentPoint.x + Math.cos(angle) * distance;
            const trailY = currentPoint.y + Math.sin(angle) * distance;
            const trailSize = 20 + Math.sin(time * 7 + i) * 10;
            
            fill(255, 255, 255, 150);
            ellipse(trailX, trailY, trailSize, trailSize);
        }
    }
}

console.log("currentNode:", currentNodeIndex, "targetNode:", targetNodeIndex);


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    width = windowWidth;
    height = windowHeight;
    // Ricrea le stelle per il nuovo dimensionamento
    initStarParticles();
}

// ============ INIZIALIZZAZIONE ============
// Crea una nuova istanza di p5
new p5(function(p) {
    // Sostituisci le funzioni globali di p5
    window.setup = setup;
    window.draw = draw;
    window.windowResized = windowResized;
    window.preload = preload;
    window.loadImage = p.loadImage;
    window.image = p.image;
    window.createCanvas = p.createCanvas;
    window.resizeCanvas = p.resizeCanvas;
    window.background = p.background;
    window.fill = p.fill;
    window.stroke = p.stroke;
    window.strokeWeight = p.strokeWeight;
    window.noStroke = p.noStroke;
    window.noFill = p.noFill;
    window.ellipse = p.ellipse;
    window.rect = p.rect;
    window.line = p.line;
    window.beginShape = p.beginShape;
    window.endShape = p.endShape;
    window.vertex = p.vertex;
    window.translate = p.translate;
    window.scale = p.scale;
    window.rotate = p.rotate;
    window.push = p.push;
    window.pop = p.pop;
    window.millis = p.millis;
    window.textSize = p.textSize;
    window.textAlign = p.textAlign;
    window.text = p.text;
    window.tint = p.tint;
    window.strokeCap = p.strokeCap;
    window.drawingContext = p.drawingContext;
    window.width = p.width;
    window.height = p.height;
});