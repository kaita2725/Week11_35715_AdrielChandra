import React from "react";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonMenuButton} from "@ionic/react";
import { useEffect, useState } from "react";
import { Foto, UrlSelectBadMemories } from "../data/UrlDatabase";

interface Memory {
  id: string;
  title: string;
  type: string;
  photo: string;
}

const BadMemories: React.FC = () => {
    const urlSelect = UrlSelectBadMemories;
    const foto = Foto;
    const [memories, setMemories] = useState<Memory[]>([]);

    useEffect(() => {
      setInterval(() => {
        fetch(UrlSelectBadMemories)
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
              <IonTitle>Bad Memories</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Bad Memories</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonGrid>
            {memories.length === 0 && (
              <IonRow>
                <IonCol className="ion-text-center">
                  <h2>No bad memories found.</h2>
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

export default BadMemories;
