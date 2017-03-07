/**
 * game.service
 */

import { Injectable } from '@angular/core';
import { Bubble } from './bubble';
import { Player } from './player';
import { radToDeg, degToRad } from './utils';
import { Store } from '@ngrx/store';
import { GameState, IGameState } from './game-state.reducer';

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
    private gridWidth: number = GameStatic.bubbleWidth * GameStatic.columns +
        GameStatic.bubbleWidth / 2;

    get GridWidth(): number {
        return this.gridWidth;
    }

    /* Property gridHeight */
    private gridHeight: number = GameStatic.rowHeight * (GameStatic.rows - 1) +
        GameStatic.bubbleHeight;

    get GridHeight(): number {
        return this.gridHeight;
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

    private gameState: GameState;

    // Timing and frames per second
    private lastFrame = 0;
    private fpsTime = 0;
    private frameCount = 0;
    private fps = 0;

    private rowOffSet: number = 0;

    constructor( private store: Store<any> ) {
        this.store.select('gameState').subscribe(
            ( data: IGameState ) => this.gameState = data.gameState
        );
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
        if ((row + this.rowOffSet) % 2) {
            bubbleX += GameStatic.bubbleWidth / 2;
        }

        let bubbleY = GameStatic.y + row * GameStatic.rowHeight;
        return {bubbleX, bubbleY};
    }

    public setPlayerAngle( mousePos: {x: number; y: number} ) {
        let mouseAngle = radToDeg(
            Math.atan2(this.player.Y - mousePos.y, mousePos.x - this.player.X)
        );

        // Convert range to 0, 360 degrees
        if (mouseAngle < 0) {
            mouseAngle = 360 + mouseAngle;
        }

        // Restrict angle to 8, 172 degrees
        let lBound = 8;
        let uBound = 172;
        if (mouseAngle > 90 && mouseAngle < 270) {
            // Left
            if (mouseAngle > uBound) {
                mouseAngle = uBound;
            }
        } else {
            // Right
            if (mouseAngle < lBound || mouseAngle >= 270) {
                mouseAngle = lBound;
            }
        }

        // Set the player angle
        this.player.Angle = mouseAngle;
    }

    public handleMouseDown(): void {
        if (this.gameState === GameState.Ready) {
            this.player.BubbleAngle = this.player.Angle;
            this.store.dispatch({
                type: 'SET_GAME_STATE',
                payload: {gameState: GameState.ShootBubble}
            });
        }
    }

    public update( tframe: number ): void {
        let dt = (tframe - this.lastFrame) / 1000;
        this.lastFrame = tframe;

        this.updateFps(dt);

        if (this.gameState === GameState.ShootBubble) {
            this.stateShootBubble(dt);
        }
    }

    private updateFps( dt: number ): void {
        if (this.fpsTime > 0.25) {
            // Calculate fps
            this.fps = Math.round(this.frameCount / this.fpsTime);

            // Reset time and framecount
            this.fpsTime = 0;
            this.frameCount = 0;
        }

        // Increase time and framecount
        this.fpsTime += dt;
        this.frameCount++;
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
        let x = GameStatic.x + this.gridWidth / 2 - GameStatic.bubbleWidth / 2;
        let y = GameStatic.y + this.gridHeight;

        // set the player current bubble
        let randomColor = randRange(0, GameStatic.bubbleColors - 1);
        this.player = new Player(x, y, 90);
        this.player.Bubble = new Bubble(x, y, randomColor);
        this.player.BubbleVisible = true;

        // set the player next bubble
        randomColor = randRange(0, GameStatic.bubbleColors - 1);
        let nextX = x - 2 * GameStatic.bubbleWidth;
        let nextY = y;
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

    private stateShootBubble( dt: number ) {
        let x = dt * this.player.Speed * Math.cos(degToRad(this.player.BubbleAngle));
        let y = dt * this.player.Speed * -1 * Math.sin(degToRad(this.player.BubbleAngle));
        this.player.Bubble.moveBubble(x, y);

        // Handle left and right collisions with the level
        if (this.player.Bubble.X <= GameStatic.x) {
            // Left edge
            this.player.BubbleAngle = 180 - this.player.BubbleAngle;
            this.player.Bubble.X = GameStatic.x;
        } else if (this.player.Bubble.X + GameStatic.bubbleWidth >=
            GameStatic.x + this.gridWidth) {
            // Right edge
            this.player.BubbleAngle = 180 - this.player.BubbleAngle;
            this.player.Bubble.X = GameStatic.x + this.gridWidth - GameStatic.bubbleWidth;
        }

        // Collisions with the top of the level
        if (this.player.Bubble.Y <= GameStatic.y) {
            // Top collision
            this.player.Bubble.Y = GameStatic.y;
            this.snapBubble();
            return;
        }

        for (let i = 0; i < GameStatic.columns; i++) {
            for (let j = 0; j < GameStatic.rows; j++) {
                let bubble = this.bubbles[i][j];
                if (bubble.Color === null) {
                    continue;
                }

                // Check for intersections
                let coord = this.getBubbleCoordinate(i, j);
                if (this.circleIntersection(
                        this.player.Bubble.X + GameStatic.bubbleWidth / 2,
                        this.player.Bubble.Y + GameStatic.bubbleHeight / 2,
                        GameStatic.radius,
                        coord.bubbleX + GameStatic.bubbleWidth / 2,
                        coord.bubbleY + GameStatic.bubbleHeight / 2,
                        GameStatic.radius)) {

                    // Intersection with a level bubble
                    this.snapBubble();
                    return;
                }
            }
        }
    }

    private snapBubble(): void {

        // Get the grid position
        let centerX = this.player.Bubble.X + GameStatic.bubbleWidth / 2;
        let centerY = this.player.Bubble.Y + GameStatic.bubbleHeight / 2;
        let gridPos = this.getGridPosition(centerX, centerY);

        // Make sure the grid position is valid
        if (gridPos.x < 0) {
            gridPos.x = 0;
        }

        if (gridPos.x >= GameStatic.columns) {
            gridPos.x = GameStatic.columns - 1;
        }

        if (gridPos.y < 0) {
            gridPos.y = 0;
        }

        if (gridPos.y >= GameStatic.rows) {
            gridPos.y = GameStatic.rows - 1;
        }

        // Check if the bubble is empty
        let addBubble = false;
        if (this.bubbles[gridPos.x][gridPos.y].Color !== null) {
            // Bubble is not empty, shift the new bubble downwards
            for (let newRow = gridPos.y + 1; newRow < GameStatic.rows; newRow++) {
                if (this.bubbles[gridPos.x][newRow].Color === null) {
                    gridPos.y = newRow;
                    addBubble = true;
                    break;
                }
            }
        } else {
            addBubble = true;
        }

        if (addBubble) {
            this.player.BubbleVisible = false;
            this.bubbles[gridPos.x][gridPos.y].Color = this.player.Bubble.Color;
        }

        this.nextBubble();
        this.store.dispatch({
            type: 'SET_GAME_STATE',
            payload: {gameState: GameState.Ready}
        });
    }

    // Check if two circles intersect
    private circleIntersection( x1, y1, r1, x2, y2, r2 ): boolean {
        // Calculate the distance between the centers
        let dx = x1 - x2;
        let dy = y1 - y2;
        let len = Math.sqrt(dx * dx + dy * dy);

        return len < r1 + r2;
    }

    // Get the closest grid position
    private getGridPosition( x, y ) {
        let gridY = Math.floor((y - GameStatic.y) / GameStatic.rowHeight);

        // Check for offset
        let xOffset = 0;
        if ((gridY + this.rowOffSet) % 2) {
            xOffset = GameStatic.bubbleWidth / 2;
        }
        let gridX = Math.floor(((x - xOffset) - GameStatic.x) / GameStatic.bubbleWidth);

        return {x: gridX, y: gridY};
    }

    private nextBubble() {
        this.player.Bubble.X = this.player.X;
        this.player.Bubble.Y = this.player.Y;
        this.player.Bubble.Color = this.player.NextBubble.Color;
        this.player.BubbleVisible = true;

        this.player.NextBubble.Color = randRange(0, GameStatic.bubbleColors - 1);
    }
}
