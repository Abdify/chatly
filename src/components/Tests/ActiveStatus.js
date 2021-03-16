import firebase from 'firebase/app';
import 'firebase/database';
import React, { useState } from 'react';
import { firestore } from '../../firebase';

    const ActiveStatus = ({uid}) => {
        // const uid = auth.currentUser.uid;
        const userStatusFirestoreRef = firestore.doc("/status/" + uid);
        const userStatusDatabaseRef = firebase.database().ref("/status/" + uid);

        const isOfflineForFirestore = {
            state: "offline",
            last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };

        const isOnlineForFirestore = {
            state: "online",
            last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };
        const isOfflineForDatabase = {
            state: "offline",
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        const isOnlineForDatabase = {
            state: "online",
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };


        firebase
            .database()
            .ref(".info/connected")
            .on("value", function (snapshot) {
                console.log(snapshot.val())
                if (snapshot.val() === false) {
                    userStatusFirestoreRef.set(isOfflineForFirestore);
                    return;
                }

                userStatusDatabaseRef
                    .onDisconnect()
                    .set(isOfflineForDatabase)
                    .then(function () {
                        userStatusDatabaseRef.set(isOnlineForDatabase);

                        // We'll also add Firestore set here for when we come online.
                        userStatusFirestoreRef.set(isOnlineForFirestore);
                    });
            });

        const [activeStatus, setActiveStatus] = useState(false);
        userStatusFirestoreRef.onSnapshot(function (doc) {
            const isOnline = doc.data().state === "online";
            setActiveStatus(isOnline);
        });
        return <div style={{color: "white"}}>{activeStatus ? "online": "offline"}</div>;
    

    };

export default ActiveStatus;