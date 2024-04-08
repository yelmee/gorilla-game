export class Drag{
    drag: DragType
    constructor(drag: DragType) {
        this.drag = drag
    }
}

export interface DragType{
    isDragging: boolean,
    startX?: number,
    startY?: number
}