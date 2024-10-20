


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
let fireabse;
  // Initialize Firebase
  
  corentUser = {}
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const storage = firebase.storage();
  const database = firebase.database();

  CameraDict = {};
  let objectDetector;
  let status;
  let objects = [];
  let canvas, ctx;
  const width = 550;
  const height = 330;
  let CurrentCamera;
  let NavIndx = 1;
  let results;
  let Facesarr = [];
try{
  camra1=document.getElementById("camra1");
}catch{console.log("faild to chatch face from camra");}

//fetch ips from RTDB and update ips
var Cam1Ref=firebase.database().ref ('IOT/TelAviv/1/IP');
Cam1Ref.on('value',(snapshot) =>
{
  const data=snapshot.val();
  console.log("changed camara 1 ip to ",data);
  
    if(camra1){
      camra1.src = data;

    }

 
})
//  Sing IN
  function createUser(){
  
    corentUser.mail = document.getElementById("email").value
    corentUser.pass = document.getElementById("pass").value
    // if(!validatePassEndEmail(mail , pass)){
    //   console.log("invalid user name or password")
    //   return
    // }
    // email = document.getElementById("pass2").value
    //img = document.getElementById("img").files[0]
  
    createUserOnDB()
  }
  function saveUserOnRTDB(){
    database.ref('users/' + corentUser.uuid).set(corentUser);
  
  }
  function createUserOnDB(userImg){
  
    auth.createUserWithEmailAndPassword(corentUser.mail, corentUser.pass)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      corentUser.uuid = user.uid
      console.log(user)
      window.location.replace(" ./UploadCard.html");
      saveImgOnDB(userImg,(imgUrl)=>{
        corentUser.img = imgUrl
        console.log(corentUser)
        saveUserOnRTDB()
      })
     
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage)
      // ..
    });
  }
 // log in  
  function LogIn(){
  
    em  = document.getElementById("signInem").value
    pass = document.getElementById("signInPass").value
    auth.signInWithEmailAndPassword(em, pass)
    .then((userCredential) => {
      // Signed in
      corentUser.uuid = userCredential.user;
    
      
      // ...
    })
    
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }
  
  function BackToHomePage()
  {
    window.location.replace(" ./index.html");
  }
 let facemesh2;
 // CAMRA SCRIPT
 const options = {
  flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
  maxContinuousChecks: 5, // How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
  detectionConfidence: 0.9, // Threshold for discarding a prediction. Defaults to 0.9.
  maxFaces: 1, // The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
  scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75.
  iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }
 function make()
 {

  facemesh=ml5.facemesh(camera1,options,modelReady)
  canvas=createCanvas(width,height);
  ctx=canvas.getContext('2d');


 }
 // when the window is loaded 'call make
 window.addEventListener('DOMContentLoaded',function()
 {
  make();

 });
 function modelReady(){
  console.log('model ready')
  detected();
 }
 function detected(){
  facemesh.on(camra1,function(err,result){
    if(err){
      console.log(err);
      return
    }
    Facesarr=result;
    console.log("detect");
    if(Facesarr){
      draw()
    }
      detected()
  });
 }

 console.log(Facesarr);
 function draw() {
  // Clear part of the canvas
  facemesh.predict(camera1, results => {
    if (results){
      Facesarr = results;
        }
  });
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(camera1, 0, 0);
  for (let i = 0; i < Facesarr.length; i += 1) {

    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText(Facesarr[i].label, Facesarr[i].x + 4, Facesarr[i].y + 16);

    ctx.beginPath();
    ctx.rect(Facesarr[i].x, Facesarr[i].y, Facesarr[i].width, Facesarr[i].height);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();
  }
}
function createCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  document.getElementById('CameraDispalyDiv').appendChild(canvas);
  return canvas;
}
setInterval(function() {
  console.log(Facesarr);
},3000)
function onclickCC()
{
 
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase.database().ref('users/' + user.uid);
      firebase.database().ref('/userscards').set( user.uid);
      console.log( user.uid);
    } else {
      console.log('No user is currently signed in.');
    }
  }
  function checkUserExists(userId) {
    const user1 = firebase.auth().currentUser;
    userId = user1.uid; // set userId to the UID of the current user
    userRef = firebase.database().ref('/userscards/' + userId); // add / between userscards and userId
    console.log(userId);
    userRef.once('value')
      .then((snapshot) => {
        const exists = snapshot.exists();
        console.log("exists");
      })
      .catch((error) => {
        console.error(error);
      });
  }
  


 