(function () {
    'use strict'

    let canvas = null,
        context = null,
        canvasRect = null, 
        cellSize = 0;

    const NB_CELLS = 15,
        HEADER_HEIGHT = 100;



    function pageLoad() {

        let canvasElt = document.getElementById('canvasDraw');
        canvasRect = canvasElt.getBoundingClientRect();
        canvasElt.width = canvasRect.width;
        canvasElt.height = canvasRect.width + HEADER_HEIGHT;

        cellSize = Math.round(canvasRect.width / NB_CELLS);
        console.log(cellSize);

        canvas = new fabric.Canvas('canvasDraw', { selection: false });
        // snap to grid


        //window.requestAnimationFrame(drawCanvas);
        drawCanvas();
        
        canvas.on('object:moving', function (options) {
            options.target.set({
                left: Math.round(options.target.left / cellSize) * cellSize,
                top: Math.round(options.target.top / cellSize) * cellSize
            });
        });
    }

    function drawGrid(size) {

        let max = Math.round(size/cellSize);
        let maxSize = max*cellSize;
        console.log(max);
        for (var i = 0; i <= max; i++) {
            canvas.add(new fabric.Line([i * cellSize, HEADER_HEIGHT, i * cellSize, maxSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
            canvas.add(new fabric.Line([0, i * cellSize + HEADER_HEIGHT, maxSize, i * cellSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
        }

        canvas.add(new fabric.Rect({
            left: (canvasRect.width / 2) - cellSize,
            top: cellSize,
            width: cellSize * 2,
            height: cellSize,
            fill: '#faa',
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            hasControls:false
        }));


    }

    function drawCanvas() {
        //context.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid(canvasRect.width, Math.round(canvasRect.width / NB_CELLS));

        //window.requestAnimationFrame(drawCanvas);
    }

    window.addEventListener('load', pageLoad);
})();