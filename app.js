paper.install(window);
const noise = new SimplexNoise();

const config = {
    horizontalSpacing: 50,
    verticalSpacing: 45,
    heartSize: 20,
    noiseScale: 0.004,
    noiseAmplitude: 0.6,
};

let cuori = [];

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
