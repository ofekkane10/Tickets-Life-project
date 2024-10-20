











let facemesh;
let video;
let predictions = [];
let count = 0;
let database;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  facemesh = ml5.facemesh(video, modelReady);

  // Initialize Firebase Realtime Database
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdgGyf3Ihwg8tD_fl7AyLZhMzKelclpSk",
  authDomain: "projectsmarttickets.firebaseapp.com",
  databaseURL: "https://projectsmarttickets-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projectsmarttickets",
  storageBucket: "projectsmarttickets.appspot.com",
  messagingSenderId: "380540872177",
  appId: "1:380540872177:web:d52b4e54f52f85ce57d050",
  measurementId: "G-XP2MFVZB0T"
};
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("face", results => {
    predictions = results;
    count++;
    if (count == 1) {
      console.log("arrived");
      // Send predictions to Firebase Realtime Database
      database.ref('/facemesh_results').set(predictions, (error) => {
        if (error) {
          console.error('Failed to write to database:', error);
        } else {
          console.log('Data written to database successfully!');
        }
      });
    }
    const userRef = firebase.database().ref('users/' + user.uid);
    firebase.database().ref('/userscards').set( user.uid);

    console.log(predictions);
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}
function BackToHomePage()
  {
    window.location.replace(" ./index.html");
  }