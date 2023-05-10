let newsData=[];
let newsContent =document.querySelector('.newsContent');

//------------------------------fetch data-----------------------------
async function getNewsData(){
    data=await fetch("newsData.json");
    return data.json();
    }
(async()=>{
    const arr= await getNewsData();
    newsData=arr.rows;
    console.log(newsData);
    await addNews();
})();
//------------------------------end fetch data-----------------------------

//------------------------------add news to page-----------------------------
async function addNews(){
    let addToPage='';
    for (let index = 0; index < newsData.length; index++) {
        addToPage=addToPage+`
            <div class="card my-2" id="myCard">
                <div class="card-body">
                    <h2 class="card-title">${newsData[index].title}</h2>
                    <span class="card-subtitle mb-2 text-muted">${newsData[index].timeAndDate}</span>
                    <p class="card-text">${newsData[index].info}.</p>
                </div>
            </div>
        `
    }
    newsContent.innerHTML=addToPage;
}
//------------------------------end news to page-----------------------------

