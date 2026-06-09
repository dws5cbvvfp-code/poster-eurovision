# Design Spec: Animazione Poster Eurovision

## 1. Obiettivo
Creare una visualizzazione dinamica per un poster Eurovision, replicando un oggetto SVG (cuore) in una griglia triangolare che copre l'intero spazio. La dimensione di ogni cuore varia dinamicamente basandosi su un valore di noise, creando un effetto visivo organico.

## 2. Tecnologie
- [Paper.js](http://paperjs.org/): Libreria principale per la manipolazione vettoriale e rendering su Canvas.

## 3. Architettura Tecnica

### 3.1. Parsing e Simboli
- Caricare `poster.svg`.
- Identificare il nodo `<path id="cuore" ... />`.
- Convertire il tracciato del cuore in un `Symbol` di Paper.js per massimizzare le performance di rendering delle numerose istanze.

### 3.2. Generazione della Griglia
- Utilizzare una disposizione su base esagonale (offset riga per riga) per ottenere la griglia triangolare.
- Parametri di configurazione:
    - `horizontalSpacing`: distanza tra cuori in orizzontale.
    - `verticalSpacing`: distanza tra righe.
- Calcolo dinamico:
    ```javascript
    for (let y = 0; y < height; y += verticalSpacing) {
        let offset = (y / verticalSpacing) % 2 === 0 ? 0 : horizontalSpacing / 2;
        for (let x = -offset; x < width; x += horizontalSpacing) {
            // Instanza cuore
        }
    }
    ```

### 3.3. Variazione Dimensionale (Noise)
- Utilizzare una funzione noise 2D per mappare la posizione (x, y) a un valore di scala.
- Formula:
    ```javascript
    scale = baseScale + (noise(x * scaleFactor, y * scaleFactor) * amplitude);
    ```
- La posizione rispetto al centro influenzerà il `baseScale` o l' `amplitude` per permettere la variazione richiesta.

## 4. Configurazione Esposta
L'implementazione includerà un oggetto di configurazione per facilitare la regolazione fine:
```javascript
const config = {
    horizontalSpacing: 40,
    verticalSpacing: 35,
    baseScale: 0.5,
    noiseScale: 0.01,
    noiseAmplitude: 0.3
};
```

## 5. Testing e Verifica
- Verifica del corretto parsing dell'SVG.
- Test di performance su un numero elevato di istanze.
- Verifica visiva della fluidità della griglia triangolare.
