'use strict'
import {Circle} from './circle.js';

export class Peg{
    constructor(size, cellSize, color, left){
        this.size = size;
        this.id = `Peg${size}-${Date.now()}`;
        this.isReplace = false;


        this.rectBasic = new fabric.Rect({
            width: cellSize * size,
            height: cellSize,
            fill: color,
            originX: 'center',
            originY: 'center',
            centeredRotation: true,
            hasControls: false                        
        });


        this.circleGroup = new Circle(cellSize, color);
        let arrayElts = [this.rectBasic];
        if (size === 2){
            this.circleGroup2 = new Circle(cellSize, color);
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
            lockRotation : this.size === 1,
            lockScalingX : true,
            lockScalingY : true,
        });

        this.group.parentPeg = this;        
    }

    get canvasElt(){
        return this.group;
    }

    get replace(){
        return this.isReplace
    }

    set replace(replace){
        this.isReplace = replace;
    }

    changeColor(color){
        this.rectBasic.set('fill', color);
        this.circleGroup.changeColor(color);
        if (this.size === 2){
            this.circleGroup2.changeColor(color);
        }
    }

}