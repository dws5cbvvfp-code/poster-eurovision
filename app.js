paper.install(window);
const noise = new SimplexNoise();

const config = {
    horizontalSpacing: 50,
    verticalSpacing: 45,
    heartSize: 24,
    noiseScale: 0.005,
    noiseAmplitude: 0.6,
};

let cuori = [];

window.addEventListener('load', function() {
    paper.setup('canvas');
    project.importSVG('poster.svg', function(poster) {
        poster.fitBounds(view.bounds, true);
        poster.position = view.center;

        const cuore = poster.getItem({ id: 'cuore' });
        if (!cuore) return;
        cuore.remove();

        cuore.scale(config.heartSize / cuore.bounds.width);
        const symbol = new SymbolDefinition(cuore);
        initGrid(symbol);
    });
});

function initGrid(symbol) {
    const { width, height } = view.bounds;
    for (let y = 0; y < height; y += config.verticalSpacing) {
        const offset = (y / config.verticalSpacing) % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        for (let x = -offset; x < width + config.horizontalSpacing; x += config.horizontalSpacing) {
            const instance = symbol.place(new Point(x, y));
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
        const scale = Math.max(0.1, 1 + n * config.noiseAmplitude);
        c.scaling = new Point(scale, scale);
    });
}
