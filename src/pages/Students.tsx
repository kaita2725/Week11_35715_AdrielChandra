import { IonContent, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonMenuButton, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/react';
import { addOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import {collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const Students: React.FC = () => {
  const db = getFirestore();
  const [students, setStudents] = useState<Array<any>>([]);

  useEffect(() => {
    async function getData() {
      const querySnapshot = await getDocs(collection(db, "students"));
      console.log('querySnapshot: ', querySnapshot);
      setStudents(querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id})));

      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        console.log('doc:', doc);
      })
    }
    getData();
  }, []);

  return (
    <IonPage>
      <IonToolbar>
        <IonButtons slot="primary">
          <IonButton routerLink="newstudents" onClick={() => {}}>
            <IonIcon slot="icon-only" icon={addOutline} />
          </IonButton>
        </IonButtons>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Students</IonTitle>
      </IonToolbar>
      <IonContent>
        <IonList>
          {students.map((student) => (
            <IonItem key={student.id}>
              <IonAvatar slot="start">
                <img src={student.fotoUrl}/>
              </IonAvatar>
              <IonLabel>
                {student.nim} <br />
                {student.nama} <br />
                {student.prodi}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Students;
