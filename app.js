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

function initGrid(symbol) {
    console.log("Grid setup placeholder");
}
