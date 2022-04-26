import React from "react";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonMenuButton} from "@ionic/react";
import { useEffect, useState } from "react";
import { collection, getDocs,query, where } from "firebase/firestore"
import { getFirestore } from "firebase/firestore";

const BadMemories: React.FC = () => {
    const db = getFirestore();
    const [memories, setMemories] = useState<Array<any>>([]);

    const dbquery = query(collection(db, "memory"), where("type", "==", "bad"));

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

export default BadMemories;
