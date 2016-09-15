'use strict'
import {ColorLuminance} from '../common/util.js';

export class Circle{
    constructor(cellSize, color){
        this.circleBasic = new fabric.Circle({
            radius: (cellSize / 2) - 5,
            fill: ColorLuminance(color, -0.1),
            originX: 'center',
            originY: 'center',
            shadow : "0px 2px 10px rgba(0,0,0,0.2)"
        });

        this.circleBasicEtx = new fabric.Circle({
            radius: (cellSize / 2) - 4,
            fill: ColorLuminance(color, 0.1),
            originX: 'center',
            originY: 'center'
        });

        this.text = new fabric.Text('GDG', {
            fontSize: cellSize / 5,
            fill: ColorLuminance(color, -0.15),
            originX: 'center',
            originY: 'center',
            stroke: ColorLuminance(color, -0.20),
            strokeWidth: 1
        });

        this.group = new fabric.Group([this.circleBasicEtx, this.circleBasic, this.text]);
    }

    get canvasElt(){
        return this.group; 
    }

    changeColor(color){
        this.circleBasic.set('fill', ColorLuminance(color, -0.1));
        this.circleBasicEtx.set('fill', ColorLuminance(color, 0.1));
        this.text.set({
            fill : ColorLuminance(color, -0.15),
            stroke : ColorLuminance(color, -0.20)
        });
    }
}