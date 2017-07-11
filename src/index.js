import React from 'react';
import ReactDOM from 'react-dom';
import reactLogo from './assets/images/react-logo.png';
import './styles/base.sass';

let app = document.getElementById('app');

ReactDOM.render(
    <div>
        <img src={reactLogo} height={75} />
        <p>React Webpack Seed</p>
    </div>,
    app
)