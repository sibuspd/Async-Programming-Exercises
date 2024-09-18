const delayButton = document.getElementById('delayButton');
delayButton.addEventListener('click',displayExecution);

const body = document.getElementsByTagName('body')[0]; // Returns the first element in the collection

let postsData; 

function displayExecution(){

    const mainDisplay = document.createElement('div'); // Div element node created
    mainDisplay.classList.add('mainDisplay'); // ClassName assigned to the Node
    mainDisplay.innerHTML = 
        `<span class="loader"></span>
        <h3 id='message'>Loading.......</h3>`;

    body.appendChild(mainDisplay); // div element appended inside Body


    //------------------Defining the Promise Object for fetching data----------
    const promiseObject = new Promise((resolve,reject)=>{
        const data = fetch('https://dummyjson.com/posts'); // Returns a promise object
        data.then(res =>{
        if(!res.ok) // Returns a Boolean
            throw new Error("Failure in HTTP response or URL invalid "); // Indicates HTTP status code not in 200-299 range
            else {
                console.log("HTTP response was successful");
                return res.json(); // returns another promise object
            }
        }).catch(err => console.log(err))
        .then(json_data => {        // res.json() itself returns a promise to be handled
            console.log("JSON processing done."); // Indicates JSON content received
            resolve(json_data);
        }).catch(err => {
            reject(`Failure in JSON conversion - ${err}`);
        });
    });

    // ---------------- Defining another Promise with 5 seconds timer to race against the Main promise
    const timeOut = new Promise((_,reject)=>{
        setTimeout(()=>{
            reject(new Error("Operation timed out.")); // Will get executed after 5 seconds regardless whether the fetch Promise resolves or not.
        },5000); // Setting the timer to 5 seconds for fetch promise to race against.
    })
    
// The following section of code will only be processed after the promise has been resolved or rejected.
    Promise.race([promiseObject, timeOut]) // Either promiseObject resolves within 5 seconds or timeOut resolves
    .then(json_data =>{
        postsData = json_data.posts;
     
        const dataContainer = document.querySelector('.mainDisplay');
        dataContainer.innerHTML = postsData.map(post => // Scanning through each post
            `<div class="post">
                <span><strong>Post No.${post.id}---</strong> </span><span><i>Genre</i>- ${post.tags}</span>
                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <h5>Total Views - ${post.views}</h5>
            </div>`
            ); // Returns a string each time
        }).catch(error => {
            const dataContainer = document.querySelector('.mainDisplay');
            dataContainer.innerHTML = `<h3 id='message'>${error.message}</h3>`;
            console.log(error.message); // Operation times out when timer is set to 100 milliseconds.
        });
} 


