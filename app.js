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
