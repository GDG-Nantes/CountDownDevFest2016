'use strict'
import {Peg} from '../lego_shape/peg.js';
import {Circle} from '../lego_shape/circle.js';
import {NB_CELLS, HEADER_HEIGHT, BASE_LEGO_COLOR, BACKGROUND_LEGO_COLOR} from '../common/const.js';
import {legoBaseColor} from '../common/legoColors.js';

/**
 * 
 * Class for Canvas Grid
 * 
 */
export class LegoGridCanvas {
    constructor(id, showRow) {
        // Basic canvas
        this.canvasElt = document.getElementById(id);
        // Size of canvas
        this.canvasRect = this.canvasElt.getBoundingClientRect();
        // Indicator for showing the first row with pegs
        this.showRow = showRow;
        this.canvasElt.width = this.canvasRect.width;
        // According to showRow, we will show modify the header Height
        this.headerHeight = this.showRow ? HEADER_HEIGHT : 0;
        this.canvasElt.height = this.canvasRect.width + this.headerHeight;
        // We calculate the cellsize according to the space taken by the canvas
        this.cellSize = Math.round(this.canvasRect.width / NB_CELLS);

        // We initialize the Fabric JS library with our canvas
        this.canvas = new fabric.Canvas(id, { selection: false });
        // Object that represent the pegs on the first row
        this.rowSelect = {};
        // The current draw model (instructions, ...)
        this.brickModel = {},
        // Flag to determine if we have to create a new brick
        this.createNewBrick = false;
        this.currentBrick = null;
        this.lastColor = BASE_LEGO_COLOR;

        // We create the canvas
        this._drawCanvas();

        // If we show the row, we have to plug the move management
        if (showRow) {

            this.canvas.on('object:selected', (options) => this.currentBrick = options.target.parentPeg ? options.target : null);
            this.canvas.on('selection:cleared', (options) => this.currentBrick = null);

            this.canvas.on('object:moving', (options) => {
                let peg = options.target.parentPeg;


                let newLeft = Math.round(options.target.left / this.cellSize) * this.cellSize;
                let newTop = Math.round((options.target.top - this.headerHeight) / this.cellSize) * this.cellSize + this.headerHeight;                  
                // We have to calculate the top
                let topCompute = newTop + (peg.size.row === 2 || peg.angle > 0 ? this.cellSize * 2 : this.cellSize);
                let leftCompute = newLeft + (peg.size.col === 2 ? this.cellSize * 2 : this.cellSize);
                peg.move(
                    newLeft, //left
                    newTop // top
                );

                // We specify that we could remove a peg if one of it's edge touch the outside of the canvas
                if (newTop < HEADER_HEIGHT
                    || newLeft < 0
                    || topCompute >= this.canvasElt.height
                    || leftCompute >= this.canvasElt.width) {
                    peg.toRemove = true;
                } else {
                    // Else we check we create a new peg (when a peg enter in the draw area)
                    peg.toRemove = false;
                    if (!peg.replace) {
                        if (peg.size.col === 2) {
                            if (peg.size.row === 2){
                                this.canvas.add(this._createSquare(2).canvasElt);
                            }else if (peg.angle === 0){
                                this.canvas.add(this._createRect(1).canvasElt);
                            }else{
                                this.canvas.add(this._createRect(1,90).canvasElt);
                            }
                        } else {
                            this.canvas.add(this._createSquare(1).canvasElt);
                        }
                        peg.replace = true;
                    }
                }

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

        }
    }

    /**
     * Method for changing the color of the first row 
     */
    changeColor(color) {
        this.lastColor = color;       
        this.rowSelect.square.changeColor(color);
        this.rowSelect.bigSquare.changeColor(color);
        this.rowSelect.rect.changeColor(color);
        this.rowSelect.vertRect.changeColor(color);
        this.canvas.renderAll();
    }

    /**
     * Serialize the canvas to a minimal object that could be treat after
     */
    export(userName, userId) {
        let resultArray = [];
        // We filter the row pegs
        let keys = Object.keys(this.brickModel)
            .filter((key)=>key != this.rowSelect.square.id
                && key != this.rowSelect.bigSquare.id
                && key != this.rowSelect.rect.id
                && key != this.rowSelect.vertRect.id);
        keys.forEach((key) => {
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

    /**
     * Draw from intructions a draw
     */
    drawInstructions(instructionObject){
        this.resetBoard();
        this.canvas.renderOnAddRemove = false;
        instructionObject.instructions.forEach((instruction)=>{
            this.canvas.add(
                this._createBrick({ size : instruction.size, 
                    left : (instruction.left / instruction.cellSize) * this.cellSize,
                    top : (instruction.top / instruction.cellSize) * this.cellSize,
                    angle : instruction.angle,
                    color : instruction.color
                }).canvasElt
                );            
        });

        this.canvas.renderAll();
        this.canvas.renderOnAddRemove = true;
    }

    /**
     * Clean the board and the state of the canvas
     */
    resetBoard(){
        this.brickModel = {};
        this.canvas.clear();
        this._drawCanvas();
    }

    /** 
     * Generate a Base64 image from the canvas
     */
    snapshot(){
        return this.canvas.toDataURL();
    }

    /**
     * 
     * Privates Methods
     * 
     */


    /**
     * Draw the basic grid 
    */
    _drawGrid(size) {       
        if (this.showRow){
            this.canvas.add(
                this._createSquare(1).canvasElt
                , this._createSquare(2).canvasElt
                , this._createRect(1).canvasElt
                , this._createRect(1,90).canvasElt
            );
        }
    }

    /**
     * Draw all the white peg of the grid
     */
    _drawWhitePeg(size){
        // We stop rendering on each add, in order to save performances
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
        // We transform the canvas to a base64 image in order to save performances.
        let url = this.canvas.toDataURL();
        this.canvas.clear();     
        this.canvas.setBackgroundImage(url,this.canvas.renderAll.bind(this.canvas), {
            originX: 'left',
            originY: 'top',
            width: this.canvas.width,
          height: this.canvas.height,
        });   
    }

    /**
     * Create a horizontal or vertical rectangle
     */
    _createRect(sizeRect, angle) {
        return this._createBrick({
                size : {col : 2 * sizeRect, row :1 * sizeRect}, 
                left : angle ? ((this.canvasRect.width / 4) - this.cellSize) : ((this.canvasRect.width * 3 / 4) - (this.cellSize * 1.5)),
                top : angle ? 1 : 0,
                angle : angle
            });
    }

    /**
     * Create a square (1x1) or (2x2)
     */
    _createSquare(sizeSquare) {
        return this._createBrick({
                size : {col : 1 * sizeSquare, row :1 * sizeSquare}, 
                left: sizeSquare === 2 ? ((this.canvasRect.width / 2) - (2 * this.cellSize)) : (this.canvasRect.width - (this.cellSize * 1.5)),
                top : sizeSquare === 2 ? 1 : 0,
            });
    }

    /**
     * Generic method that create a peg
     */
    _createBrick(options) {
        options.cellSize = this.cellSize;
        options.color = options.color || this.lastColor;
        let peg = new Peg(options);
        this.brickModel[peg.id] = peg;
        // We have to update the rowSelect Object to be alsway update
        if (options.size.row === 2) {
            this.rowSelect.bigSquare = peg;
        } else if (options.angle) {
            this.rowSelect.vertRect = peg;
        } else if (options.size.col === 2) {
            this.rowSelect.rect = peg;
        } else {
            this.rowSelect.square = peg;
        }
        return peg;
    }


    /**
     * Init the canvas
     */
    _drawCanvas() {
        this._drawWhitePeg(this.canvasRect.width);
        this._drawGrid(this.canvasRect.width, Math.round(this.canvasRect.width / NB_CELLS));
    }
    

}