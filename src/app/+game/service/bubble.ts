/**
 * bubble
 */

import { uuid } from './utils';

export enum Color {
    Red,
    Green,
    Blue,
    Yellow,
    Pink,
    Cyan,
    Grey,
}

export class Bubble {

    /* Property id */
    private id: string;

    get Id(): string {
        return this.id;
    }

    /* Property x */
    private x: number;

    get X(): number {
        return this.x;
    }

    set X( value: number ) {
        this.x = value;
    }

    /* Property y */
    private y: number;

    get Y(): number {
        return this.y;
    }

    set Y( value: number ) {
        this.y = value;
    }

    /* Property color */
    private color: Color;

    get Color(): Color {
        return this.color;
    }

    set Color( color: Color ) {
        this.color = color;
    }

    constructor( x: number, y: number, color?: Color ) {
        this.id = uuid();
        this.x = x;
        this.y = y;
        this.color = color >= 0 ? color : null;
    }

    public moveBubble( x: number, y: number ): void {
        this.x += x;
        this.y += y;
    }
}
