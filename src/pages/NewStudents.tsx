import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonInput, IonButton, IonLabel } from "@ionic/react";
import React, { useRef, useState } from "react";
import {collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const NewStudents: React.FC = () => {
  const nim = useRef<HTMLIonInputElement>(null);
  const nama = useRef<HTMLIonInputElement>(null);
  const prodi = useRef<HTMLIonInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileName, setFileName] = useState('');

  const db = getFirestore();
  const storage = getStorage();

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFile(event.target!.files![0]);
      setFileName(event.target!.files![0].name);
  };

  const addData = async(url: string) =>{
    try {
      const docRef = await addDoc(collection(db, "students"), {
        nim: nim.current?.value,
        nama: nama.current?.value,
        prodi: prodi.current?.value,
        foto: fileName,
        fotoUrl: url
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding Document: ", e);
    }
  }

  const insertHandler = () => {
      const storageRef = ref(storage, fileName);
      uploadBytes(storageRef, selectedFile as Blob).then((snapshot) => {
        console.log('upload file success');
        getDownloadURL(ref(storage, fileName)).then((url) => {
          addData(url);
        })
      })
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add New Students</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <IonItem>
            <IonLabel position="floating">NIM</IonLabel>
            <IonInput ref={nim}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Nama</IonLabel>
            <IonInput ref={nama}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Prodi</IonLabel>
            <IonInput ref={prodi}></IonInput>
          </IonItem>
          <IonItem>
              <input type="file" onChange={fileChangeHandler}></input>
          </IonItem>
          <IonButton routerLink="/students" onClick={insertHandler}>Simpan</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NewStudents;
