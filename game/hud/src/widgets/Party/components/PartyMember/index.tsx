/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Player, archetype} from 'camelot-unchained';

import PlayerStatusBar, {PlayerStatusStyle} from '../../../../components/PlayerStatusBar';

export interface PartyMemberProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface PartyMemberState {
}

class PartyMember extends React.Component<PartyMemberProps, PartyMemberState> {

  constructor(props: PartyMemberProps) {
    super(props);
  }

  render() {
    var player = new Player();
    player.archetype = archetype.EMPATH;

    const mini = this.props.isMini || false;

    let bar:any = null;
    if (mini) {
      bar = <PlayerStatusBar containerClass='PartyMemberHealth__bar mini'
                         style={PlayerStatusStyle.MiniParty}
                         player={player}/>;
    } else {
      bar = <PlayerStatusBar containerClass='PartyMemberHealth__bar'
                         style={PlayerStatusStyle.FullParty}
                         player={player}/>;
    } 

    return (
      <div className={`PartyMember ${mini ? 'mini': ''} ${this.props.containerClass}`}>
        {bar}
      </div>
    )
  }
}

export default PartyMember;
