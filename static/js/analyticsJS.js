//------------------------------define varible-----------------------------
let regCountData =[];
let regCount =[];
let coursesData =[];
let popularCourse= document.querySelector('.popularCourse');
let coursesDataTable =document.querySelector('.coursesDataTable');
let schedulesData =[];
//------------------------------end define varible-----------------------------

//------------------------------fetch data-----------------------------
async function getData(){
    data=await fetch("coursesData.json");
    return data.json();
    }
async function getRegCountData(){
    data=await fetch("regCount.json");
    return data.json();
    }
    async function getSchedulesData(){
        data=await fetch("schedulesData.json");
        return data.json();
        }
(async()=>{
    const arr= await getData();
    coursesData=arr.rows;
    const arr3=await getRegCountData();
    regCountData = arr3.regs;
    const arr2=await getSchedulesData();
    schedulesData = arr2.rows;
    await calcNumReg();
    await displayData();
    await getPopularCourse();
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
            courseName:coursesData[index].name,
            num:count
        }
        regCount.push(y);
        count=0;
    }
    console.log(regCount);
}
//------------------------------end calc-----------------------------

//------------------------------display data-----------------------------
async function displayData(){
let x=0;
let dataToTable = '';
for (let index = 0; index < coursesData.length; index++) {
    dataToTable=dataToTable+`
        <tr class="row">
                        <td class="col-2 needtowrap">${index+1}</td >
                        <td class="col-2 needtowrap">${coursesData[index].code}</td>
                        <td class="col-3 needtowrap">${coursesData[index].name}</td  >
                        <td class="col-2 needtowrap">${regCount[index].num}</td  >
                        <td class="col-3 needtowrap">
                            <div class="btn btn-outline-light" onclick='displayDetails(${index})'>Details</div>
                        </td>

        `;
        x=0;
}
coursesDataTable.innerHTML=dataToTable;
}
//------------------------------end display data-----------------------------

//------------------------------details-----------------------------
function displayDetails(index){
let x=0
$('.modal').css('display','block');
document.querySelector('.modal-title').innerHTML=coursesData[index].name;
document.querySelector('.modalCode').innerHTML=`code: ${coursesData[index].code}.`;
if(coursesData[index].description==null)
    document.querySelector('.modalDescription').innerHTML=`Description: No Description :( .`;
else
    document.querySelector('.modalDescription').innerHTML=`Description: ${coursesData[index].description}.`;
document.querySelector('.modalInstructor').innerHTML=`Instructor: ${coursesData[index].instructor}.`;
if(coursesData[index].prerequisites==null)
    document.querySelector('.modalPrerequisites').innerHTML=`Prerequisites: No Prerequisites :) .`;
else
    document.querySelector('.modalPrerequisites').innerHTML=`Prerequisites: ${coursesData[index].prerequisites}.`;
for (; x < schedulesData.length; x++) {
    if(coursesData[index].schedul==schedulesData[x].id)
        break;
}
document.querySelector('.modalDays').innerHTML=`Days: ${schedulesData[x].days}.`;
document.querySelector('.modalTime').innerHTML=`Time: ${schedulesData[x].startTime} - ${schedulesData[x].endTime}.`;
document.querySelector('.modalRoom').innerHTML=`Room: ${schedulesData[x].room}.`;
document.querySelector('.modalCapacity').innerHTML=`Capacity: ${regCount[index].num}/${coursesData[index].capacity}.`;

}
//------------------------------end details-----------------------------
async function getPopularCourse(){
    let popular=regCount[0];
    for (let index = 1; index < regCount.length; index++) {
        if(regCount[index].num>popular.num)
            popular=regCount[index];
    }
    popularCourse.innerHTML=popularCourse.innerHTML+`${popular.courseName}.`
}