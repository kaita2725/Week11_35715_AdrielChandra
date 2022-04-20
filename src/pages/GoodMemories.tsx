import React from "react";
import {IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonIcon, IonContent, IonFab, IonFabButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonMenuButton} from "@ionic/react";
import { useEffect, useState } from "react";
import { isPlatform} from '@ionic/react';
import {addOutline} from "ionicons/icons";
import { Foto, UrlSelectGoodMemories } from "../data/UrlDatabase";

interface Memory {
  id: string;
  title: string;
  type: string;
  photo: string;
}

const GoodMemories: React.FC = () => {
    const urlSelect = UrlSelectGoodMemories;
    const foto = Foto;
    const [memories, setMemories] = useState<Memory[]>([]);

    useEffect(() => {
      setInterval(() => {
        fetch(UrlSelectGoodMemories)
        .then((response) => response.json())
        .then((data) => {
          data.memories === undefined ? setMemories([]): setMemories(data.memories);
        });
      }, 1000);
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
                      <img src={foto + (memory.photo ? memory.photo : "uploads/ITIX.png")} />
                      <IonCardHeader>
                        <IonCardTitle>{memory.title}</IonCardTitle>
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
