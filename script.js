// ============ DATI DEL PERCORSO ============
const ORIGINAL_POINTS = [
    {x: 7853, y: 16849}, {x: 10975, y: 21322}, {x: 8947, y: 20178},
    {x: 11477, y: 18139}, {x: 14239, y: 15658}, {x: 10053, y: 13004},
    {x: 11477, y: 12162}, {x: 16828, y: 13392}, {x: 16577, y: 10112},
    {x: 13297, y: 5602}, {x: 16577, y: 3789}, {x: 16828, y: 4933},
    {x: 18166, y: 4291}, {x: 19547, y: 6341}, {x: 22309, y: 5602},
    {x: 24165, y: 7285}, {x: 27035, y: 8105}, {x: 25028, y: 11911},
    {x: 19798, y: 11409}, {x: 23294, y: 9610}, {x: 28861, y: 6783},
    {x: 31530, y: 5184}, {x: 30516, y: 1861}, {x: 34055, y: 2854},
    {x: 36321, y: 6532}, {x: 37616, y: 9861}, {x: 36688, y: 13011},
    {x: 30516, y: 8607}, {x: 35372, y: 11544}, {x: 31638, y: 18139},
    {x: 30265, y: 21613}, {x: 35121, y: 25044}, {x: 35833, y: 29619},
    {x: 33654, y: 35433}, {x: 11226, y: 35433}, {x: 11226, y: 45694}
];

const NODO_IMAGE_SETTINGS = {
    1: { offsetX: -10000, offsetY: 1000, scale: 8 },
    2: { offsetX: -800, offsetY: -200, scale: 10 },
    3: { offsetX: -12000, offsetY: -6000, scale: 10 },
    4: { offsetX: -4000, offsetY: 1500, scale: 9 },
    5: { offsetX: -8000, offsetY: -1000, scale: 10 },
    6: { offsetX: 1000, offsetY: -5000, scale: 6.5 },
    7: { offsetX: -3200, offsetY: -6500, scale: 10 },
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
    24: { offsetX: 2000, offsetY: -2000, scale: 11 },
    25: { offsetX: -2000, offsetY: -5000, scale: 8 },
    26: { offsetX: 2000, offsetY: -2000, scale: 1.5 }
};

// Testi per i nodi
const nodo2Text = `QuaLCosa si Avvolge… una CURVA che danza… 
ritmO… raPIdiTà… LE grAzie conDuconO alla lettera, 
la CREAno, la fanno naSCerE: Scende la priMa astE. 
Veloce, sPESSA non guarda DoVe VA… poi…ralLLEnta.
La barrA divEnta un PuNto di sospEnsiOne che deViA 
il moviMento vErSo destra,
un'altra asta … SLASH! 
Un taglio.  
E pOI… riNasCita.`;

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

const nodo13Text = `Testo per il nodo 13.`;
const nodo21Text = `Testo per il nodo 21.`;

// ============ COSTANTI ============
const NODE_COUNT = 26;
const MOVEMENT_SPEED = 0.15;
const STAR_COUNT = 100;
const NODO_IMAGE_TARGET_ALPHA = 200;
const NODO_IMAGE_FADE_SPEED = 5;
const DESCRIPTION_FADE_SPEED = 8;
const BASE_TEXT_SIZE = 780;

const TEXT_OFFSET_X_NODO2 = -20000;
const TEXT_OFFSET_X_NODO3 = 22000;
const TEXT_OFFSET_X_NODO13 = 20000;
const TEXT_OFFSET_X_NODO21 = -18000;

// ============ STATO GLOBALE ============
let scrollProgress = 0;
let pathPoints = [], smoothPath = [], pathLength = 0;
let nodes = [], currentNodeIndex = 0;
let movementState = 'STOPPED';
let targetNodeIndex = 0;
let isProcessing = false;

let nodoImages = {};
let showNodoImages = {};
let nodoImageAlphas = {};

let starParticles = [];

let showDescriptionNodo2 = false;
let showDescriptionNodo3 = false;
let showDescriptionNodo13 = false;
let showDescriptionNodo21 = false;

let textLines = [];
let textLinesNodo3 = [];
let textLinesNodo13 = [];
let textLinesNodo21 = [];
let descriptionAlpha = 0;
let descriptionAlphaNodo3 = 0;
let descriptionAlphaNodo13 = 0;
let descriptionAlphaNodo21 = 0;

let wordEntryStates = {};
let wordEntryStatesNodo3 = {};
let descriptionStartTime = 0;

let nodeCounter, instructionMessage;

// Inizializza gli stati delle immagini
for (let i = 1; i <= 26; i++) {
    showNodoImages[i] = false;
    nodoImageAlphas[i] = 0;
}

// ============ FUNZIONI UTILITY ============
function scalePoints(points, multiplier) {
    return points.map(p => ({ x: p.x * multiplier, y: p.y * multiplier }));
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
                [220, 220, 220],
                [240, 240, 240],
                [255, 255, 255],
                [200, 200, 200]
            ][i % 4]
        });
    }
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// ============ GESTIONE UI ============
function initUIElements() {
    nodeCounter = document.querySelector('.node-counter');
    instructionMessage = document.querySelector('.instruction-message');
}

function updateUI() {
    const nodeNumber = currentNodeIndex + 1;
    document.querySelector('.node-number').textContent = `Nodo ${nodeNumber}/26`;
    
    if (nodeCounter) {
        nodeCounter.style.opacity = '1';
    }
    
    updateInstructionMessage();
}

function updateInstructionMessage() {
    if (!instructionMessage) return;
    
    const hasActiveDescription = showDescriptionNodo2 || showDescriptionNodo3 || 
                                showDescriptionNodo13 || showDescriptionNodo21;
    
    if (hasActiveDescription) {
        instructionMessage.textContent = "Click per chiudere la descrizione";
        instructionMessage.style.opacity = '1';
    } else if (movementState === 'MOVING_TO_NODE') {
        instructionMessage.textContent = "Raggiungendo il nodo...";
        instructionMessage.style.opacity = '1';
    } else {
        instructionMessage.style.opacity = '1';
    }
}

// ============ NAVIGAZIONE ============
function startMoving(direction) {
    if (movementState === 'STOPPED' && !isProcessing) {
        let newTargetNodeIndex = currentNodeIndex + direction;
        newTargetNodeIndex = Math.max(0, Math.min(newTargetNodeIndex, NODE_COUNT - 1));
        
        if (newTargetNodeIndex === currentNodeIndex) return;
        
        targetNodeIndex = newTargetNodeIndex;
        movementState = 'MOVING_TO_NODE';
        isProcessing = true;
        
        // Nascondi tutte le immagini
        for (let i = 1; i <= 26; i++) {
            showNodoImages[i] = false;
            nodoImageAlphas[i] = 0;
        }
        
        // Mostra l'immagine del nodo target
        if (targetNodeIndex >= 0 && targetNodeIndex < 26) {
            showNodoImages[targetNodeIndex + 1] = true;
        }
        
        // Nascondi tutte le descrizioni
        showDescriptionNodo2 = false;
        showDescriptionNodo3 = false;
        showDescriptionNodo13 = false;
        showDescriptionNodo21 = false;
        
        updateInstructionMessage();
    }
}

function updateMovement() {
    if (movementState === 'MOVING_TO_NODE') {
        const targetT = nodes[targetNodeIndex].t;
        const distanceToTarget = Math.abs(targetT - scrollProgress);
        
        // Anima l'immagine del nodo
        const nodoIndex = targetNodeIndex + 1;
        if (nodoIndex >= 1 && nodoIndex <= 26 && showNodoImages[nodoIndex]) {
            if (distanceToTarget < 0.008) {
                nodoImageAlphas[nodoIndex] = Math.min(
                    nodoImageAlphas[nodoIndex] + NODO_IMAGE_FADE_SPEED, 
                    NODO_IMAGE_TARGET_ALPHA
                );
            }
        }
        
        // Muovi verso il target
        scrollProgress += (targetT - scrollProgress) * MOVEMENT_SPEED;
        
        // Se siamo abbastanza vicini, fermati
        if (distanceToTarget < 0.0005) {
            scrollProgress = targetT;
            currentNodeIndex = targetNodeIndex;
            movementState = 'STOPPED';
            isProcessing = false;
            
            // Aggiorna la fluid simulation
            if (window.controlFluidEffect) {
                window.controlFluidEffect(currentNodeIndex, NODE_COUNT);
            }
            
            updateInstructionMessage();
            
            // Imposta l'alpha finale per l'immagine del nodo corrente
            const nodoIndex = currentNodeIndex + 1;
            if (nodoIndex >= 1 && nodoIndex <= 26) {
                nodoImageAlphas[nodoIndex] = NODO_IMAGE_TARGET_ALPHA;
            } else {
                for (let i = 1; i <= 26; i++) {
                    showNodoImages[i] = false;
                    nodoImageAlphas[i] = 0;
                }
            }
        }
    }
    
    updateUI();
}

// ============ SKETCH P5 ============
const sketch = (p) => {
    let canvas;
    
    let localTextLines = [];
    let localWordEntryStates = {};
    let localDescriptionStartTime = 0;
    
    let localTextLinesNodo3 = [];
    let localWordEntryStatesNodo3 = {};
    let localDescriptionStartTimeNodo3 = 0;
    
    let localTextLinesNodo13 = [];
    let localTextLinesNodo21 = [];
    
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
                brightness: p.random(100, 200) * 0.5,
                twinkleSpeed: p.random(0.01, 0.03),
                twinklePhase: p.random(p.TWO_PI)
            });
        }
    }
    
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
                    const placeholder = p.createGraphics(200, 200);
                    placeholder.background(240, 240, 240, 100);
                    placeholder.fill(50, 50, 50);
                    placeholder.textSize(24);
                    placeholder.textAlign(p.CENTER, p.CENTER);
                    placeholder.text(placeholderText, 100, 100);
                    resolve(placeholder);
                }
            );
        });
    }
    
    // Funzioni per creare le linee di testo (semplificate)
    function createTextLinesNodo2(node) {
        localTextLines = [{
            text: nodo2Text.substring(0, 50) + "...",
            x: node.x + TEXT_OFFSET_X_NODO2,
            y: node.y,
            size: 700,
            color: [255, 255, 255]
        }];
        localDescriptionStartTime = p.millis();
    }
    
    function createTextLinesNodo3(node) {
        localTextLinesNodo3 = [{
            text: nodo3Text.substring(0, 50) + "...",
            x: node.x + TEXT_OFFSET_X_NODO3,
            y: node.y,
            size: 700,
            color: [255, 255, 255]
        }];
        localDescriptionStartTimeNodo3 = p.millis();
    }
    
    function createTextLinesNodo13(node) {
        localTextLinesNodo13 = [{
            text: nodo13Text,
            x: node.x + TEXT_OFFSET_X_NODO13,
            y: node.y,
            size: 700,
            color: [255, 255, 255]
        }];
    }
    
    function createTextLinesNodo21(node) {
        localTextLinesNodo21 = [{
            text: nodo21Text,
            x: node.x + TEXT_OFFSET_X_NODO21,
            y: node.y,
            size: 700,
            color: [255, 255, 255]
        }];
    }
    
    function drawNodo2Description() {
        if (!showDescriptionNodo2 && descriptionAlpha <= 0) return;
        
        if (showDescriptionNodo2) {
            descriptionAlpha = Math.min(descriptionAlpha + DESCRIPTION_FADE_SPEED, 255);
        } else {
            descriptionAlpha = Math.max(descriptionAlpha - DESCRIPTION_FADE_SPEED, 0);
        }
        
        localTextLines.forEach(line => {
            p.push();
            p.translate(line.x, line.y);
            p.fill(255, 255, 255, descriptionAlpha);
            p.noStroke();
            p.textSize(line.size);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(line.text, 0, 0);
            p.pop();
        });
    }
    
    function drawNodo3Description() {
        if (!showDescriptionNodo3 && descriptionAlphaNodo3 <= 0) return;
        
        if (showDescriptionNodo3) {
            descriptionAlphaNodo3 = Math.min(descriptionAlphaNodo3 + DESCRIPTION_FADE_SPEED, 255);
        } else {
            descriptionAlphaNodo3 = Math.max(descriptionAlphaNodo3 - DESCRIPTION_FADE_SPEED, 0);
        }
        
        localTextLinesNodo3.forEach(line => {
            p.push();
            p.translate(line.x, line.y);
            p.fill(255, 255, 255, descriptionAlphaNodo3);
            p.noStroke();
            p.textSize(line.size);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(line.text, 0, 0);
            p.pop();
        });
    }
    
    function drawNodo13Description() {
        // Implementazione simile per gli altri nodi
    }
    
    function drawNodo21Description() {
        // Implementazione simile per gli altri nodi
    }
    
    function drawLightGradient() {
        p.clear();
        p.background(0, 0, 0, 255);
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
                p.fill(200, 200, 200, brightness);
                p.ellipse(p.width/2 + relX / zoom, p.height/2 + relY / zoom, star.size, star.size);
            }
        });
    }
    
    function drawSpiralThreads() {
        const time = p.millis();
        
        const colors = [
            [180, 180, 180],
            [200, 200, 200],
            [220, 220, 220],
            [240, 240, 240],
            [255, 255, 255],
            [230, 230, 230],
            [210, 210, 210],
            [190, 190, 190]
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
            p.stroke(200, 200, 200, 40 - i * 10);
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
                
                p.fill(240, 240, 240, 200);
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
        if (!nodes || nodes.length <= nodeIndex || !img || alpha <= 0) return;
        
        const node = nodes[nodeIndex];
        const settings = NODO_IMAGE_SETTINGS[nodeIndex + 1];
        if (!settings) return;
        
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
            console.warn("Errore nel disegno dell'immagine del nodo", nodeIndex + 1, e);
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
        
        p.fill(200, 200, 200, 255);
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
    
    function handleCanvasClick(e) {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const currentPoint = getPointOnPath(scrollProgress, smoothPath, pathLength);
        const zoom = 0.025;
        
        const worldX = (clickX - p.width/2) / zoom + currentPoint.x;
        const worldY = (clickY - p.height/2) / zoom + currentPoint.y;
        
        const nodo2 = nodes[1];
        const distToNodo2 = distance(worldX, worldY, nodo2.x, nodo2.y);
        
        const nodo3 = nodes[2];
        const distToNodo3 = distance(worldX, worldY, nodo3.x, nodo3.y);
        
        if (distToNodo2 < 1500) {
            showDescriptionNodo2 = !showDescriptionNodo2;
            showDescriptionNodo3 = false;
            showDescriptionNodo13 = false;
            showDescriptionNodo21 = false;
            
            updateInstructionMessage();
            
            if (showDescriptionNodo2 && localTextLines.length === 0) {
                createTextLinesNodo2(nodo2);
            }
            return;
        }
        
        if (distToNodo3 < 1500) {
            showDescriptionNodo3 = !showDescriptionNodo3;
            showDescriptionNodo2 = false;
            showDescriptionNodo13 = false;
            showDescriptionNodo21 = false;
            
            updateInstructionMessage();
            
            if (showDescriptionNodo3 && localTextLinesNodo3.length === 0) {
                createTextLinesNodo3(nodo3);
            }
            return;
        }
        
        // Chiudi tutte le descrizioni se si clicca altrove
        if (showDescriptionNodo2 || showDescriptionNodo3 || showDescriptionNodo13 || showDescriptionNodo21) {
            showDescriptionNodo2 = false;
            showDescriptionNodo3 = false;
            showDescriptionNodo13 = false;
            showDescriptionNodo21 = false;
            updateInstructionMessage();
        }
    }
    
    p.preload = async function() {
        console.log("Caricamento immagini dei nodi...");
        
        // Carica le immagini dei nodi
        for (let i = 1; i <= 26; i++) {
            const imgPath = `assets/nodo_${i}.png`;
            
            try {
                const img = await loadImageSafely(imgPath, `Nodo ${i}`);
                nodoImages[i] = img;
                console.log(`✅ Immagine caricata per il Nodo ${i}`);
            } catch (e) {
                console.warn(`Errore nel caricamento dell'immagine per il nodo ${i}:`, e);
                // Crea un placeholder se l'immagine non esiste
                const placeholder = p.createGraphics(200, 200);
                placeholder.background(240, 240, 240, 100);
                placeholder.fill(50, 50, 50);
                placeholder.textSize(24);
                placeholder.textAlign(p.CENTER, p.CENTER);
                placeholder.text(`Nodo ${i}`, 100, 100);
                nodoImages[i] = placeholder;
            }
        }
    };
    
    p.setup = function() {
        console.log("Setup p5.js - 26 nodi");
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('p5-canvas');
        
        window.width = p.width;
        window.height = p.height;
        
        pathPoints = scalePoints(ORIGINAL_POINTS, 8);
        smoothPath = createSmoothPath(pathPoints, 30);
        pathLength = calculatePathLength(smoothPath);
        
        calculateNodes();
        
        initStarParticles();
        
        initUIElements();
        
        canvas.elt.addEventListener('click', handleCanvasClick);
        canvas.elt.style.cursor = 'pointer';
        
        // Scrolling in avanti e indietro
        window.addEventListener('wheel', function(e) {
            if (isProcessing || movementState !== 'STOPPED') return;
            
            if (Math.abs(e.deltaY) > 5 || Math.abs(e.deltaX) > 5) {
                e.preventDefault();
                const direction = e.deltaY > 0 ? 1 : -1;
                startMoving(direction);
            }
        }, { passive: false });
        
        // Tasti freccia per navigazione
        window.addEventListener('keydown', function(e) {
            if (isProcessing || movementState !== 'STOPPED') return;
            
            if (['Space', 'ArrowDown'].includes(e.code)) {
                e.preventDefault();
                startMoving(1);
            } else if (['ArrowUp'].includes(e.code)) {
                e.preventDefault();
                startMoving(-1);
            }
        });
        
        // Inizializza la fluid simulation
        setTimeout(() => {
            if (window.controlFluidEffect) {
                window.controlFluidEffect(0, NODE_COUNT);
            }
        }, 1000);
        
        updateInstructionMessage();
        
        console.log("Setup completato con", nodes.length, "nodi");
    };
    
    p.draw = function() {
        updateMovement();
        const currentPoint = getPointOnPath(scrollProgress, smoothPath, pathLength);
        
        drawLightGradient();
        drawStars(currentPoint);
        
        p.push();
        const zoom = 0.025;
        p.translate(p.width/2, p.height/2);
        p.scale(zoom);
        p.translate(-currentPoint.x, -currentPoint.y);
        
        // Disegna le immagini dei nodi
        for (let i = 1; i <= 26; i++) {
            if (showNodoImages[i] && nodoImageAlphas[i] > 0 && nodoImages[i]) {
                drawNodoImage(i-1, nodoImages[i], nodoImageAlphas[i]);
            }
        }
        
        drawSpiralThreads();
        drawMainPath();
        drawNodes();
        drawMovingDot(currentPoint);
        
        // Disegna le descrizioni dei nodi
        if (showDescriptionNodo2 || descriptionAlpha > 0) {
            drawNodo2Description();
        }
        
        if (showDescriptionNodo3 || descriptionAlphaNodo3 > 0) {
            drawNodo3Description();
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

// ============ AVVIO ============
new p5(sketch);