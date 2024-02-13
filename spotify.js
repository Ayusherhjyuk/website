
// const playbtn=document.querySelector(".playnow");

// const audio=new Audio("./songs/1.mp3")

// playbtn.addEventListener("click", ()=>  {
//     audio.play();
// })

let currentsong=new Audio();    
let songs;                   //declaring it as a global variable
let currfolder;

// this function is used to convert floating point seconds to int point seconds
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder)                    //fetching songs
{
    currfolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response=await a.text();
    console.log(response)

    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    
     songs=[]
    for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.includes(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
    
  }




  let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songul.innerHTML=""
   for (const song of songs) {
    songul.innerHTML=songul.innerHTML + `<li>
              <img class="invert" src="music.png">
        <div class="info">
              
              <div>${song}</div>
              
              
        </div>
            <div class="playnow">Play now</div>
            <img class="invert"src="play.svg">
             
     </li>`;
   }

   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

    e.addEventListener("click",element=>{

   // console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML)
   })
 })
  return songs
}

const playmusic=(track)=>{
   // let audio=new Audio("/songs/" + track)
   currentsong.src=`/${currfolder}/` + track
    currentsong.play()
    play.src="pause.png"
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}


 



async function main()
{
    await getsongs("songs/arjitsingh")
    
    //console.log(songs)



   


//attach an event listerner to ids play,previous,next

play.addEventListener("click",e=>{
    if(currentsong.paused){
        currentsong.play()
        play.src="pause.png"
    }
    else{
        currentsong.pause()
        play.src="play.svg"
    }
})

currentsong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`
    ${secondsToMinutesSeconds(currentsong.currentTime)}/
    ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%"
})

//move circle if you click on seekbar   ***
document.querySelector(".seekbar").addEventListener("click",e=>{  
    let perc=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    document.querySelector(".circle").style.left= perc+"%"
    currentsong.currentTime = ((currentsong.duration) * perc)/100;

})

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-5"+"%"
})

document.querySelector(".left .close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120"+ "%"                 
})
//the response in iphone with width 100% is getting cutted and thus we use 120% shift

//add event listerners for previous and next 
previous.addEventListener("click",()=>{
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    playmusic(songs[index-1])
})


next.addEventListener("click",()=>{
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    playmusic(songs[index+1])
})

//event listerner for volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
currentsong.volume=parseInt(e.target.value)/100
})
Array.from(document.getElementsByClassName("card")) .forEach(e=>{
    e.addEventListener("click", async item=>{
        songs=await getsongs(`songs/${ item.currentTarget.dataset.folder}`)
    
    })
})


}


main()







