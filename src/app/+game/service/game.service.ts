/**
 * game.service
 */

import { Injectable } from '@angular/core';
import { Bubble, Color } from './bubble';
import { Store } from '@ngrx/store';
import { STORE_BUBBLES } from './actions.const';

export const GameStatic = {
    columns: 15,    // Number of tile columns
    rows: 14,       // Number of tile rows
    bubbleWidth: 40,  // Visual width of a bubble
    bubbleHeight: 40, // Visual height of a bubble
    rowHeight: 34,  // Height of a row
    radius: 20,     // Bubble collision radius
    bubbleColors: 7,  // Number of different colors
};

// Get a random int between low and high, inclusive
const randRange = ( low: number, high: number ): number => {
    return Math.floor(low + Math.random() * (high - low + 1));
};

@Injectable()
export class GameService {

    constructor( private store: Store<any> ) {
    }

    public buildGrid(): void {
        let bubbles: Bubble[] = [];
        for (let j = 0; j < GameStatic.rows / 2; j++) {
            let randomColor = randRange(0, GameStatic.bubbleColors - 1);
            let count = 0;
            for (let i = 0; i < GameStatic.columns; i++) {
                if (count === 2) {
                    let newColor = randRange(0, GameStatic.bubbleColors - 1);

                    if (newColor === randomColor) {
                        newColor = (newColor + 1) % GameStatic.bubbleColors;
                    }
                    randomColor = newColor;
                    count = 0;
                }
                count++;
                let bubble = new Bubble(i, j, randomColor);
                bubbles.push(bubble);
            }
        }
        this.store.dispatch({type: STORE_BUBBLES, payload: {bubbles}});
    }
}
