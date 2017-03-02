/**
 * game-state.reducer
 */

import { ActionReducer } from '@ngrx/store';
import { SET_GAME_STATE } from './actions.const';
import { Bubble } from './bubble';

export interface IGameState {
    gameOver: boolean;
    scores: number;
    best: number;
    bubble: Bubble,
    nextBubble: Bubble,
}

const defaultGameState = {
    gameOver: true,
    scores: 0,
    best: +localStorage.getItem('snake-best') || 0,
    bubble: null,
    nextBubble: null,
};

export const gameStateReducer: ActionReducer<any> =
    ( state: IGameState = defaultGameState, action: any ) => {
        switch (action.type) {
            case SET_GAME_STATE:
                return Object.assign({}, state, action.payload);


            default:
                return state;
        }
    };
