/**
 * game.routes
 */

import { GameComponent } from './game.component';

export const routes = [
    {
        path: '',
        children: [
            {path: '', component: GameComponent},
        ]
    },
];
