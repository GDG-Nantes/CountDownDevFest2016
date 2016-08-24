'use strict'
import {Circle} from './circle.js';

export class Peg{
    constructor(size, cellSize, left){
        this.size = size;


        this.rectBasic = new fabric.Rect({
            width: cellSize * size,
            height: cellSize,
            fill: '#faa',
            originX: 'center',
            originY: 'center',
            centeredRotation: true,
            hasControls: false
        });

        this.circleGroup = new Circle(cellSize);
        let arrayElts = [this.rectBasic];
        if (size === 2){
            this.circleGroup2 = new Circle(cellSize);
            this.circleGroup.canvasElt.set({
                left: -cellSize + 5
            });
            this.circleGroup2.canvasElt.set({
                left: 0
            });
            arrayElts.push(this.circleGroup.canvasElt);
            arrayElts.push(this.circleGroup2.canvasElt);
        }else{
            arrayElts.push(this.circleGroup.canvasElt);
        }
            

        this.group = new fabric.Group(arrayElts, {
            left: left,
            top: cellSize,
        });

        this.group.parentPeg = this;
    }

    get canvasElt(){
        return this.group;
    }

    changeColor(color){
        this.rectBasic.set('fill', color);
        this.circleGroup.changeColor(color);
        if (this.size === 2){
            this.circleGroup2.changeColor(color);
        }
    }

}