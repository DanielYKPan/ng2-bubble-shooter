/**
 * movie.module
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './game.routes';
import { GameComponent } from './game.component';
import { GameService } from './service';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        GameComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        GameService
    ],
})
export class GameModule {
    public static routes = routes;
}
