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

    /* Property y */
    private y: number;

    get Y(): number {
        return this.y;
    }

    /* Property color */
    private color: Color;

    get Color(): Color {
        return this.color;
    }

    constructor( x: number, y: number, color: Color ) {
        this.id = uuid();
        this.x = x;
        this.y = y;
        this.color = color;
    }
}
