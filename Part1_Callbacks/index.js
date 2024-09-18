const delayButton = document.getElementById('delayButton');
delayButton.addEventListener('click',delayExecution);

const body = document.getElementsByTagName('body')[0]; // Returns the first element in the collection

function delayExecution(){
    setTimeout(displayText,5000); // 5000 ms delay
}


function displayText(){
    let postsData;
    const promiseObject = fetch('https://dummyjson.com/posts');
    promiseObject.then(res=> res.json()).then(result => {
        postsData = result.posts;
        // console.log(postsData); // postsData is not an Array of Objects

        const mainDisplay = document.createElement('div'); // Div element node created
        mainDisplay.classList.add('mainDisplay'); // ClassName assigned to the Node
        mainDisplay.innerHTML = `<h3 id='message'>Callback executed after 5 seconds.</h3>
                                <div class='data-container'></div>`;
                                
        body.appendChild(mainDisplay); // div element appended inside Body
        // console.log(body);
                                
        const dataContainer = document.querySelector('.data-container');
        dataContainer.innerHTML = postsData.map(post =>
            `<div class="post">
                <span><strong>Post No.${post.id}---</strong> </span><span><i>Genre</i>- ${post.tags}</span>
                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <h5>Total Views - ${post.views}</h5>
            </div>`
        ); // Returns a string each time
        console.log(dataContainer);
    }).catch(err => console.log(err));    
}

