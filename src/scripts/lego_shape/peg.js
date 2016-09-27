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
        this.circleArray = [];


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


        let arrayElts = [this.rectBasic];
        let circleGroup = new Circle(cellSize, color);
    console.info(circleGroup.canvasElt.top, cellSize, cellSize / 2);
        this.circleArray.push(circleGroup);       
        if (size.col === 2){
            circleGroup.canvasElt.set({
                left: -cellSize + 5
            });
            if (size.row === 2){
                circleGroup.canvasElt.set({
                    top : (-cellSize +5)
                });
            }
            circleGroup = new Circle(cellSize, color);
            circleGroup.canvasElt.set({
                left: 0
            });
            if (size.row === 2){
                circleGroup.canvasElt.set({
                    top : (-cellSize +5)
                });
            }
            this.circleArray.push(circleGroup);
            if (size.row === 2){
                circleGroup = new Circle(cellSize, color);
                circleGroup.canvasElt.set({
                    left: -cellSize + 5,
                    top: 0
                });
                this.circleArray.push(circleGroup);
                circleGroup = new Circle(cellSize, color);
                circleGroup.canvasElt.set({
                    left: 0,
                    top : 0
                });
                this.circleArray.push(circleGroup);
            }
            
        }

        this.circleArray.forEach((circle)=>arrayElts.push(circle.canvasElt));
        
            

        this.group = new fabric.Group(arrayElts, {
            left: this.left,
            top: this.top,
            angle: this.angle,
            lockRotation : true,
            lockScalingX : true,
            lockScalingY : true,
            hasControls : false,
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
        this.circleArray.forEach((circle)=> circle.changeColor(color));        
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