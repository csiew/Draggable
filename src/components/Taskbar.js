import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import '../assets/style.css';

export default class Taskbar extends Component {
    render() {
        return (
            <div id='taskbar' className='taskbar'>
                {/* <button><NavLink to="/taskman">TaskMan</NavLink></button> */}
                {/* <button><NavLink to="/poolman">PoolMan</NavLink></button> */}
                <button><NavLink to="/new">New</NavLink></button>
                <div id='taskbarTasklist' className='taskbarTasklist'></div>
                {/* <button><NavLink to="/preferences">Prefs</NavLink></button> */}
            </div>
        );
    }
}