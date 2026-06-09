paper.install(window);
const noise = new SimplexNoise();

const config = {
    horizontalSpacing: 50,
    verticalSpacing: 45,
    heartSize: 20,
    noiseScale: 0.004,
    noiseAmplitude: 0.6,
};

const C1 = new Color(0, 0.047, 0.937);
const C2 = new Color(0.737, 0.573, 1);

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

    project.importSVG('poster.svg', function(item) {
        const textPaths = new CompoundPath();
        ['welcome', 'to', 'the', 'riot'].forEach(id => {
            const group = item.children[id];
            if (group) {
                group.children.forEach(path => {
                    if (path instanceof Path) {
                        textPaths.addChild(path.clone());
                    }
                });
            }
        });
        textPaths.visible = false;
        
        initGrid(symbol, textPaths);
        item.remove();
    });
});

function lerpColor(t, a, b) {
    return new Color(
        a.red + (b.red - a.red) * t,
        a.green + (b.green - a.green) * t,
        a.blue + (b.blue - a.blue) * t
    );
}

function initGrid(symbol, textPaths) {
    const start = svgToScreen(HEART_SVG_X, HEART_SVG_Y);
    const { width, height } = view.bounds;
    let maxDist = 0;
    let row = 0;
    while (start.y - row * config.verticalSpacing > 0) {
        const offset = row % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        let col = 0;
        while (start.x + offset + col * config.horizontalSpacing < width + config.horizontalSpacing) {
            const x = start.x + offset + col * config.horizontalSpacing;
            const y = start.y - row * config.verticalSpacing;

            if (textPaths && textPaths.contains(new Point(x, y))) {
                col++;
                continue;
            }

            const instance = symbol.place(new Point(x, y));
            const dist = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2);
            instance._t = dist;
            if (dist > maxDist) maxDist = dist;
            cuori.push(instance);
            col++;
        }
        row++;
    }
    cuori.forEach(c => {
        c._t = maxDist > 0 ? c._t / maxDist : 0;
        c.fillColor = lerpColor(c._t, C1, C2);
    });
    view.onFrame = updateNoise;
}

function updateNoise(event) {
    cuori.forEach(c => {
        const n = noise.noise3D(
            c.position.x * config.noiseScale,
            c.position.y * config.noiseScale,
            event.time * 0.5
        );
        const scale = Math.max(0.1, 1 + n * config.noiseAmplitude);
        c.scaling = new Point(scale, scale);
        const t = Math.max(0, Math.min(1, c._t + n * 0.15));
        c.fillColor = lerpColor(t, C1, C2);
    });
}
