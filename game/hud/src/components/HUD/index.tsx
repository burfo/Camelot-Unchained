/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
let Draggable = require('react-draggable');

import {LayoutState, Position, lockHUD, unlockHUD, savePosition, initializeHub} from '../../services/session/layout';
import {HUDSessionState} from '../../services/session/reducer';

import PlayerHealth from '../../widgets/PlayerHealth';
import TargetHealth from '../../widgets/TargetHealth';
import Party from '../../widgets/Party';

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
}

class HUD extends React.Component<HUDProps, HUDState> {
  healthX: number;
  healthY: number;

  constructor(props: HUDProps) {
    super(props);
    this.state = {
      activeDrags: 0,
      deltaPosition: {x:0,y:0},
      controlledPosition: {x:100,y:100}
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

  draggableWidget = (name: string, widgets: any, Widget: any) => {
    return (
      <Draggable handle='.drag-handle'
                  defaultPosition={{x: widgets[name].x, y: widgets[name].y}}
                  position={null}
                  grid={[1, 1]}
                  zIndex={100}
                  onStart={this.onStart}
                  onDrag={this.handleDrag}
                  onStop={(e:any, ui:any) => {
                    this.onStop();
                    this.props.dispatch(savePosition(name, {x: ui.x, y: ui.y, scale: widgets[name].scale}));
                  }}>
        <div>
          <div style={{transform:`scale(${widgets[name].scale})`}}
               onWheel={(e: any) => this.onWheel(name, e)}>
            <Widget />
            <div className={`drag-handle ${this.props.layout.locked ? 'hidden':''}`}></div>
          </div>
        </div>
      </Draggable>
    );
  }

  render() {

    const widgets = this.props.layout.widgets;
    const locked = this.props.layout.locked;

    return (
      <div className='HUD'>

        {this.draggableWidget('PlayerHealth', widgets, PlayerHealth)}
        {this.draggableWidget('TargetHealth', widgets, TargetHealth)}
        {this.draggableWidget('Party', widgets, Party)}

        <button onClick={() => locked ? this.props.dispatch(unlockHUD()) : this.props.dispatch(lockHUD())}
                style={{position: 'fixed'}}>Toggle UI Lock</button>
      </div>
    )
  }
}

export default connect(select)(HUD);
