//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------


//------------------------------notifications btn-----------------------------
let notificationsData=[];
let modalBody =document.querySelector('.modal-body');
let badge=document.querySelector('.badge-dark');

//------------------------------fetch data-----------------------------
async function getNotificationsData(){
    let data=await fetch("newsData.json");
    return data.json();
    }
(async()=>{
    const arr= await getNotificationsData();
    notificationsData=arr.rows;
    console.log(notificationsData);
    await displayBadge();
})();
// //------------------------------end fetch data-----------------------------


// //------------------------------notifications btn-----------------------------

function notificationsDisplay(){
    $('.modal').css('display','block');
    let dataToModel='';
    for (let index = 0; index < notificationsData.length; index++) {
        dataToModel=dataToModel+`
            <p class="NotificationsP">
                ${notificationsData[index].title}
                <br>
                ${notificationsData[index].timeAndDate}
                <br>
                ${notificationsData[index].info}
            </p>
        `;    
    }
    modalBody.innerHTML=dataToModel;
}

//------------------------------end notifications btn-----------------------------
async function displayBadge(){
    badge.innerHTML=notificationsData.length+1;
}