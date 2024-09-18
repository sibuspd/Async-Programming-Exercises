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

    updateExecution();
}

async function updateExecution(){

    try{ // When the promise from fetch() is resolved
        const controller = new AbortController(); // For graceful handling I have used Web API.
        
        const timer = setTimeout(()=>{
            controller.abort();
            console.log("Time exceeded 5 seconds");
        },5000); // Setting the maximum loading time to 5 seconds.
        
        const data = await fetch('https://dummyjson.com/posts',{signal: controller.signal}); // Returns the response object directly instead of promise object after resolving the promise internally.
        
        clearTimeout(timer); // the Timer will be cleared out if compiler reaches here within 5 seconds.

        if(!data.ok) // Returns a Boolean
        throw new Error("Failure in HTTP response or invalid URL "); // Indicates HTTP status code not in 200-299 range
        else console.log('HTTP response was successful.');
        
        const json_data = await data.json();
        postsData = json_data.posts;

        const dataContainer = document.querySelector('.mainDisplay');
        dataContainer.innerHTML = postsData.map(post => // Scanning through each post
            `<div class="post">
                <span><strong>Post No.${post.id}---</strong> </span><span><i>Genre</i>- ${post.tags}</span>
                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <h5>Total Views - ${post.views}</h5>
            </div>`
            );
    }
    
    catch(err){ // Incase the promise from fetch() is rejected
        const dataContainer = document.querySelector('.mainDisplay');
        
        if(err.name === 'AbortError'){ // Only in case the time has exceeded.
        dataContainer.innerHTML = `<h3 id='message'>Request timed out. Please try again later.</h3>`;    
        }
        else{
            dataContainer.innerHTML = `<h3 id='message'>${err.message}</h3>`;
            console.log(err.message); // Other errors like Network issues.
        }
    }
}


