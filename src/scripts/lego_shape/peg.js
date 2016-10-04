'use strict'
import {Circle} from './circle.js';

/**
 * Peg Lego class
 * The peg is composed of n circle for a dimension that depend on the size parameter
 */
export class Peg{
    constructor({size = {col : 1, row : 1}, cellSize = 0, color = '#FFF', left = 0, top = 0, angle = 0}){
        this.size = size;
        this.id = `Peg${size}-${Date.now()}`;
        this.isReplace = false;
        this.toRemove = false;
        this.color = color;
        this.top = top;
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
        this.circleArray.push(circleGroup);       
        // According to the size, we don't place the circles at the same place
        if (size.col === 2){
            // For a rectangle or a big Square
            // We update the row positions
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

            // For a Big Square
            if (size.row === 2){
                circleGroup.canvasElt.set({
                    top : (-cellSize +5)
                });
            }
            this.circleArray.push(circleGroup);

            // For a Big Square
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

        // The peg is locked in all position
        this.group = new fabric.Group(arrayElts, {
            left: this.left,
            top: this.top,
            angle: this.angle,
            lockRotation : true,
            lockScalingX : true,
            lockScalingY : true,
            hasControls : false,
        });

        // We add to FabricElement a reference to the curent peg
        this.group.parentPeg = this;        
    }

    // The FabricJS element
    get canvasElt(){
        return this.group;
    }

    // True if the element was replaced
    get replace(){
        return this.isReplace
    }

    // Setter for isReplace param
    set replace(replace){
        this.isReplace = replace;
    }

    // Change the color of the peg
    changeColor(color){
        this.color = color;
        this.rectBasic.set('fill', color);
        this.circleArray.forEach((circle)=> circle.changeColor(color));        
    }

    // Move the peg to desire position
    move(left, top){
        this.top = top;
        this.left = left;
        this.group.set({
            top: top,
            left : left
        });
    }

    // Rotate the peg to the desire angle
    rotate(angle){
        this.angle = angle;
        this.group.set({
            angle : angle
        });
    }

}