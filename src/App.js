import './index.css';

import TitleBar from './components/TitleBar/TitleBar.component';
import BottomBar from './components/BottomBar/BottomBar.component';
import MainNavigation from './components/MainNavigation/MainNavigation.component';
import MainContainer from './components/Containers/MainContainer.component';

function App() {
  return (
    <>
      <TitleBar />
      <BottomBar />
      <MainNavigation />
      <MainContainer />
    </>
  );
}

export default App;
