/**
 * game.component
 */

import { Component, OnInit } from '@angular/core';
import { GameService, GameStatic, Bubble } from './service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

    public bubbles$: Observable<Bubble[]>;
    private bubbleBoardWidth: number;
    private bubbleBoardHeight: number;
    private rowHeight: number;
    private bubbleWidth: number;
    private bubbleHeight: number;

    constructor( private gameService: GameService,
                 private store: Store<any> ) {
    }

    public ngOnInit() {
        this.bubbles$ = this.store.select('bubbles');
        this.gameService.buildGrid();
        this.bubbleWidth = GameStatic.bubbleWidth;
        this.bubbleHeight = GameStatic.bubbleHeight;
        this.rowHeight = GameStatic.rowHeight;
        this.bubbleBoardHeight = this.rowHeight * GameStatic.rows;
        this.bubbleBoardWidth = this.bubbleWidth * GameStatic.columns + this.bubbleWidth / 2;
    }

    public getBubbleBoardStyle(): Object {
        return {
            width: this.bubbleBoardWidth + 'px',
            height: this.bubbleBoardHeight + 'px'
        };
    }

    public getBubbleStyle( bubble: Bubble ): Object {
        return {
            'width': this.bubbleWidth + 'px',
            'height': this.bubbleHeight + 'px',
            'left': bubble.Y % 2 === 0 ? bubble.X * this.bubbleWidth + 'px' :
                bubble.X * this.bubbleWidth + this.bubbleWidth / 2 + 'px',
            'top': bubble.Y * this.bubbleHeight -
            (this.bubbleHeight - this.rowHeight) * bubble.Y + 'px',
            'background-position': bubble.Color * this.bubbleWidth * -1 + 'px' + ' 0px'
        };
    }
}
