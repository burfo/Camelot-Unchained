/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
let Draggable = require('react-draggable');
import {client, GroupInvite} from 'camelot-unchained';
import Chat from 'cu-xmpp-chat';

import {LayoutState, Position, lockHUD, unlockHUD, savePosition, initializeHub} from '../../services/session/layout';
import {HUDSessionState} from '../../services/session/reducer';

import PlayerHealth from '../../widgets/PlayerHealth';
import TargetHealth from '../../widgets/TargetHealth';
import Warband from '../../widgets/Warband';
import InviteAlert from '../InviteAlert';

function select(state: HUDSessionState): HUDProps {
  return {
    layout: state.layout
  }
}

export interface HUDProps {
  dispatch?: (action: any) => void;
  layout?: LayoutState;
}

export interface HUDState {
  activeDrags: number;
  deltaPosition: {x:number,y:number};
  controlledPosition: {x:number,y:number};
  invites: GroupInvite[];
}

class HUD extends React.Component<HUDProps, HUDState> {
  healthX: number;
  healthY: number;

  constructor(props: HUDProps) {
    super(props);
    this.state = {
      activeDrags: 0,
      deltaPosition: {x:0,y:0},
      controlledPosition: {x:100,y:100},
      invites: [{
          created: '',
          groupType: 0,
          inviteCode: 'abcde-fgh12-341-5103',
          invitedByID: '',
          invitedByName: 'CSE-JB'
        },{
          created: '',
          groupType: 0,
          inviteCode: 'abcde-fgh12-341-5103',
          invitedByID: '',
          invitedByName: 'BEN'
        }]
    }
  }
  
  componentWillMount() {
  }

  componentDidMount() {
    this.props.dispatch(initializeHub());
  }

  handleDrag =  (e:any, ui:any) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    } as any);
  }

  onStart = () => {
    this.setState({activeDrags: ++this.state.activeDrags} as any);
  }

  onStop = () => {
    this.setState({activeDrags: --this.state.activeDrags} as any);
  }

  onWheel = (name: string, e: any) => {
    if (this.props.layout.locked) return;

    const factor = e.altKey ? 0.01 : 0.10;

    console.log(e.nativeEvent.deltaY);

    if (e.nativeEvent.deltaY < 0) {
      this.props.dispatch(savePosition(name, {
        x: this.props.layout.widgets[name].x,
        y: this.props.layout.widgets[name].y,
        scale: this.props.layout.widgets[name].scale - factor
      }));
    } else {
      this.props.dispatch(savePosition(name, {
        x: this.props.layout.widgets[name].x,
        y: this.props.layout.widgets[name].y,
        scale: this.props.layout.widgets[name].scale + factor
      }));
    }
  }

  draggableWidget = (name: string, widgets: any, Widget: any, containerClass: string, props?: any) => {
    const w = widgets[name];
    return (
      <Draggable handle='.drag-handle'
                  defaultPosition={{x: w.x, y: w.y}}
                  position={null}
                  grid={[1, 1]}
                  zIndex={100}
                  onStart={this.onStart}
                  onDrag={this.handleDrag}
                  onStop={(e:any, ui:any) => {
                    this.onStop();
                    this.props.dispatch(savePosition(name, {x: ui.x, y: ui.y, scale: w.scale}));
                  }}>
        <div>
          <div className={containerClass}
                style={{
                 transform:`scale(${w.scale})`,
                 height: `${w.height}px`,
                 width: `${w.width}px`
               }}
               onWheel={(e: any) => this.onWheel(name, e)}>
            <Widget {...props} />
            <div className={`drag-handle ${this.props.layout.locked ? 'hidden':''}`}></div>
          </div>
        </div>
      </Draggable>
    );
  }


        // {this.draggableWidget('PlayerHealth', widgets, PlayerHealth, 'player-health')}
        // {this.draggableWidget('TargetHealth', widgets, TargetHealth, 'target-health')}
        // {this.draggableWidget('Warband', widgets, Warband, 'warband')}
        // {this.draggableWidget('Chat', widgets, Chat, 'chat-window', {hideChat: () => {}, loginToken:client.loginToken})}
        // <InviteAlert invites={this.state.invites}
        //              acceptInvite={(invite: GroupInvite, force?: boolean) => {
        //                console.log('invite accepted')
        //                this.setState({
        //                  invites: []
        //                } as any)
        //              }}
        //              declineInvite={(invite: GroupInvite) => {
        //                this.setState({
        //                  invites: []
        //                } as any)
        //              }} />

        // <button onClick={() => locked ? this.props.dispatch(unlockHUD()) : this.props.dispatch(lockHUD())}
        //         style={{position: 'fixed'}}>Toggle UI Lock</button>
  
  
  // for now just a fixed chat
  render() {

    const widgets = this.props.layout.widgets;
    const locked = this.props.layout.locked;

    return (
      <div className='HUD'>
        
        <div className='chat-window' style={{
          height: '275px',
          width: '600px',
          position: 'absolute',
          bottom: '55px',
          left: '0'
        }}>
        <Chat loginToken={client.loginToken} hideChat={null} />
        </div>
      </div>
    )
  }
}



export default connect(select)(HUD);
