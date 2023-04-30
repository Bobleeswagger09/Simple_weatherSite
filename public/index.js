
//This is an api key stored in a constant variable
const apikey="5bd18ffb1ab7659ae4d4446979fbd51b";


//This block attaches an event listener to the window object, which waits for the page to fully load before executing the
 //code inside the arrow function. This is done to ensure that the code inside the function only runs once the page has 
 //fully loaded.*/
window.addEventListener("load",()=>{
    //checks if the users browser support geolocation api
    if (navigator.geolocation){
        //uses the getcurrentposition method of the geolocation api to get the current position of the user
        navigator.geolocation.getCurrentPosition((position)=>{
            
            // block 1 & 2 def a var called long and lat and assigns them to the long and lat value
            //obtained from the position object
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            //a url string 4 d openWeather Api using the lat,lon, & api key
            //which is used later to fetch weather data.
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            
            //uses the fetch(wht u want to fetch) mth to make a 
            //request 2 d Owm api using the url specified as augment
            //which den passes d response to an arrow func as a param names `res`. 
            fetch(url).then((res)=>{
                //return response data in json format 
                return res.json();
             //a promise is an object that represents a value or that may not yet be available yet
             //but will be resolved at some point in the future
            //the res is passed to the next then box as a param called data

            }).then((data)=>{
                console.log(data);
                //logs current time to the console
                console.log(new Date().getTime())
                //creates a new date using the dt property of the data object
                var dat= new Date(data.dt)
                //tolocaleString() is a method of the `Date` object that returns a string representing
                //the date and time in a format that is appropriate for a specific area

                console.log(dat.toLocaleString("en-US",'Africa/Lagos'))
                //logs new date in mins
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})

// The code below lsitens for the
document.getElementById("search").addEventListener("click", ()=>{
    //retrieves the value of an with an id of input and stores it in the place var
    let place = document.getElementById('input').value;
    //the url is constructed using the place var and the apikey
    //which is used to query the open weather map Api for data of the specific location
    let urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;
    //fetch is used to make a get req to the api endpoint
    //the .then() is called on the return response object to parse the json data from the response
    fetch(urlsearch).then((res)=>{
        //used 
        return (res.json())
    //parsed data passed to another .then() as an augment 
    //where its logged to the console and passsed to the weather report function   
    }).then((data)=>{
        console.log(data)
        weatherReport(data)
    //if there is an error during the process the method is called
    //with an error argment and an error message is logged
    //using the console.error
    }).catch(error=>{
        console.error("Error:", error);
    });

});

//
function searchByCity(){
    var place = document.getElementById('input').value;
    var url= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;
    fetch(url).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
}


function weatherReport(data){

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)

        console.log(data);
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
       ;
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description)
        
        let icon1= data.weather[0].icon;
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl
    })

}

function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString("en-US",'Africa/Lagos')).replace(':00',''))

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString("en-US",'Africa/Lagos')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML=''
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let description= document.createElement('p');
        description.setAttribute('class','desc')
        description.innerText= forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div)
    };
};
