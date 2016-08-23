(function () {
    'use strict'

    let canvas = null,
        context = null,
        canvasRect = null, 
        cellSize = 0,
        rectBasic = null;

    const NB_CELLS = 15,
        HEADER_HEIGHT = 100;



    function pageLoad() {

        let canvasElt = document.getElementById('canvasDraw');
        canvasRect = canvasElt.getBoundingClientRect();
        canvasElt.width = canvasRect.width;
        canvasElt.height = canvasRect.width + HEADER_HEIGHT;

        cellSize = Math.round(canvasRect.width / NB_CELLS);
        console.log(cellSize, canvasRect);

        canvas = new fabric.Canvas('canvasDraw', { selection: false });



        //document.getElementById('color-picker').style.top = (canvasRect.top - 40)+'px';

        $("#color-picker").spectrum({
            color: "#f00",
            move: function(tinycolor) { console.log('move', tinycolor)},
            show: function(tinycolor) { console.log('show', tinycolor)},
            hide: function(tinycolor) { console.log('hide', tinycolor)},
            beforeShow: function(tinycolor) { console.log('beforeShow', tinycolor)},
            change: function(color) {
                console.log('change', color.toHexString())
                rectBasic.set('fill',color.toHexString());
                canvas.renderAll();
                document.getElementById('color-picker').style['background-color'] = color.toHexString(); // #ff0000
            }
        });
        // snap to grid


        //window.requestAnimationFrame(drawCanvas);
        drawCanvas();
        
        canvas.on('object:moving', function (options) {
            if (options.target.top < 0){
                options.target.set({
                    left: Math.round(options.target.left / cellSize) * cellSize,
                    top: 1
                });
            }else if (options.target.left < 0){
                 options.target.set({
                    left: 1,
                    top: Math.round((options.target.top - HEADER_HEIGHT) / cellSize) * cellSize + HEADER_HEIGHT
                });
            }else if (options.target.top + cellSize > canvasElt.height){
                 options.target.set({
                    left: Math.round(options.target.left / cellSize) * cellSize,
                    top: canvasElt.height - cellSize -1 
                });
            }else if (options.target.left + cellSize > canvasElt.width){
                 options.target.set({
                    left: canvasElt.width - cellSize -1,
                    top: Math.round((options.target.top - HEADER_HEIGHT) / cellSize) * cellSize + HEADER_HEIGHT
                });
            }else {
                options.target.set({
                    left: Math.round(options.target.left / cellSize) * cellSize,
                    top: Math.round((options.target.top - HEADER_HEIGHT) / cellSize) * cellSize + HEADER_HEIGHT
                });
            }
        });
    }

    function drawGrid(size) {

        let max = Math.round(size/cellSize);
        let maxSize = max*cellSize;
        for (var i = 0; i <= max; i++) {
            canvas.add(new fabric.Line([i * cellSize, HEADER_HEIGHT, i * cellSize, maxSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
            canvas.add(new fabric.Line([0, i * cellSize + HEADER_HEIGHT, maxSize, i * cellSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
        }

        rectBasic = new fabric.Rect({
            left: (canvasRect.width / 2) - cellSize,
            top: cellSize,
            width: cellSize * 2,
            height: cellSize,
            fill: '#faa',
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            hasControls:false
        });

        canvas.add(rectBasic);


    }

    function drawCanvas() {
        //context.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid(canvasRect.width, Math.round(canvasRect.width / NB_CELLS));

        //window.requestAnimationFrame(drawCanvas);
    }

    window.addEventListener('load', pageLoad);
})();