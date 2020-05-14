import React, { Component } from 'react';

export default class DgWindow extends Component {
    constructor(props) {
        super(props);
        this.info = {
            id: '',
            title: '',
            content: '',
        }
        this.state = {
            focused: true,
            hidden: false,
            zoomed: false,
        }
        this.focus = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.zoom = this.zoom.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    focus = () => {}

    hide = () => {}

    show = () => {
        let stateObject = {};
        stateObject[modalName] = true;
        this.setState(stateObject);
    }

    zoom = () => {}

    destroy = () => {}

    render() {
        return (
            <div className="dragWindow">
                <div className="dragWindowHeader">
                    <div className="dragWindowControls"></div>
                    <div className="dragWindowHeaderTitle">
                        Hello World
                    </div>
                    <div className="dragWindowControls"></div>
                </div>
                <div className="dragWindowContent"></div>
                <div className="dragWindowResizer"></div>
            </div>
        );
    }
}
