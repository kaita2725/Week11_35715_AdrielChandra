import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/react';

const Menu: React.FC = () => {
    return (
      <IonMenu contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle>
              <IonItem routerLink={"/students"}>
                <IonLabel>Students</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle>
              <IonItem routerLink={"/tabs/goodmemories"}>
                <IonLabel>Memories</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
    );
  };

  export default Menu;
