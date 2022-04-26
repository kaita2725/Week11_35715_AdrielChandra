import React from "react";
import { useState, useRef} from "react";
import { useHistory } from "react-router-dom";
import {IonPage, IonGrid, IonHeader, IonToolbar, IonTitle,  IonSelect, IonSelectOption, IonContent, IonButtons, IonBackButton, IonLabel, IonIcon, IonRow, IonCol, IonButton, IonInput} from "@ionic/react";
import {camera} from "ionicons/icons";
import {Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { collection, addDoc } from "firebase/firestore"
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const NewMemories: React.FC = () => {
    const [takenPhoto, setTakenPhoto] = useState<{
      path: string | undefined;
      preview: string;
    }>();
    const [chosenMemoryType, setChosenMemoryType] = useState<'good' | 'bad'>('good');
    const titleRef = useRef<HTMLIonInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [fileName, setFileName] = useState('');
    const history = useHistory();

    const db = getFirestore();
    const storage = getStorage();

    const selectMemoryTypehandler = (event: CustomEvent) => {
      const selectedMemoryType = event.detail.value;
      setChosenMemoryType(selectedMemoryType);
    }

    const addData = async(url: string, title: string) =>{
      try {
        const docRef = await addDoc(collection(db, "memory"), {
          titleRef: title,
          type: chosenMemoryType,
          foto: fileName,
          fotoUrl: url
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding Document: ", e);
      }
    }

    const addMemoryHandler = async () =>{
      const enteredTitle = titleRef.current?.value;
      if(!enteredTitle || enteredTitle.toString().trim().length === 0 || !takenPhoto || !chosenMemoryType){
        return;
      }
      const title= titleRef.current?.value as string;
      const storageRef = ref(storage, fileName);
      uploadBytes(storageRef, selectedFile as Blob).then((snapshot) => {
        console.log('upload file success');
        getDownloadURL(ref(storage, fileName)).then((url) => {
          addData(url, title);
        })
      })

      if(chosenMemoryType == 'good'){
        history.length > 0 ? history.goBack() : history.replace('/good-memories');
      }
      else if(chosenMemoryType == 'bad')
      {
        history.length > 0 ? history.goBack() : history.replace('/bad-memories');
      }
    }

    const takePhotoHandler = async () => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 80,
        width: 500
      });
      // console.log(photo);
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      setSelectedFile(blob as File);
      const photoName = (new Date().getTime() + ".jpeg") as string;
      setFileName(photoName);

      if(!photo || /* !photo.path || */ !photo.webPath)
      {
        return;
      }

      setTakenPhoto(
        {
          path: photo.path ? photo.path : "",
          preview: photo.webPath
        });
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/"></IonBackButton>
            </IonButtons>
            <IonTitle>Add New Memories</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Add New Memories</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonGrid>
            <IonRow className="ion-padding">
              <IonCol>
                  <IonLabel>Memory Title</IonLabel>
                  <IonInput type="text" ref={titleRef}></IonInput>
              </IonCol>
            </IonRow>
            <IonRow className="ion-text-center">
              <IonCol>
                <div className="image-preview">
                  {!takenPhoto && <h3>No photo choosen</h3>}
                  {takenPhoto && <img src={takenPhoto.preview} alt="Preview"/>}
                </div>
                <IonButton fill = "clear" onClick={takePhotoHandler}>
                  <IonIcon slot="start" icon={camera}></IonIcon>
                  <IonLabel>Take Photo</IonLabel>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonSelect onIonChange={selectMemoryTypehandler} value={chosenMemoryType}>
                  <IonSelectOption value="good">Good Memory</IonSelectOption>
                  <IonSelectOption value="bad">Bad Memory</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top">
              <IonCol className="ion-text-center">
                <IonButton onClick={addMemoryHandler}>Add Memory</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
};

export default NewMemories;
