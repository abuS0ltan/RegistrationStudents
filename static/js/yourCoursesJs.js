let coursesDataTable =document.querySelector('.coursesDataTable');
let regCountData =[];
let regCount =[];
let coursesData =[];
let schedulesData =[];
let regsData =[];
let apperData=[];

//------------------------------fetch data-----------------------------

async function getData(){
data=await fetch("coursesData.json");
return data.json();
}
async function getSchedulesData(){
data=await fetch("schedulesData.json");
return data.json();
}
async function getRegsData(){
data=await fetch("regsData.json");
console.log(data.json)
return data.json();
}
async function getRegCountData(){
    data=await fetch("regCount.json");
    return data.json();
    }
(async()=>{
const arr= await getData();
coursesData=arr.rows;
const arr2=await getSchedulesData();
schedulesData = arr2.rows;
const arr3=await getRegsData();
regsData = arr3.rows;
const arr4=await getRegCountData();
regCountData = arr4.regs;
await calcNumReg();
await displayData();
})();

//------------------------------end fetch data-----------------------------

function makeData(){
let apperData=[];
for (let index = 0; index < regsData.length; index++) {
    y=0;
    for ( y = 0; y < coursesData.length; y++) {
        if(regsData[index].coursed==coursesData[y].id)
            break;
    }
    apperData.push(coursesData[y]);
}
return apperData;
}
async function displayData(){
    console.log(regsData);
let x=0;
apperData = makeData();
let dataToTable = '';
for (let index = 0; index < apperData.length; index++) {
    for (; x < schedulesData.length; x++) {
    if(apperData[index].schedul==schedulesData[x].id)
        break;
    }
    dataToTable=dataToTable+`
        <tr class="row">
                        <td class="col needtowrap">${index+1}</td  >
                        <td class="col needtowrap">${apperData[index].code}</td>
                        <td class="col-2 needtowrap">${apperData[index].name}</td  >
                        <td class="col-2 needtowrap"><p class=''>${schedulesData[x].days}</p></td  >
                        <td class="col-2 needtowrap">${schedulesData[x].startTime} - ${schedulesData[x].endTime}</td   >
                        <td class="col needtowrap">${schedulesData[x].room}</td>
                        <td class="col-3 needtowrap">
                            <div class="btn btn-outline-light" onclick='displayDetails(${index})'>Details</div>
                            <div class="btn btn-dark" onclick='deleteCourse(${apperData[index].id})'>Delete</div>
                        </td>

                    </td>
        `;
        x=0;
}
coursesDataTable.innerHTML=dataToTable;
}
//------------------------------details-----------------------------
//------------------------------details-----------------------------
function displayDetails(index){
    let x=0;
    for (; x < schedulesData.length; x++) {
        if(coursesData[index].schedul==schedulesData[x].id)
            break;
    }
    let code=`${coursesData[index].code}`;
    let name=`${coursesData[index].name}`;
    let Description=`${coursesData[index].description}`;
    let Instructor=`${coursesData[index].instructor}`;
    let Prerequisites=`${coursesData[index].prerequisites}`;
    let Days=`${schedulesData[x].days}`;
    let Time=`${schedulesData[x].startTime} - ${schedulesData[x].endTime}`;
    let Room=`${schedulesData[x].room}`;
    let Capacity=`${regCount[index].num}/${coursesData[index].capacity}`;

    window.location = "coursesDeteils/"+code+'/'+name+'/'+Instructor+'/'+Description+'/'+Days+'/'+Prerequisites+'/'+Time+'/'+Room+'/'+Capacity+'/'+'yourCourses';    
}
//------------------------------end details-----------------------------
//------------------------------end details-----------------------------

//------------------------------delete btn-----------------------------

function deleteCourse(courseId){
    let index = 0;
    for (; index < regsData.length; index++) {
        if(courseId==regsData[index].coursed)
            break
    }
    console.log()
    window.location = "deleteCourse/"+String(regsData[index].id);    
}
//------------------------------end delete btn-----------------------------

async function calcNumReg(){
    count = 0;
    
    for (let index = 0; index < coursesData.length; index++) {
        for (let x = 0; x < regCountData.length; x++) {
            if (regCountData[x].coursed==coursesData[index].id) {
                count++;
            }
        }
        let y={
            coursesId:coursesData[index].id,
            courseName:coursesData[index].name,
            num:count
        }
        regCount.push(y);
        count=0;
    }
    console.log(regCount);
}
//------------------------------end calc-----------------------------


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