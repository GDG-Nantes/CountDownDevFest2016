(function () {
    'use strict'

    let canvas = null,
        context = null,
        canvasRect = null;

    const NB_CELLS = 20;


    function pageLoad() {
        canvas = document.getElementById('canvasDraw');
        context = canvas.getContext('2d');

        canvasRect = canvas.getBoundingClientRect();
        context.scale(1,1);
        canvas.width = canvasRect.width;
        canvas.height = canvasRect.width;

        //window.requestAnimationFrame(drawCanvas);
        drawCanvas();
    }

    function drawGrid(size, space) {

        for (var x = 0; x <= size; x += space) {
            context.moveTo(x, 0);
            context.lineTo(x, size);
        }

        for (var y = 0; y <= size; y += space) {
            context.moveTo(0, y);
            context.lineTo(size, y);
        }

        context.strokeStyle = "#ddd";
        context.stroke();

    }

    function drawCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid(canvasRect.width, Math.round(canvasRect.width / NB_CELLS));
        
        window.requestAnimationFrame(drawCanvas);
    }

    window.addEventListener('load', pageLoad);
})();