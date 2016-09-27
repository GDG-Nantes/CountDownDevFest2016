'use strict'
import {Circle} from './circle.js';

export class Peg{
    constructor({size = {col : 1, row : 1}, cellSize = 0, color = '#FFF', left = 0, top = 0, angle = 0}){
        this.size = size;
        this.id = `Peg${size}-${Date.now()}`;
        this.isReplace = false;
        this.toRemove = false;
        this.color = color;
        this.top = top || cellSize;
        this.left = left;
        this.angle = angle || 0;


        this.rectBasic = new fabric.Rect({
            width: cellSize * size.col,
            height: cellSize * size.row,
            fill: color,
            originX: 'center',
            originY: 'center',
            centeredRotation: true,
            hasControls: false,
            shadow : "5px 5px 10px rgba(0,0,0,0.2)"                        
        });


        this.circleGroup = new Circle(cellSize, color);
        let arrayElts = [this.rectBasic];
        if (size.col === 2){
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
            left: this.left,
            top: this.top,
            angle: this.angle,
            lockRotation : this.size.col === 1 && this.size.row === 1,
            lockScalingX : true,
            lockScalingY : true,
            hasControls : this.size.col != 1 || this.size.row != 1,
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
        this.color = color;
        this.rectBasic.set('fill', color);
        this.circleGroup.changeColor(color);
        if (this.size.col === 2){
            this.circleGroup2.changeColor(color);
        }
    }

    move(left, top){
        this.top = top;
        this.left = left;
        this.group.set({
            top: top,
            left : left
        });
    }

    rotate(angle){
        this.angle = angle;
        this.group.set({
            angle : angle
        });
    }

}