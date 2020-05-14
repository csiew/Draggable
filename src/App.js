import React from 'react';
import { Route, HashRouter } from "react-router-dom";
import './assets/style.css';

import Taskbar from './components/Taskbar';

function App() {
    return (
        <HashRouter>
            <div id='container'>
                <Taskbar />
                <div className="content">
                    <Route exact path="/taskman" component={TaskManager}/>
                    <Route path="/poolman" component={PoolManager}/>
                    <Route path="/new" component={SampleWindow}/>
                    <Route path="/preferences" component={Preferences}/>
                </div>
            </div>
        </HashRouter>
    );
}

export default App;
