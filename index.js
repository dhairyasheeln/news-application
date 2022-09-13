const url='https://api.spaceflightnewsapi.net/v3/articles?_limit=30';
const select=document.getElementById('news');

let root=document.querySelector('.parent');

let main=document.querySelector('.mainSection');
let error=document.querySelector('.error');

console.log(main,error);

let allNews=[];

function handleSpiner(status=false){
    if(status){
        root.innerHTML=`<div class="spinner"><div class="donut"></div></div>`;
    }
}

function handleError(message='Something went Wrong'){
    main.style.display='none';
    error.style.display='block';
    error.innerText=message;
}




select.addEventListener('change',handleSelect);


function init(){

    handleSpiner(true);
    
    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=30')
                .then((res)=>{
                    if(!res.ok){
                        throw new Error('Response not okay!!!:Status Code:'+res.status);
                    }
                    return res.json();
                })
                .then(res=>{

                    handleSpiner();

                    allNews=res;
                    createUI(res);
                    let allSources=Array.from(new Set(res.map((n)=>n.newsSite))); 
                    displayOptions(allSources);
                    
                })
                .catch(error=>handleError(error)); 
}


function displayOptions(options){
    if(Array.isArray(options)){
        options.forEach(source=>{
            let option=document.createElement('option');
            option.innerText=source;
            option.value=source;
            select.append(option);
        })
    }
}


function handleSelect(event){ 
    let filteredNews=[];
    if(select.value ==='source'){
        filteredNews=allNews;
    }
    else{
        filteredNews=allNews.filter(news=>news.newsSite===select.value);
    }
    createUI(filteredNews);
}



function createUI(data){
    root.innerHTML="";
    
    data.forEach(element => {


        let li=document.createElement('li');

        let divImg=document.createElement('div');
        divImg.classList.add('img-box');

        let image=document.createElement('img');
        image.classList.add('newsImage');
        image.src=element.imageUrl;
        image.alt=element.title;
        divImg.append(image);

        let div=document.createElement('div');
        div.classList.add('newsInfo');

        let span=document.createElement('span');
        span.classList.add('newsSource');
        span.innerText=element.newsSite;

        let h3=document.createElement('h3');
        h3.classList.add('newsTitle');
        h3.innerText=element.title;

        let a=document.createElement('a');
        a.classList.add('newsReadMore');
        a.innerText='Read More';
        a.href=element.url;
        a.target="_blank";

        div.append(span,h3,a);
        li.append(divImg,div);
        root.append(li);

    });
}


if(navigator.onLine){
    init();
}
else{
    handleError('Check your Internet connection');
}


