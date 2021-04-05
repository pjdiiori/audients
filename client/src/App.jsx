import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AudientsContextProvider } from "./context/AudientsContext";
import { AllAudients } from './components/AllAudients';
import { OneAudient } from './components/OneAudient';
import { UploadAudient } from './components/UploadAudient';

const App = () => {
    return (
        <AudientsContextProvider>
            <div className="container">
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={AllAudients}
                        />
                        <Route
                            exact
                            path="/:id/detail"
                            component={OneAudient}
                        />
                        <Route
                            exact
                            path="/upload"
                            component={UploadAudient}
                        />
                    </Switch>
                </Router>
            </div>
        </AudientsContextProvider>
    )
}

export default App;