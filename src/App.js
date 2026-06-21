import React from 'react'
import { Route, Switch } from "react-router-dom";
import Header from './Header';
import TypingSmooth from './tt.smoth'

import Mouse from './mouse';
import NotFoundPage from './NotFoundPage';
import HomePage from './HomePage';

export default function App() {
    return (
        <div>
            <Header />
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/typing" component={TypingSmooth} />
                <Route path="/mouse" component={Mouse} />
                <Route component={NotFoundPage} />
            </Switch>

        </div>
    )
}
