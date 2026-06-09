# Implementazione Animazione Poster Eurovision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare una animazione in Paper.js che riempie il poster con una griglia triangolare di cuori, la cui dimensione varia in base a un noise.

**Architecture:**
1. Setup ambiente base con Paper.js.
2. Parsing e estrazione del simbolo SVG.
3. Implementazione algoritmo griglia triangolare.
4. Integrazione Noise.js per la variazione di scala.
5. Setup animazione.

**Tech Stack:**
- Paper.js
- (Opzionale) simplex-noise per la generazione del rumore.

---

### Task 1: Setup Progetto e Caricamento SVG

**Files:**
- Create: `index.html`
- Create: `app.js`

- [ ] **Step 1: Crea index.html di base**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Eurovision Poster Animation</title>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"></script>
    <style>canvas { width: 100%; height: 100%; }</style>
</head>
<body>
    <canvas id="canvas" resize></canvas>
    <script type="text/javascript" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Setup app.js e caricamento SVG**
```javascript
paper.install(window);
window.onload = function() {
    paper.setup('canvas');
    project.importSVG('poster.svg', function(item) {
        // Estrai il cuore e inizializza
        const cuore = project.getItem({ id: 'cuore' });
        cuore.remove();
        const symbol = new SymbolDefinition(cuore);
        initGrid(symbol);
    });
};

function initGrid(symbol) {
    console.log("Grid setup placeholder");
}
```

- [ ] **Step 3: Commit**
```bash
git add index.html app.js
git commit -m "feat: initial project setup"
```

### Task 2: Implementazione Griglia Triangolare

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Implementa la logica di posizionamento**
```javascript
const config = {
    horizontalSpacing: 40,
    verticalSpacing: 35,
};

function initGrid(symbol) {
    const { width, height } = view.bounds;
    for (let y = 0; y < height; y += config.verticalSpacing) {
        let offset = (y / config.verticalSpacing) % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        for (let x = -offset; x < width + config.horizontalSpacing; x += config.horizontalSpacing) {
            symbol.place(new Point(x, y));
        }
    }
}
```

- [ ] **Step 2: Commit**
```bash
git add app.js
git commit -m "feat: implement triangular grid"
```

### Task 3: Integrazione Noise e Animazione

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Setup Noise e Variazione Dimensionale**
```javascript
const noise = new SimplexNoise();
const config = {
    horizontalSpacing: 40,
    verticalSpacing: 35,
    baseScale: 0.5,
    noiseScale: 0.01,
    noiseAmplitude: 0.3
};

let cuori = [];

function initGrid(symbol) {
    const { width, height } = view.bounds;
    for (let y = 0; y < height; y += config.verticalSpacing) {
        let offset = (y / config.verticalSpacing) % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        for (let x = -offset; x < width + config.horizontalSpacing; x += config.horizontalSpacing) {
            let instance = symbol.place(new Point(x, y));
            cuori.push(instance);
        }
    }
    view.onFrame = updateNoise;
}

function updateNoise(event) {
    const t = event.time;
    cuori.forEach(c => {
        let n = noise.noise2D(c.position.x * config.noiseScale, c.position.y * config.noiseScale);
        let scale = config.baseScale + (n * config.noiseAmplitude);
        c.scale(scale / c.scaling.x); // Reset scaling base before applying new
    });
}
```

- [ ] **Step 2: Commit**
```bash
git add app.js
git commit -m "feat: add noise-based animation"
```
