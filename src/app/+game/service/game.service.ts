/**
 * game.service
 */

import { Injectable } from '@angular/core';
import { Bubble } from './bubble';
import { Player } from './player';

export const GameStatic = {
    x: 4,           // X position
    y: 83,          // Y position
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

    /* Property gridWidth */
    private gridWidth: number = GameStatic.bubbleWidth * GameStatic.columns + GameStatic.bubbleWidth / 2;

    get GridWidth(): number {
        return this.gridWidth
    }

    /* Property gridHeight */
    private gridHeight: number = GameStatic.rowHeight * (GameStatic.rows - 1) + GameStatic.bubbleHeight;

    get GridHeight(): number {
        return this.gridHeight
    }

    private bubbles: Bubble[][];

    get Bubbles(): Bubble[][] {
        return this.bubbles;
    }

    private preLoaded: boolean = false;

    get PreLoaded(): boolean {
        return this.preLoaded;
    }

    private images: any;

    private bubbleImage: any;

    get BubbleImage(): any {
        return this.bubbleImage;
    }

    private player: Player;

    get Player(): Player {
        return this.player;
    }

    constructor() {
        this.initBubbles();
        this.initPlayer();
        this.images = this.loadImages(['bubble-sprites.png']);
        this.bubbleImage = this.images[0];
    }

    public newGame(): void {
        this.buildGrid();
        // this.initShootBubbles();
    }

    public getBubbleCoordinate( column, row ) {
        let bubbleX = GameStatic.x + column * GameStatic.bubbleWidth;

        // X offset for odd or even rows
        if (row % 2) {
            bubbleX += GameStatic.bubbleWidth / 2;
        }

        let bubbleY = GameStatic.y + row * GameStatic.rowHeight;
        return {bubbleX, bubbleY};
    }

    private loadImages( imageFiles: string[] ) {
        let loadedImages = [];
        let loadCount = 0;
        let loadTotal = imageFiles.length;
        this.preLoaded = false;

        for (let i = 0; i < imageFiles.length; i++) {
            let image = new Image();

            // Add onload event handler
            image.onload = () => {
                loadCount++;
                if (loadCount === loadTotal) {
                    // Done loading
                    this.preLoaded = true;
                }
            };

            // Set the source url of the image
            image.src = '/assets/img/' + imageFiles[i];

            // Save to the image array
            loadedImages[i] = image;
        }

        return loadedImages;
    }

    private initBubbles(): void {
        this.bubbles = [];
        for (let i = 0; i < GameStatic.columns; i++) {
            this.bubbles[i] = [];
            for (let j = 0; j < GameStatic.rows; j++) {
                this.bubbles[i][j] = new Bubble(i, j);
            }
        }
    }

    private initPlayer(): void {
        let x = GameStatic.x + this.gridWidth / 2;
        let y = GameStatic.y + this.gridHeight + GameStatic.bubbleHeight / 2;

        // set the player current bubble
        let randomColor = randRange(0, GameStatic.bubbleColors - 1);
        console.log(randomColor);
        this.player = new Player(x, y, 90);
        this.player.Bubble = new Bubble(x - GameStatic.bubbleWidth / 2, y - GameStatic.bubbleHeight / 2, randomColor);

        // set the player next bubble
        randomColor = randRange(0, GameStatic.bubbleColors - 1);
        let nextX = x - 3 * GameStatic.bubbleWidth;
        let nextY = y - GameStatic.bubbleHeight / 2;
        this.player.NextBubble = new Bubble(nextX, nextY, randomColor);
    }

    private buildGrid(): void {
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
                this.bubbles[i][j].Color = randomColor;
            }
        }
    }

    /*private initShootBubbles(): void {
     let bubble = new Bubble(null, null, randRange(0, GameStatic.bubbleColors - 1));
     let nextBubble = new Bubble(null, null, randRange(0, GameStatic.bubbleColors - 1));
     this.store.dispatch({type: SET_GAME_STATE, payload: {bubble, nextBubble}});
     }*/
}
