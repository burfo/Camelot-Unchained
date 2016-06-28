/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client} from 'camelot-unchained';
import {Substance} from '../../lib/Substance';

const SELECT_SUBSTANCE = 'blocks/substances/SELECT_SUBSTANCE';
const LOAD_SUBSTANCES = 'blocks/substances/LOAD_SUBSTANCES';
const LOAD_SUBSTANCES_SUCCESS = 'blocks/substances/LOAD_SUBSTANCES_SUCCESS';
const LOAD_SUBSTANCES_FAILED = 'blocks/substances/LOAD_SUBSTANCES_FAILED';

export function selectSubstance(id: number): SubstancesAction {
  return {
    type: SELECT_SUBSTANCE,
    id: id
  }
}

export function loadSubstances() {
  
}

function DoLoadSubstances() {
  
}

export function loadSubstancesSuccess(substances: [Substance], substanceShapes: any): SubstancesAction {
  return {
    type: LOAD_SUBSTANCES_SUCCESS,
    substances: substances,
    substanceShapes: substanceShapes,
    time: new Date(),
  }
}

export interface SubstanceShapes {
  substanceId: number,
  blockIds: [number]
}

export interface SubstancesAction {
  type: string;
  id?: number;
  time?: Date;
  substances?: [Substance];
  substanceShapes?: any;
  error?: string;
}

export interface SubstancesState {
  isLoading?: boolean;
  lastLoaded?: Date;
  substances?: [Substance];
  selectedSubstance?: number;
  substanceShapes?: any;  // Dictionary of SubstanceShapes with substanceId as keys
  error?: string;
}

const initialState: SubstancesState = {
  substances: null,
  selectedSubstance: 0,
  isLoading: false,
  lastLoaded: null,
}

export default function reducer(state: SubstancesState = initialState, 
                                action: SubstancesAction = {type: null}): SubstancesState {
  switch(action.type) {
    case LOAD_SUBSTANCES:
      return Object.assign({}, state, {
        isLoading: true
      });
    case LOAD_SUBSTANCES_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        lastLoaded: action.time,
        substances: action.substances,
        substanceShapes: action.substanceShapes,
      });
    case LOAD_SUBSTANCES_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error,
      });
    case SELECT_SUBSTANCE:
      return Object.assign({}, state, {
        selectedSubstance: action.id
      });
    default: return state;
  }
}
