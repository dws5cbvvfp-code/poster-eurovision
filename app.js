paper.install(window);
const noise = new SimplexNoise();

window.addEventListener('load', function() {
    paper.setup('canvas');
    project.importSVG('poster.svg', function() {
        const cuore = project.getItem({ id: 'cuore' });
        if (!cuore) return;
        cuore.remove();
        const symbol = new SymbolDefinition(cuore);
        initGrid(symbol);
    });
});

const config = {
    horizontalSpacing: 40,
    verticalSpacing: 35,
    baseScale: 0.5,
    noiseScale: 0.01,
    noiseAmplitude: 0.3,
};

let cuori = [];

function initGrid(symbol) {
    const { width, height } = view.bounds;
    for (let y = 0; y < height; y += config.verticalSpacing) {
        const offset = (y / config.verticalSpacing) % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        for (let x = -offset; x < width + config.horizontalSpacing; x += config.horizontalSpacing) {
            let instance = symbol.place(new Point(x, y));
            cuori.push(instance);
        }
    }
    view.onFrame = updateNoise;
}

function updateNoise(event) {
    cuori.forEach(c => {
        const n = noise.noise3D(
            c.position.x * config.noiseScale,
            c.position.y * config.noiseScale,
            event.time * 0.1
        );
        const scale = Math.max(0, config.baseScale + n * config.noiseAmplitude);
        c.scaling = new Point(scale, scale);
    });
}
