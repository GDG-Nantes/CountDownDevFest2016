'use strict'
import {Peg} from './lego_shape/peg.js';
import {legoColors, legoBaseColor} from './common/legoColors.js';

(function () {

    let canvas = null,
        context = null,
        canvasRect = null,
        cellSize = 0,
        rowSelect = {
            square : null,
            rect : null
        },
        brickModel = {}, 
        createNewBrick = false,
        currentBrick = null,
        lastColor = legoBaseColor();

    

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

        $("#color-picker2").spectrum({
            showPaletteOnly: true,
            showPalette:true,
            color: legoBaseColor(),
            palette: legoColors(),
            change: function (color) {
                lastColor = color.toHexString();
                if (currentBrick){
                    currentBrick.parentPeg.changeColor(color.toHexString());
                }
                rowSelect.square.changeColor(color.toHexString());
                rowSelect.rect.changeColor(color.toHexString());
                canvas.renderAll();
            }
        });
        // snap to grid


        drawCanvas();

        canvas.on('object:selected', (options) => currentBrick = options.target);
        canvas.on('selection:cleared', (options) => currentBrick = null);

        canvas.on('object:moving', (options) => {

            let peg = options.target.parentPeg;

            if (options.target.top < 0) {
                options.target.set({
                    left: Math.round(options.target.left / cellSize) * cellSize,
                    top: 1
                });
            } else if (options.target.left < 0) {
                options.target.set({
                    left: 1,
                    top: Math.round((options.target.top - HEADER_HEIGHT) / cellSize) * cellSize + HEADER_HEIGHT
                });
            } else if (options.target.top + cellSize > canvasElt.height) {
                options.target.set({
                    left: Math.round(options.target.left / cellSize) * cellSize,
                    top: canvasElt.height - cellSize - 1
                });
            } else if (options.target.left + cellSize > canvasElt.width) {
                options.target.set({
                    left: canvasElt.width - cellSize - 1,
                    top: Math.round((options.target.top - HEADER_HEIGHT) / cellSize) * cellSize + HEADER_HEIGHT
                });
            } else {
                 
                if (!peg.replace){
                    if (peg.size === 2){                        
                        canvas.add(createRect().canvasElt);                        
                    }else{
                        canvas.add(createSquare().canvasElt);
                    }
                    peg.replace = true;
                }
                options.target.set({
                    left: Math.round(options.target.left / cellSize) * cellSize,
                    top: Math.round((options.target.top - HEADER_HEIGHT) / cellSize) * cellSize + HEADER_HEIGHT
                });
            }
        });

        canvas.on('object:rotating', (options) =>{
           if ((options.target.angle > 0 && options.target.angle < 45)
            ||(options.target.angle < 360 && options.target.angle >= 315)){
                options.target.set({
                    angle:0
                });
           }else if (options.target.angle >= 45 && options.target.angle < 135){
                options.target.set({
                    angle:90
                });
           }else if (options.target.angle >= 135 && options.target.angle < 225){
                options.target.set({
                    angle:180
                });
           }else if (options.target.angle >= 225 && options.target.angle < 315){
                options.target.set({
                    angle:270
                });
           }
        });
    }

    function drawGrid(size) {

        let max = Math.round(size / cellSize);
        let maxSize = max * cellSize;
        for (var i = 0; i <= max; i++) {
            // Rows
            canvas.add(new fabric.Line([i * cellSize, HEADER_HEIGHT, i * cellSize, maxSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
            // Cols
            canvas.add(new fabric.Line([0, i * cellSize + HEADER_HEIGHT, maxSize, i * cellSize + HEADER_HEIGHT], { stroke: '#ccc', selectable: false }));
        }

        canvas.add(
            createSquare().canvasElt
            , createRect().canvasElt
            );


    }

    function createRect(){
        return _createBrick(2, (canvasRect.width / 2) + 2 * cellSize);
    }

    function createSquare(){
        return _createBrick(1, (canvasRect.width / 2) - (1 * cellSize));
    }

    function _createBrick(size, position){
        let peg = new Peg(size, cellSize, lastColor, position);
        brickModel[peg.id] = peg;
        if (size == 1){
            rowSelect.square = peg;
        }else{
            rowSelect.rect = peg;
        }
        return peg;
    }

    

    function drawCanvas() {
        //context.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid(canvasRect.width, Math.round(canvasRect.width / NB_CELLS));

        //window.requestAnimationFrame(drawCanvas);
    }

    window.addEventListener('load', pageLoad);
})();