/**
 * game-state.reducer
 */

import { ActionReducer } from '@ngrx/store';
import { SET_GAME_STATE } from './actions.const';
import { Bubble } from './bubble';

export enum GameState {
    Ready,
    ShootBubble,
    Over,
}

export interface IGameState {
    gameState: GameState;
    scores: number;
}

const defaultGameState = {
    gameState: GameState.Ready,
    scores: 0,
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
