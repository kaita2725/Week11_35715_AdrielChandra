import React from "react";
import {IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonIcon, IonContent, IonFab, IonFabButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonMenuButton} from "@ionic/react";
import { useEffect, useState } from "react";
import { isPlatform} from '@ionic/react';
import {addOutline} from "ionicons/icons";
import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirestore } from "firebase/firestore";

const GoodMemories: React.FC = () => {
    const db = getFirestore();
    const [memories, setMemories] = useState<Array<any>>([]);

    const dbquery = query(collection(db, "memory"), where("type", "==", "good"));
    useEffect(() => {
      async function getData() {
        const querySnapshot = await getDocs(dbquery);
        console.log('querySnapshot: ', querySnapshot);
        setMemories(querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id})));

        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
          console.log('doc:', doc);
        })
      }
      getData();
    }, []);

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Good Memories</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Good Memories</IonTitle>
                <IonButtons slot="end" >
                  <IonButton routerLink="/tabs/NewMemory">
                    <IonIcon size="large"  md={addOutline} ios={addOutline}/>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>

            {isPlatform('android') && (
              <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton routerLink="/tabs/NewMemory">
                    <IonIcon size="large"  md={addOutline} ios={addOutline}/>
                </IonFabButton>
              </IonFab>
            )}

            <IonGrid>
              {memories.length === 0 && (
                <IonRow>
                  <IonCol className="ion-text-center">
                    <h2>No good memories found.</h2>
                  </IonCol>
                </IonRow>
              )}
              {memories.map(memory => (
                <IonRow key={memory.id}>
                  <IonCol>
                    <IonCard>
                      <img src={(memory.fotoUrl)} />
                      <IonCardHeader>
                        <IonCardTitle>{memory.titleRef}</IonCardTitle>
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonContent>
        </IonPage>
    );
};

export default GoodMemories;
