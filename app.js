paper.install(window);
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
};

function initGrid(symbol) {
    const { width, height } = view.bounds;
    for (let y = 0; y < height; y += config.verticalSpacing) {
        const offset = (y / config.verticalSpacing) % 2 === 0 ? 0 : config.horizontalSpacing / 2;
        for (let x = -offset; x < width + config.horizontalSpacing; x += config.horizontalSpacing) {
            symbol.place(new Point(x, y));
        }
    }
}
