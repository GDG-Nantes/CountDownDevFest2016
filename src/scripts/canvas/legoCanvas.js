'use strict'
import {Peg} from '../lego_shape/peg.js';
import {Circle} from '../lego_shape/circle.js';
import {NB_CELLS, HEADER_HEIGHT, BASE_LEGO_COLOR, BACKGROUND_LEGO_COLOR} from '../common/const.js';
import {legoBaseColor} from '../common/legoColors.js';

export class LegoGridCanvas {
    constructor(id, showRow) {
        this.canvasElt = document.getElementById(id);
        this.canvasRect = this.canvasElt.getBoundingClientRect();
        this.showRow = showRow;
        this.canvasElt.width = this.canvasRect.width;
        this.headerHeight = this.showRow ? HEADER_HEIGHT : 0;
        this.canvasElt.height = this.canvasRect.width + this.headerHeight;

        this.cellSize = Math.round(this.canvasRect.width / NB_CELLS);

        this.canvas = new fabric.Canvas(id, { selection: false });
        this.rowSelect = {
            square: null,
            rect: null
        };
        this.brickModel = {},
            this.createNewBrick = false;
        this.currentBrick = null;
        this.lastColor = BASE_LEGO_COLOR;

        this._drawCanvas();

        if (showRow) {

            this.canvas.on('object:selected', (options) => this.currentBrick = options.target.parentPeg ? options.target : null);
            this.canvas.on('selection:cleared', (options) => this.currentBrick = null);

            this.canvas.on('object:moving', (options) => {

                let peg = options.target.parentPeg;


                if (options.target.top < HEADER_HEIGHT
                    || options.target.left < 0
                    || options.target.top + this.cellSize > this.canvasElt.height
                    || options.target.left + this.cellSize > this.canvasElt.width) {
                    peg.toRemove = true;
                } else {
                    peg.toRemove = false;
                    if (!peg.replace) {
                        if (peg.size === 2) {
                            this.canvas.add(this._createRect().canvasElt);
                        } else {
                            this.canvas.add(this._createSquare().canvasElt);
                        }
                        peg.replace = true;
                    }
                }
                peg.move(
                    Math.round(options.target.left / this.cellSize) * this.cellSize, //left
                    Math.round((options.target.top - this.headerHeight) / this.cellSize) * this.cellSize + this.headerHeight // top
                );

            });

            this.canvas.on('mouse:up', () => {
                if (this.currentBrick
                    && this.currentBrick.parentPeg.toRemove
                    && this.currentBrick.parentPeg.replace) {
                    delete this.brickModel[this.currentBrick.parentPeg.id];
                    this.canvas.remove(this.currentBrick);
                    this.currentBrick = null;
                }
            });

            this.canvas.on('object:rotating', (options) => {
                let peg = options.target.parentPeg;

                if ((options.target.angle > 0 && options.target.angle < 45)
                    || (options.target.angle < 360 && options.target.angle >= 315)) {
                    peg.rotate(0);
                } else if (options.target.angle >= 45 && options.target.angle < 135) {
                    peg.rotate(90);
                } else if (options.target.angle >= 135 && options.target.angle < 225) {
                    peg.rotate(180);
                } else if (options.target.angle >= 225 && options.target.angle < 315) {
                    peg.rotate(270);
                }
            });

        }
    }

    changeColor(color) {
        this.lastColor = color;
        if (this.currentBrick) {
            this.currentBrick.parentPeg.changeColor(color);
        }
        this.rowSelect.square.changeColor(color);
        this.rowSelect.rect.changeColor(color);
        this.canvas.renderAll();
    }

    export(userName, userId) {
        let resultArray = []
        Object.keys(this.brickModel).forEach((key) => {
            let pegTmp = this.brickModel[key];
            resultArray.push({
                size: pegTmp.size,
                color: pegTmp.color,
                angle: pegTmp.angle,
                top: pegTmp.top - this.headerHeight,
                left: pegTmp.left,
                cellSize : this.cellSize
            });
        });
        return {
            user: userName,
            userId : userId,
            instructions: resultArray
        };
    }

    drawInstructions(instructionObject){
        this.canvas.clear();
        this._drawCanvas();
        this.canvas.renderOnAddRemove = false;
        instructionObject.instructions.forEach((instruction)=>{
            this.canvas.add(
                this._createBrick(instruction.size, 
                    (instruction.left / instruction.cellSize) * this.cellSize,
                    (instruction.top / instruction.cellSize) * this.cellSize,
                    instruction.angle,
                    instruction.color
                    ).canvasElt
                );            
        });

        this.canvas.renderAll();
        this.canvas.renderOnAddRemove = true;
    }

    resetBoard(){
        this.canvas.clear();
        this._drawCanvas();
    }

    snapshot(){
        return this.canvas.toDataURL();
    }


    _drawGrid(size) {
        /*let max = Math.round(size / this.cellSize);
        let maxSize = max * this.cellSize;
        // Rows
        this.canvas.add(new fabric.Line([0 * this.cellSize, this.headerHeight, 0 * this.cellSize, maxSize + this.headerHeight], { stroke: '#ccc', selectable: false }));
        this.canvas.add(new fabric.Line([max * this.cellSize - 1, this.headerHeight, max * this.cellSize - 1, maxSize + this.headerHeight], { stroke: '#ccc', selectable: false }));
        // Cols
        this.canvas.add(new fabric.Line([0, 0 * this.cellSize + this.headerHeight, maxSize, 0 * this.cellSize + this.headerHeight], { stroke: '#ccc', selectable: false }));
        this.canvas.add(new fabric.Line([0, max * this.cellSize + this.headerHeight - 1, maxSize, max * this.cellSize + this.headerHeight - 1], { stroke: '#ccc', selectable: false }));*/
        /*for (var i = 0; i <= max; i++) {          
            // Rows
            this.canvas.add(new fabric.Line([i * this.cellSize, this.headerHeight, i * this.cellSize, maxSize + this.headerHeight], { stroke: '#ccc', selectable: false }));
            // Cols
            this.canvas.add(new fabric.Line([0, i * this.cellSize + this.headerHeight, maxSize, i * this.cellSize + this.headerHeight], { stroke: '#ccc', selectable: false }));
        }*/

        if (this.showRow){
            this.canvas.add(
                this._createSquare().canvasElt
                , this._createRect().canvasElt
            );
        }
    }

    _drawWhitePeg(size){
        this.canvas.renderOnAddRemove = false;
        let max = Math.round(size / this.cellSize);
        let maxSize = max * this.cellSize;
        for (var row =0; row < max; row++){
            for (var col = 0; col < max; col++ ){
                 let squareTmp = new fabric.Rect({
                    width: this.cellSize,
                    height: this.cellSize,
                    fill: BACKGROUND_LEGO_COLOR,
                    originX: 'center',
                    originY: 'center',
                    centeredRotation: true,
                    hasControls: false                        
                });
                let circle = new Circle(this.cellSize, BACKGROUND_LEGO_COLOR);
                circle.canvasElt.set({
                    //left: this.cellSize * col  + (this.cellSize / 4) -2.5,
                    //top : this.cellSize * row + this.headerHeight + (this.cellSize / 4) -2.5,
                    lockRotation : true,
                    lockScalingX : true,
                    lockScalingY : true,
                    lockMovementX : true,
                    lockMovementY : true,
                    hasControls : false,
                    hasBorders : false
                });
                let groupTmp = new fabric.Group([squareTmp, circle.canvasElt], {
                    left: this.cellSize * col,
                    top: this.cellSize * row + this.headerHeight,
                    angle: 0,
                    lockRotation : true,
                    lockScalingX : true,
                    lockScalingY : true,
                    lockMovementX : true,
                    lockMovementY : true,
                    hasControls : false,
                    hasBorders : false
                });
                this.canvas.add(groupTmp);
            }
        }
        this.canvas.renderAll();
        this.canvas.renderOnAddRemove = true;        
    }

    _createRect() {
        return this._createBrick(2, (this.canvasRect.width / 2) + 2 * this.cellSize);
    }

    _createSquare() {
        return this._createBrick(1, (this.canvasRect.width / 2) - (1 * this.cellSize));
    }

    _createBrick(size, left, top, angle, color) {
        let peg = new Peg(size, this.cellSize, color || this.lastColor, left, top, angle);
        this.brickModel[peg.id] = peg;
        if (size == 1) {
            this.rowSelect.square = peg;
        } else {
            this.rowSelect.rect = peg;
        }
        return peg;
    }



    _drawCanvas() {
        this._drawWhitePeg(this.canvasRect.width);
        this._drawGrid(this.canvasRect.width, Math.round(this.canvasRect.width / NB_CELLS));
    }
    

}