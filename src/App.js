//Normalize css import
import './index.css';

//Module import
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Component import
import TitleBar from './components/TitleBar/TitleBar.component';
import BottomBar from './components/BottomBar/BottomBar.component';
import MainNavigation from './components/MainNavigation/MainNavigation.component';
import MainContainer from './components/Containers/MainContainer.component';

function App() {
  return (
    <Router>
      {/* Static Components */}
      <TitleBar />
      <BottomBar />
      <MainNavigation />

      {/* Dynamic Component */}
      <Switch>
        <Route exact path="/home" render={() => <MainContainer container="startContainer" />} />
        <Route exact path="/record" render={() => <MainContainer container="recordContainer" />} />
        <Route exact path="/review" render={() => <MainContainer container="recordContainer" />} />
      </Switch>
    </Router>
  );
}

export default App;
