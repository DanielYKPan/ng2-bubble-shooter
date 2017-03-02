/**
 * bubbles.reducer
 */

import { ActionReducer } from '@ngrx/store';
import { Bubble } from './bubble';
import { STORE_BUBBLES } from './actions.const';

export const bubblesReducer: ActionReducer<Bubble[]> = ( state: Bubble[] = [], action: any ) => {

    switch (action.type) {
        case STORE_BUBBLES:
            return Object.assign([], action.payload.bubbles);

        default:
            return state;
    }
};
