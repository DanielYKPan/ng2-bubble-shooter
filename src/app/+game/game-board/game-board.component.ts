/**
 * game-board.component
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService, GameStatic } from '../service';

@Component({
    selector: 'app-game-board',
    templateUrl: 'game-board.component.html'
})
export class GameBoardComponent implements OnInit {

    public gridWidth: number;
    public gridHeight: number;

    @ViewChild('board') private board: ElementRef;

    constructor( private gameService: GameService ) {
    }

    public ngOnInit() {
        this.gridWidth = GameStatic.bubbleWidth * GameStatic.columns + GameStatic.bubbleWidth / 2;
        this.gridHeight = GameStatic.rowHeight * GameStatic.rows;
        this.main();
    }

    private main(): void {
        this.render();
    }

    private render() {
        let context = this.board.nativeElement.getContext('2d');

        // Draw game board background
        context.fillStyle = "#e8eaec";
        context.fillRect(0, 0, this.board.nativeElement.width, this.board.nativeElement.height);

        // Draw grid background
        let yOffset = GameStatic.bubbleHeight / 2;
        context.fillStyle = "#8c8c8c";
        context.fillRect(GameStatic.x - 4, GameStatic.y - 4, this.gridWidth + 8, this.gridHeight + 4 - yOffset);
    }
}
