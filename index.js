let fetchDataForSort;
let getDataLimit;
const fetchData = (dataLimit) => {
    loadSpinner(true)
    const url = `https://openapi.programming-hero.com/api/ai/tools`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayData(data.data.tools, dataLimit) 
            fetchDataForSort = data.data.tools;
            getDataLimit = dataLimit
        })
        .catch(error => console.log(error))
}
const sortData = ()=>{
    const date = fetchDataForSort.sort((a, b) => new Date(b.published_in) - new Date(a.published_in))
    if(getDataLimit === 6){
        displayData(date,6)
    } else{
        displayData(date,12)
    }
}
document.getElementById('sortByDate').addEventListener('click', function () {
    sortData()
    
})
document.getElementById('see-more').addEventListener('click', function () {
    fetchData(12)
});
const displayData = (data, dataLimit) => {
    // console.log(data);
    const cardContainer = document.getElementById('card-container')
    const showAll = document.getElementById('see-more')

    // show more button
    if (data.length > dataLimit) {
        data = data.slice(0, dataLimit)
        showAll.classList.remove('d-none')
    } else {
        showAll.classList.add('d-none')
    }

    cardContainer.innerHTML = '';
    data.forEach(singleData => {
        // getting all feature list and set the value
        const featureList = singleData.features.map((feature) => '<li>' + feature + '</li>').join('');

        // console.log(singleData.id)
        // fetchId(singleData.id)
        cardContainer.innerHTML += `
        <div class="col">
                  <div class="card h-100 p-3">
                    <img class="img-fluid rounded-4" src=${singleData.image} class="card-img-top" alt="">
                    <div class="card-body">
                      <h5 class="card-title">Features</h5>
                      <ol class="ps-3">
                      ${featureList}
                      </ol>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <div>
                    <h5 class="card-title">${singleData.name}</h5>
                    <small class="text-muted"><i class="fa-regular fa-calendar-days"></i> <span id="date">${singleData.published_in}</span></small>
                    </div>
                    <button onclick="fetchId('${singleData.id}')" id="api-details" class="btn" data-bs-toggle="modal"
                    data-bs-target="#apidetailsModal"><i class="fa-solid fa-arrow-right text-danger"></i></button>
                    </div>
                  </div>
                </div>
        `
    });
    loadSpinner(false)
}

//id
const fetchId = (id) => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => displayIdData(data.data))
        .catch(error => console.log(error))
}
const displayIdData = (data) => {

    // console.log(data.accuracy.score);

    // accuracy part
    const accuracy = data.accuracy.score ? 100 * data.accuracy.score : null
    const accuracyDiv = document.getElementById('accuracy-div')
    if (accuracy === null) {
        accuracyDiv.classList.add('d-none')
    } else {
        accuracyDiv.classList.remove('d-none')
        document.getElementById('accuracy').innerText = accuracy
    }

    // api input output result
    const example = data.input_output_examples ? data.input_output_examples.find((qna) => qna) : null;

    // api modal settings
    const modalImg = document.getElementById('modal-image')
    modalImg.innerHTML = ''
    // modal image
    const image = document.createElement('img')
    image.classList.add('card-img-top')
    image.src = data.image_link[0]
    modalImg.appendChild(image)
    // api description
    document.getElementById('api-description').innerText = data.description

    // api price
    document.getElementById('pricing').innerHTML = `
    <div class="col text-success">${Array.isArray(data.pricing)
            ? data.pricing[0].price + '</br>' + data.pricing[0].plan
            : data.pricing = 'Free Of Cost'}</div>
    <div class="col text-warning">${Array.isArray(data.pricing)
            ? data.pricing[1].price + '</br>' + data.pricing[1].plan
            : data.pricing = 'Free Of Cost'}</div>
    <div class="col text-danger">${Array.isArray(data.pricing)
            ? data.pricing[2].price + '</br>' + data.pricing[2].plan
            : data.pricing = 'Free Of Cost'}</div>
    `
    // api input output result set
    document.getElementById('input-example').innerText = example && example.input ? example.input : 'Can you give any example?'
    document.getElementById('output-example').innerText = example && example.output ? example.output : 'No! Not Yet! Take a break!!!'

    // in modal api features setting
    const inModalApiFeatureList = Object.values(data.features).map(feature => '<li>' + feature.feature_name + '</li>').join('')
    document.getElementById('Features-list').innerHTML = inModalApiFeatureList

    // in modal api Integrations setting
    const inModalApiIntegrationsList = data.integrations ? data.integrations.map(integration => '<li>' + integration + '</li>') : null
    document.getElementById('Integrations-list').innerHTML = inModalApiIntegrationsList ? inModalApiIntegrationsList.join('') : 'No Data Found'
}
const loadSpinner = isLoading => {
    const loaderSection = document.getElementById('loader')
    if (isLoading) {
        loaderSection.classList.remove('d-none')
    } else {
        loaderSection.classList.add('d-none')
    }
}

fetchData(6)