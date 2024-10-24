let video = document.querySelector("video");

let recordBtnCont = document.querySelector('.record-btn-cont');
let recordBtn = document.querySelector('.record-btn');
let captureBtnCont = document.querySelector('.capture-btn-cont');
let capturedBtn = document.querySelector('.capture-btn');

recordFlag = false;
let recorder;
let chunks//stores media data in chunks  



let transparentColor = "transparent";
let constrains ={
    video:true,
    audio:true

};
navigator.mediaDevices.getUserMedia(constrains).then((stream)=>{
 video.srcObject=stream;

 recorder = new MediaRecorder(stream);
 recorder.addEventListener('start', (e)=>{
    chunks=[];
 })
 recorder.addEventListener('dataavailable' , (e)=>{
    chunks.push(e.data);
 })
recorder.addEventListener('stop', (e)=>{
//conversion of media chunks data to video
let blob = new Blob(chunks,{type:'video/mp4'})

let videoURL = URL.createObjectURL(blob);

if(db){
    let videoID= shortid.generate();
    
    let dbTransaction = db.transaction("video" , "readwrite");
    let videoStore = dbTransaction.objectStore("video");
    let videoEntry = {
        id:`vid-${videoID}`,
        blobData:blob
    }
    videoStore.add(videoEntry);
}
// let a = document.createElement('a');
// a.href = videoURL;
// a.download = "stream.mp4";
// a.click();

 })

 
})

recordBtnCont.addEventListener('click',(e)=>{
    if(!recorder) return;
    recordFlag= !recordFlag;
    if(recordFlag){
        //start
        recorder.start()
        recordBtn.classList.add("scale-record");
        startTimer()
    }
    else{
        //close
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer()
    }
})
//capture
captureBtnCont.addEventListener('click' , (e)=>{
    let canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0 , canvas.width , canvas.height);
    /// Only apply filter if it's not transparent
      
        tool.fillStyle = transparentColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    
    console.log(transparentColor);  // Check what color is being applied
     let imageURL = canvas.toDataURL();    

    if(db){
        let imageID= shortid.generate();
        
        let dbTransaction = db.transaction("image" , "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id:`img-${imageID}`,
            url:imageURL
        }
        imageStore.add(imageEntry);
    }


})
//timer
let timerID ;
let counter=0;
let timer = document.querySelector('.timer');
function startTimer(){
  function displayTimer(){
  let TotalSecond=counter
   let hours = Number.parseInt(TotalSecond/3600)
   TotalSecond=TotalSecond%3600;
   let minutes =Number.parseInt(TotalSecond/60);
   TotalSecond=TotalSecond%60;
   let seconds = TotalSecond;

   if(hours<10){
    hours =`0${hours}`
   }
   
   
   if(minutes<10){
    minutes =`0${minutes}`
   }
   if(seconds<10){
    seconds =`0${seconds}`
   }
   timer.innerText =`${hours}:${minutes}:${seconds}`
    counter++;
}
timerID = setInterval(displayTimer,1000);
}

function stopTimer(){
    clearInterval(timerID);
   
    timer.innerText= "00:00:00";
    timer.style.display="none"
}

//filtering
let filterLayer  = document.querySelector('.filter-layer')
let allFilters = document.querySelectorAll('.filter');

allFilters.forEach((filterElem) => {
filterElem.addEventListener('click',(e)=>{
    //get style
    transparentColor=getComputedStyle(filterElem).getPropertyValue('background-color');
//set in layer
filterLayer.style.backgroundColor = transparentColor;
// filterElem.classList.add("border")

   })
})