import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useContext, useEffect } from 'react';
import MemoryTabs from './pages/MemoryTabs';
import BadMemories from './pages/BadMemories';
import GoodMemories from './pages/GoodMemories';
import NewMemory from './pages/NewMemory';
import NewStudents from './pages/NewStudents';
import Students from './pages/Students';
import Menu from "./components/Menu";
import MemoriesContext from './data/memories-context';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import "./firebaseConfig";
setupIonicReact();

const App: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);
  const {initContext} = memoriesCtx;
  localStorage.clear();
  indexedDB.deleteDatabase("Disc");
  useEffect(() => {
    initContext();
  }, [initContext]);
  return(
    <IonApp>
      <IonReactRouter>
        <Menu />
        <IonRouterOutlet id="main">
        <Route path="/tabs" component={MemoryTabs}/>
        <Route path="/BadMemories" component={BadMemories}/>
        <Route path="/GoodMemories" component={GoodMemories}/>
        <Route path='/NewMemory' component={NewMemory}/>
        <Route path="/students" component={Students} exact={true} />
        <Route path="/newstudents" component={NewStudents} exact={true} />
        <Redirect exact from="/" to="/tabs" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
