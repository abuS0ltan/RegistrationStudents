//------------------------------define varible-----------------------------
let coursesDataTable =document.querySelector('.coursesDataTable');
let coursesData =[];
let schedulesData =[];
let regCountData =[];
let regCount =[];
let FullCourses=[];
let regCoursesData=[];
let allBtn=document.querySelectorAll('.allBtn');
let suggestedBtn=document.querySelector('.suggestedBtn');
let suggestedCourses = [];
//------------------------------end define varible-----------------------------

//------------------------------fetch data-----------------------------
async function getData(){
data=await fetch("coursesData.json");
return data.json();
}
async function getSchedulesData(){
data=await fetch("schedulesData.json");
return data.json();
}
async function getRegCountData(){
data=await fetch("regCount.json");
return data.json();
}
async function getRegCoursesData(){
data=await fetch("regsData.json");
return data.json();
}
(async()=>{
const arr= await getData();
coursesData=arr.rows;
const arr2=await getSchedulesData();
schedulesData = arr2.rows;
const arr3=await getRegCountData();
regCountData = arr3.regs;
const arr4=await getRegCoursesData();
regCoursesData= arr4.rows;
console.log(regCoursesData);
await calcNumReg();
await displayData(coursesData);
await calcSuggestedCourses();
})();

//------------------------------end fetch data-----------------------------

//------------------------------calc number reg for every course-----------------------------
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
        num:count
    }
    regCount.push(y);
    count=0;
}
}
//------------------------------end calc-----------------------------

//------------------------------disabled add full course -----------------------------
function disabledFull(){
for (let index = 0; index < regCount.length; index++) {
    
        if (coursesData[index].capacity==regCount[index].num) {
            FullCourses.push(coursesData[index].id);
        }
        
    
}
}
//------------------------------end disabled add full course-----------------------------

//------------------------------disabled add Clash courses -----------------------------
function disabledClash (course){
    isInSameTime=false;
    let index = 0;
    for (; index < regCoursesData.length; index++) {
        for (let y = 0; y < coursesData.length; y++) {
            if(coursesData[y].id==regCoursesData[index].coursed){
                if(coursesData[y].schedul==course.schedul){
                    isInSameTime=true;
                }
            }
        }   
    }
    return isInSameTime;
}
//------------------------------end disabled add Clash courses-----------------------------

//------------------------------display data-----------------------------

async function displayData(apperData){
disabledFull();
isInSameTime=false;
let full=false;
let dontTakePrerequisites=false;
let dataToTable = '';
let idPrerequisites='';
let myError=`You can't add the course because : `;
for (let index = 0; index < apperData.length; index++) {
    isInSameTime= disabledClash(apperData[index]);
    if(isInSameTime){
        console.log('hi')
        myError = myError +`It conflicts with the date of another course. `;
    }
    for (let x = 0; x < FullCourses.length; x++) {
        if(FullCourses[x]==apperData[index].id)
        {
            myError= myError+' is full. ';
            full=true;
            break;
        }
    }
    if(apperData[index].prerequisites!=null){
        dontTakePrerequisites=true;
        myError= myError+' not take Prerequisites. ';
        let a = 0;
        for (; a < apperData.length; a++) {
            if(apperData[index].prerequisites==apperData[a].code)
            {
                idPrerequisites=apperData[a].id;
                break;
            }
        }
        for (let z = 0; z < regCoursesData.length; z++) {
            if(regCoursesData[z].coursed==idPrerequisites)
            {   
                dontTakePrerequisites=false;
                break;
            }
            else{
                
            }
        }
    }
    if(full||dontTakePrerequisites||isInSameTime){
        dataToTable=dataToTable+`
        <tr class='row'>
            <td class='col-3 needtowrap'>${apperData[index].code}</td>
            <td class='col-4 needtowrap'>${apperData[index].name}</td>
            <td class='col-5 needtowrap'>
                <div class="alert alert-danger my-3" role="alert">
                     ${myError}
                     <br>
                     <button class="btn btn-dark my-1"  onclick='displayDetails(${index})'>Details</button>

                </div>
            </td>
        </tr>
    `;
}
else
{
    dataToTable=dataToTable+`
        <tr class='row'>
            <td class='col-3 needtowrap'>${apperData[index].code}</td>
            <td class='col-4 needtowrap'>${apperData[index].name}</td>
            <td class='col-5 needtowrap position-relative'>
                <button class="btn btn-outline-light"  onclick='displayDetails(${index})'>Details</button>
                <button class="btn btn-light mt-1 " onclick='addCourse(${apperData[index].id})'>Add</button>
            </td>
        </tr>
    `;
}
dontTakePrerequisites=false;
idPrerequisites='';
full=false;
myError=`You can't add the course because : `;
}
    
coursesDataTable.innerHTML=dataToTable;

}
//------------------------------end display data-----------------------------


//------------------------------srarch------------------------------
let searchInstructor = document.getElementById('searchInstructor');
let searchName = document.getElementById('searchName');
let searchCode = document.getElementById('searchCode');
searchCode.addEventListener('keyup',function(){
let dataApper=[];
for (let index = 0; index < coursesData.length; index++) {
    if(coursesData[index].code.toString().includes(searchCode.value))
        dataApper.push(coursesData[index]);
}
displayData(dataApper);
})
searchName.addEventListener('keyup',function(){
let dataApper=[];
for (let index = 0; index < coursesData.length; index++) {
    if(coursesData[index].name.includes(searchName.value.toLowerCase()))
        dataApper.push(coursesData[index]);
}
displayData(dataApper);
})
searchInstructor.addEventListener('keyup',function(){
let dataApper=[];
for (let index = 0; index < coursesData.length; index++) {
    if(coursesData[index].instructor.toLowerCase().includes(searchInstructor.value.toLowerCase()))
        dataApper.push(coursesData[index]);
}
displayData(dataApper);
})
//------------------------------end search-----------------------------

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
    window.location = "coursesDeteils/"+code+'/'+name+'/'+Instructor+'/'+Description+'/'+Days+'/'+Prerequisites+'/'+Time+'/'+Room+'/'+Capacity;    
}
//------------------------------end details-----------------------------

//------------------------------add btn-----------------------------
function addCourse(courseId){
    window.location = "addCourse/"+String(courseId);    
}
//------------------------------end add btn-----------------------------

//------------------------------All btn-----------------------------
for (let index = 0; index < allBtn.length; index++) {
    allBtn[index].addEventListener('click',function () {
        displayData(coursesData);
    });
}
//------------------------------end All btn-----------------------------

//------------------------------calc suggested courses-----------------------------
async function calcSuggestedCourses(){
    let courseDontTake=[];
    let add=true;
    let idPrerequisites='';
    for (let index = 0; index < coursesData.length; index++) {
        for (let x = 0; x < regCoursesData.length; x++) {
            if(coursesData[index].id==regCoursesData[x].coursed){
                add=false;
            }
        }
        if(add){
            courseDontTake.push(coursesData[index]);
        }
        add=true;
    }
    for (let index = 0; index < courseDontTake.length; index++) {
        if(courseDontTake[index].prerequisites!=null){
            let a = 0;
            for (; a < coursesData.length; a++) {
                if(courseDontTake[index].prerequisites==coursesData[a].code)
                {
                    idPrerequisites=coursesData[a].id;
                    break;
                }
            }
            for (let z = 0; z < regCoursesData.length; z++) {
                if(regCoursesData[z].coursed==idPrerequisites)
                {
                    suggestedCourses.push(courseDontTake[index]);
                    break;
                }
            }
        }
        else{
            suggestedCourses.push(courseDontTake[index]);
        }
    }
}
//------------------------------end calc suggested courses-----------------------------


//------------------------------suggested btn-----------------------------
suggestedBtn.addEventListener('click',function(){
    displayData(suggestedCourses);
})
//------------------------------end suggested btn-----------------------------


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