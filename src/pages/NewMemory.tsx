import React from "react";
import { useState, useRef} from "react";
import { useHistory } from "react-router-dom";
import {IonPage, IonGrid, IonHeader, IonToolbar, IonTitle,  IonSelect, IonSelectOption, IonContent, IonButtons, IonBackButton, IonLabel, IonIcon, IonRow, IonCol, IonButton, IonInput, useIonAlert} from "@ionic/react";
import {camera} from "ionicons/icons";
import {Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UrlInsertMemories } from "../data/UrlDatabase";

const NewMemories: React.FC = () => {
    const [takenPhoto, setTakenPhoto] = useState<{
      path: string | undefined;
      preview: string;
    }>();
    const [chosenMemoryType, setChosenMemoryType] = useState<'good' | 'bad'>('good');
    const titleRef = useRef<HTMLIonInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File>();
    const urlInsert = UrlInsertMemories;
    const [present] = useIonAlert();
    const history = useHistory();

    const selectMemoryTypehandler = (event: CustomEvent) => {
      const selectedMemoryType = event.detail.value;
      setChosenMemoryType(selectedMemoryType);
    }

    const addMemoryHandler = async () =>{
      const enteredTitle = titleRef.current?.value;
      if(!enteredTitle || enteredTitle.toString().trim().length === 0 || !takenPhoto || !chosenMemoryType){
        return;
      }

      const formData = new FormData();
      const title = titleRef?.current.value as string;
      const type = chosenMemoryType as string;
      const photoName = (new Date().getTime() + ".jpeg") as string;
      formData.append("title", title);
      formData.append("type", type);
      formData.append("photo", selectedFile as File);
      formData.append("photoName", photoName);

      fetch(urlInsert, {
      method: "post",
      body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          const dataObj = JSON.parse(data);
          present({
            message: dataObj["message"],
            header: dataObj["success"] === 1 ? "Success" : "Failed",
            buttons: ["Ok"],
          });
        });

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

      if(!photo || /* !photo.path || */ !photo.webPath)
      {
        return;
      }

      setTakenPhoto(
        {
          path: photo.path,
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
