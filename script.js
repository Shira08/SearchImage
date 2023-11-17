const accessKey = "D1HNeLYKVwABZM1v-VOEIi4LTO2xHW8wD4V8S1cSG14"

const formEl = document.querySelector("form")

const inputEl = document.getElementById("search-input")

const searchResults = document.querySelector(".search-results")

const showMore = document.getElementById("show-more-button")

const collectionsDiv = document.getElementById("collections");



let inputData = ""
let page = 1;


const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event
openModalBtn.addEventListener("click", openModal);

async function fetchCollections() {
    const url = `https://api.unsplash.com/collections?client_id=${accessKey}`;

    const response = await fetch(url);
    const collections = await response.json();

    collections.forEach(collection => {
        const collectionLink = document.createElement('a');
        collectionLink.href = "#";
        collectionLink.id = collection.id;
        collectionLink.classList.add("collection");
        collectionLink.textContent = collection.title;
        collectionLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetchImagesFromCollection(collection.id);
        });
        collectionsDiv.appendChild(collectionLink);
    });
}

async function fetchImagesFromCollection(collectionId) {
    const url = `https://api.unsplash.com/collections/${collectionId}/photos?client_id=${accessKey}`;

    const response = await fetch(url);
    const images = await response.json();

    // Clear the collectionsDiv and display images
    searchResults.innerHTML = ""

    images.map((result) =>{
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-result");
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;
        const imageLink = document.createElement('a');
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description;

        imageWrapper.appendChild(image)
        imageWrapper.appendChild(imageLink)
        searchResults.appendChild(imageWrapper)
    });
}

fetchCollections();



async function searchImages() {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url)
    const data = await response.json()

    const results = data.results

    if(page === 1)
    {
        searchResults.innerHTML = ""
    }
    results.map((result) =>{
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-result");
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;
        const imageLink = document.createElement('a');
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description;

        imageWrapper.appendChild(image)
        imageWrapper.appendChild(imageLink)
        searchResults.appendChild(imageWrapper)

        image.onclick = function() {
            const modal = document.getElementById("myModal");
            const modalImg = document.getElementById("img01");
            const captionText = document.getElementById("caption");
            const downloadLink = document.getElementById("download");
    
            modal.style.display = "block";
            modalImg.src = result.urls.full;
            captionText.innerHTML = result.alt_description;
            downloadLink.href = result.links.download;
        }
        const span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() { 
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
        }    
    });
    page++
    if(page > 1)
    {
        showMore.style.display = "block"
    }
   
}
formEl.addEventListener("submit", (event)=>{
event.preventDefault()
page= 1
searchImages()
})

showMore.addEventListener('click', ()=>{
    searchImages()
    })