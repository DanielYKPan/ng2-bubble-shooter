/**
 * game-board.component
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService, GameStatic, Color } from '../service';

@Component({
    selector: 'app-game-board',
    templateUrl: 'game-board.component.html'
})
export class GameBoardComponent implements OnInit {

    public gridWidth: number;
    public gridHeight: number;

    private context: any;
    @ViewChild('board') private board: ElementRef;

    constructor( private gameService: GameService ) {
    }

    public ngOnInit() {
        this.context = this.board.nativeElement.getContext('2d');
        this.gameService.newGame();
        this.gridWidth = GameStatic.bubbleWidth * GameStatic.columns + GameStatic.bubbleWidth / 2;
        this.gridHeight = GameStatic.rowHeight * (GameStatic.rows - 1) + GameStatic.bubbleHeight;
        this.main(0);
    }

    private main( tframe: number ): void {
        // Request animation frames
        window.requestAnimationFrame(( timestamp ) => this.main(timestamp));
        if (this.gameService.PreLoaded) {
            this.render();
        }
    }

    private render() {

        // Draw game board background
        this.context.fillStyle = '#e8eaec';
        this.context.fillRect(0, 0,
            this.board.nativeElement.width, this.board.nativeElement.height);

        // Draw grid background
        let yOffset = GameStatic.bubbleHeight / 2;
        this.context.fillStyle = '#8c8c8c';
        this.context.fillRect(GameStatic.x - 4, GameStatic.y - 4,
            this.gridWidth + 8, this.gridHeight + 4 - yOffset);

        // Render Bubbles
        this.drawBubbles();
    }

    private drawBubbles(): void {
        for (let i = 0; i < GameStatic.columns; i++) {
            for (let j = 0; j < GameStatic.rows; j++) {
                let bubble = this.gameService.Bubbles[i][j];
                if (bubble.Color >= 0) {
                    let coord = this.gameService.getBubbleCoordinate(i, j);
                    this.drawBubble(coord.bubbleX, coord.bubbleY, bubble.Color);
                }
            }
        }
    }

    private drawBubble( x: number, y: number, index: Color ): void {
        if (index === null) {
            return;
        }
        this.context.drawImage(
            this.gameService.BubbleImage,
            index * 40, 0, 40, 40, x, y,
            GameStatic.bubbleWidth, GameStatic.bubbleHeight);
    }
}
