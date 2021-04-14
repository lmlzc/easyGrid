import logo from './logo.svg';
import { BrowserRouter as Router,Switch,Route } from 'react-router-dom'
import Grid from './grid'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Grid />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
