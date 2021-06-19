import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Home from "./home";

function App() {
  // a temporary setup of the Routes
  return (
    <Router>
      <Switch>
        <Route 
          exact 
          path="/"  
          component={Home} 
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
