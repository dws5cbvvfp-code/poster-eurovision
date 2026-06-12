paper.install(window);
const noise = new SimplexNoise();

const config = {
    horizontalSpacing: 50,
    verticalSpacing: 45,
    heartSize: 20,
    noiseScale: 0.004,
    noiseAmplitude: 0.6,
};

const SVG_W = 595.7;
const SVG_H = 841.8;
const HEART_SVG_X = 20;
const HEART_SVG_Y = 684;

let cuori = [];

function getSvgTransform() {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const imgAspect = SVG_W / SVG_H;
    const winAspect = winW / winH;
    let scale, ox, oy;
    if (winAspect > imgAspect) {
        scale = winH / SVG_H;
        ox = (winW - SVG_W * scale) / 2;
        oy = 0;
    } else {
        scale = winW / SVG_W;
        ox = 0;
        oy = (winH - SVG_H * scale) / 2;
    }
    return { scale, ox, oy };
}

function svgToScreen(svgX, svgY) {
    const { scale, ox, oy } = getSvgTransform();
    return new Point(ox + svgX * scale, oy + svgY * scale);
}

function svgRectToScreen(svgRect) {
    const { scale, ox, oy } = getSvgTransform();
    return {
        x: ox + svgRect.x * scale,
        y: oy + svgRect.y * scale,
        width: svgRect.width * scale,
        height: svgRect.height * scale
    };
}

async function loadExclusionZones() {
    try {
        const response = await fetch('poster.svg');
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const ids = ['welcome', 'to', 'the', 'riot'];
        const zones = [];

        const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        tempSvg.setAttribute('viewBox', `0 0 ${SVG_W} ${SVG_H}`);
        tempSvg.style.position = 'absolute';
        tempSvg.style.visibility = 'hidden';
        tempSvg.style.pointerEvents = 'none';
        document.body.appendChild(tempSvg);

        for (const id of ids) {
            const group = svgDoc.getElementById(id);
            if (!group) continue;
            const clone = group.cloneNode(true);
            clone.removeAttribute('visibility');
            tempSvg.appendChild(clone);
            const bbox = clone.getBBox();
            zones.push(svgRectToScreen(bbox));
            tempSvg.removeChild(clone);
        }

        document.body.removeChild(tempSvg);
        return zones;
    } catch (e) {
        console.warn('Failed to load exclusion zones:', e);
        return [];
    }
}

function isPointInExclusionZone(x, y, zones, padding = 8) {
    return zones.some(rect => {
        const padX = rect.width * padding / 100;
        const padY = rect.height * padding / 100;
        return (
            x >= rect.x - padX &&
            x <= rect.x + rect.width + padX &&
            y >= rect.y - padY &&
            y <= rect.y + rect.height + padY
        );
    });
}

function initGrid(symbol, exclusionZones) {
    const start = svgToScreen(HEART_SVG_X, HEART_SVG_Y);
    const { width } = view.bounds;
    let row = 0;
    while (start.y - row * config.verticalSpacing > 0) {
        const offset = row % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        let col = 0;
        while (start.x + offset + col * config.horizontalSpacing < width + config.horizontalSpacing) {
            const x = start.x + offset + col * config.horizontalSpacing;
            const y = start.y - row * config.verticalSpacing;

            if (!isPointInExclusionZone(x, y, exclusionZones)) {
                const instance = symbol.place(new Point(x, y));
                cuori.push(instance);
            }
            col++;
        }
        row++;
    }
    view.onFrame = updateNoise;
}

window.addEventListener('load', async function() {
    paper.setup('canvas');

    const cuore = new Path('M20.1,684.1c-.8-.8-1.8-1.2-2.7-2.2-1.1-1.1-1.4-2.7-.9-4.2.3-1,1.3-1.7,2.4-1.7s1.2.5,1.2,1.2c.2-.9.6-1.5,1.4-1.9.5-.3,1.1-.4,1.7-.3,1,0,1.7.8,1.9,1.8.3,1.5-.6,2.9-1.7,4l-1.4,1.3c-.4.4-.7.7-1,1.2l-.4.7h-.5v.1Z');
    cuore.fillColor = new Color(1, 1, 1);
    cuore.translate(-cuore.bounds.center.x, -cuore.bounds.center.y);
    cuore.scale(config.heartSize / cuore.bounds.width);

    const symbol = new SymbolDefinition(cuore);

    const exclusionZones = await loadExclusionZones();
    console.log('Exclusion zones loaded:', exclusionZones);

    initGrid(symbol, exclusionZones);
});

function updateNoise(event) {
    cuori.forEach(c => {
        const n = noise.noise3D(
            c.position.x * config.noiseScale,
            c.position.y * config.noiseScale,
            event.time * 0.5
        );
        const scale = Math.max(0.1, 1 + n * config.noiseAmplitude);
        c.scaling = new Point(scale, scale);
    });
}