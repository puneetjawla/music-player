console.log("lets write some javacript") 
let currentsong=new Audio();
let songs;
let currfolder
function secondsToMinutesSeconds(seconds) {
    // Ensure seconds is a non-decimal whole number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    seconds = Math.floor(seconds);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Pad seconds to always be two digits
    const formattedSecs = secs < 10 ? '0' + secs : secs;

    return `${mins}:${formattedSecs}`;
}
//my function

async function getsongs(folder){ 
    currfolder=folder
    let a = await fetch(`/${folder}/`) 
    let response=await a.text();
           
    let div=document.createElement("div")
    div.innerHTML=response; 
    let as=div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for(const song of songs){
        songul.innerHTML=songul.innerHTML+`<li><img class="invert" src="music.svg" alt=""> 
              <div class="info">
              <div> ${song.replaceAll("%20"," ")}</div>
              <div>puneet</div>
             </div>
             <div class="playnow">
              <span>play now</span>
              <img src="play.svg" alt="" class="invert">
             </div>
        </li>`;
    } 
   //attach an event listener to each song
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    
    })
    
   })
return songs
}


const playmusic=(track,pause=false)=>{
 currentsong.src= `/${currfolder}/`+track
 if(!pause){
currentsong.play()
 play.src="pause.svg"
 }
 
 document.querySelector(".songinfo").innerHTML=decodeURI(track)
 document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
   
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") ) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `  <div data-folder="${folder}" class="card">
         <div class="play">
          <svg width="50px" height="50px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <!-- Red circular background -->
            <circle cx="256" cy="256" r="256" fill="red" />
            <!-- Play button with black stroke centered -->
            <path d="M180,140V372c0,17.44,17,28.52,31,20.16l180-116c12.12-7.25,12.12-26.33,0-33.58l-180-116C197,111.48,180,122.56,180,140Z" 
              style="fill:black;stroke:none;" />
          </svg>
        
         </div>
         
         <img  src="/songs/${folder}/cover.jpg" alt="" class="src" >
          <h2>${response.title}</h2>
          <p>${response.description}</p>
        </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        console.log(e)
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0])
        })
    })
}    
async function main(){
    
    //get the list of all songs
    await getsongs("songs/ncs")
    playmusic(songs[0],true)
     displayAlbums()
    // console.log(songs)
 
   

//attach event listener for play,nextand previous
play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src="pause.svg"
    }
    else{
        currentsong.pause()
        play.src="play.svg"
    }
})
currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration)
    document.querySelector(".songtime").innerHTML=`${
        secondsToMinutesSeconds(currentsong.currentTime)}/${
            secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
})
//addevent listener to seek bar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})

previous.addEventListener("click", () => {
    currentsong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playmusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentsong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playmusic(songs[index + 1])
    }
})
 // Add an event to volume
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentsong.volume = parseInt(e.target.value) / 100
    if (currentsong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})
document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})



}               
main()



