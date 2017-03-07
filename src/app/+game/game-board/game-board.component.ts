/**
 * game-board.component
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService, GameStatic, Color, degToRad } from '../service';

@Component({
    selector: 'app-game-board',
    templateUrl: 'game-board.component.html'
})
export class GameBoardComponent implements OnInit {

    private context: any;
    @ViewChild('board') private board: ElementRef;

    constructor( private gameService: GameService ) {
    }

    public ngOnInit() {
        this.context = this.board.nativeElement.getContext('2d');
        this.gameService.newGame();
        this.main(0);
    }

    public mouseMove( e: MouseEvent ): void {
        let pos = this.getMousePos(e);
        this.gameService.setPlayerAngle(pos);
        return;
    }

    public mouseDown( e: MouseEvent ): void {
        this.gameService.handleMouseDown();
    }

    private main( tframe: number ): void {
        // Request animation frames
        window.requestAnimationFrame(( timestamp ) => this.main(timestamp));
        if (this.gameService.PreLoaded) {
            this.gameService.update(tframe);
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
            this.gameService.GridWidth + 8, this.gameService.GridHeight + 4 - yOffset);

        // Render Bubbles
        this.drawBubbles();

        // Draw level bottom
        this.context.fillStyle = '#656565';
        this.context.fillRect(GameStatic.x - 4,
            GameStatic.y - 4 + this.gameService.GridHeight + 4 - yOffset,
            this.gameService.GridWidth + 8, 2 * GameStatic.bubbleHeight + 3);

        // Draw player
        this.drawPlayer();

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

    private drawPlayer(): void {

        let centerX = this.gameService.Player.X + GameStatic.bubbleWidth / 2;
        let centerY = this.gameService.Player.Y + GameStatic.bubbleHeight / 2;

        // Draw player background circle
        this.context.fillStyle = '#7a7a7a';
        this.context.beginPath();
        this.context.arc(centerX, centerY,
            GameStatic.radius + 12, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#8c8c8c';
        this.context.stroke();

        // Draw the angle
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#0000ff';
        this.context.beginPath();
        this.context.moveTo(centerX, centerY);
        this.context.lineTo(
            centerX +
            1.5 * GameStatic.bubbleWidth * Math.cos(degToRad(this.gameService.Player.Angle)),
            centerY -
            1.5 * GameStatic.bubbleHeight * Math.sin(degToRad(this.gameService.Player.Angle)));
        this.context.stroke();

        // Draw the next bubble
        this.drawBubble(
            this.gameService.Player.NextBubble.X,
            this.gameService.Player.NextBubble.Y,
            this.gameService.Player.NextBubble.Color
        );

        // Draw the current bubble
        if (this.gameService.Player.BubbleVisible) {
            this.drawBubble(
                this.gameService.Player.Bubble.X,
                this.gameService.Player.Bubble.Y,
                this.gameService.Player.Bubble.Color
            );
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

    private getMousePos( e: MouseEvent ): {x: number, y: number} {
        let rect = this.board.nativeElement.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left)
                * this.board.nativeElement.width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top)
                * this.board.nativeElement.height)
        };
    }
}
