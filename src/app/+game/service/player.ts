/**
 * player
 */

import { Bubble } from './bubble';

export class Player {
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

    /* Property speed */
    private speed: number;

    get Speed(): number {
        return this.speed;
    }

    /* Property angle */
    private angle: number;

    get Angle(): number {
        return this.angle;
    }

    set Angle( value: number ) {
        this.angle = value;
    }

    /* Property bubbleAngle */
    private bubbleAngle: number;

    get BubbleAngle(): number {
        return this.bubbleAngle;
    }

    set BubbleAngle( value: number ) {
        this.bubbleAngle = value;
    }

    /* Property bubbleVisible */
    private bubbleVisible: boolean;

    get BubbleVisible(): boolean {
        return this.bubbleVisible;
    }

    set BubbleVisible( value: boolean ) {
        this.bubbleVisible = value;
    }

    /* Property bubble */
    private bubble: Bubble;

    get Bubble(): Bubble {
        return this.bubble;
    }

    set Bubble( value: Bubble ) {
        this.bubble = value;
    }

    /* Property nextBubble */
    private nextBubble: Bubble;

    get NextBubble(): Bubble {
        return this.nextBubble;
    }

    set NextBubble( value: Bubble ) {
        this.nextBubble = value;
    }

    constructor( x: number, y: number, angle: number ) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 1000;
        this.bubbleVisible = false;
    }
}
