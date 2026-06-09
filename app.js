paper.install(window);
const noise = new SimplexNoise();

const config = {
    horizontalSpacing: 50,
    verticalSpacing: 45,
    heartSize: 20,
    noiseScale: 0.004,
    noiseAmplitude: 0.6,
};

const COLORS = [
    new Color(188/255, 146/255, 255/255),
    new Color(181/255,  97/255, 255/255),
    new Color( 48/255,  95/255, 242/255),
    new Color(  0/255,  12/255, 239/255),
];

const SVG_W = 595.7;
const SVG_H = 841.8;
const HEART_SVG_X = 20;
const HEART_SVG_Y = 684;

let cuori = [];

function svgToScreen(svgX, svgY) {
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
    return new Point(ox + svgX * scale, oy + svgY * scale);
}

window.addEventListener('load', function() {
    paper.setup('canvas');

    const cuore = new Path('M20.1,684.1c-.8-.8-1.8-1.2-2.7-2.2-1.1-1.1-1.4-2.7-.9-4.2.3-1,1.3-1.7,2.4-1.7s1.2.5,1.2,1.2c.2-.9.6-1.5,1.4-1.9.5-.3,1.1-.4,1.7-.3,1,0,1.7.8,1.9,1.8.3,1.5-.6,2.9-1.7,4l-1.4,1.3c-.4.4-.7.7-1,1.2l-.4.7h-.5v.1Z');
    cuore.fillColor = new Color(1, 1, 1);
    cuore.translate(-cuore.bounds.center.x, -cuore.bounds.center.y);
    cuore.scale(config.heartSize / cuore.bounds.width);

    const symbol = new SymbolDefinition(cuore);
    initGrid(symbol);
});

function initGrid(symbol) {
    const start = svgToScreen(HEART_SVG_X, HEART_SVG_Y);
    const { width, height } = view.bounds;
    let row = 0;
    while (start.y - row * config.verticalSpacing > 0) {
        const offset = row % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        let col = 0;
        while (start.x + offset + col * config.horizontalSpacing < width + config.horizontalSpacing) {
            const x = start.x + offset + col * config.horizontalSpacing;
            const y = start.y - row * config.verticalSpacing;
            const instance = symbol.place(new Point(x, y));
            cuori.push(instance);
            col++;
        }
        row++;
    }
    view.onFrame = updateNoise;
}

function getColor(t) {
    const duration = 6;
    const phase = (t / duration * COLORS.length) % COLORS.length;
    const idx = Math.floor(phase);
    const frac = phase - idx;
    const c1 = COLORS[idx];
    const c2 = COLORS[(idx + 1) % COLORS.length];
    return new Color(
        c1.red + (c2.red - c1.red) * frac,
        c1.green + (c2.green - c1.green) * frac,
        c1.blue + (c2.blue - c1.blue) * frac
    );
}

function updateNoise(event) {
    const color = getColor(event.time);
    cuori.forEach(c => {
        const n = noise.noise3D(
            c.position.x * config.noiseScale,
            c.position.y * config.noiseScale,
            event.time * 0.1
        );
        const scale = Math.max(0.1, 1 + n * config.noiseAmplitude);
        c.scaling = new Point(scale, scale);
        c.fillColor = color;
    });
}
