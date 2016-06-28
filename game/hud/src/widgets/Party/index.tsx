/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Player, archetype} from 'camelot-unchained';

import PlayerStatusBar, {PlayerStatusStyle} from '../../components/PlayerStatusBar';

import PartyMember from './components/PartyMember';

export interface PartyProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface PartyState {
}

class Party extends React.Component<PartyProps, PartyState> {

  constructor(props: PartyProps) {
    super(props);
  }

  render() {
    return (
      <div className={`party ${this.props.containerClass}`}>
        <PartyMember />
        <PartyMember />
        <PartyMember />
        <PartyMember />
      </div>
    )
  }
}

export default Party;
