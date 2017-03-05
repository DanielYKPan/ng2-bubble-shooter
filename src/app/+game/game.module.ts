/**
 * movie.module
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './game.routes';
import { GameComponent } from './game.component';
import { GameService, bubblesReducer, gameStateReducer } from './service';
import { StoreModule } from '@ngrx/store';
import { GameBoardComponent } from './game-board';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        GameComponent,
        GameBoardComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        StoreModule.provideStore({
            bubbles: bubblesReducer,
            gameState: gameStateReducer,
        }),
    ],
    providers: [
        GameService
    ],
})
export class GameModule {
    public static routes = routes;
}
