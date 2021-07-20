import './App.css';
import './index.css';
import TitleBar from './components/TitleBar/TitleBar.component';
import BottomBar from './components/BottomBar/BottomBar.component';
import MainNavigation from './components/MainNavigation/MainNavigation.component';

function App() {
  return (
    <>
      <TitleBar />
      <BottomBar />
      <MainNavigation />
    </>
  );
}

export default App;
