const listBucket = document.getElementById('sidebar-bucket__list');

read().then(data => {
    if (data) {
        fetchBuckets(data.buckets);
    }
});

function save(data) {
    // WEB
    console.log("save data")
    console.log(data)
    // ANDROID
    // App.writeToFile("db.json", JSON.stringify(data));
}


async function read() {
    // WEB
    let response = await fetch('data/db.json')
    return await response.json();
    // ANDROID
    // let str = App.readFromFile("db.json");
    // return JSON.parse(str);
}

function fetchBuckets(buckets) {
    let index = 0;
    (buckets).forEach((bucket) => {
        if (bucket.hidden) {
            const li = document.createElement('li');
            li.setAttribute('id', 'bucket-' + bucket.bucket_id);
            li.setAttribute('data-id', bucket.bucket_id);
            li.setAttribute('data-name', bucket.bucket_name);
            li.setAttribute('data-pin', bucket.pin);
            if (index === 0) {
                li.setAttribute('class', 'bucket selected');

            } else {
                li.setAttribute('class', 'bucket');
            }
            li.innerHTML = bucket.bucket_name;
            if (bucket.pin) {
                const iconLock = document.createElement('i');
                iconLock.setAttribute('class', 'icon-lock');
                li.appendChild(iconLock);
            }
            listBucket.appendChild(li);
            index++
        }
    });
}

let currentList = [];
const buckets = document.getElementsByClassName('bucket');

function getCurrentIndex() {
    for (let i = 0; i < currentList.length; i++) {
        if (currentList[i].classList.contains('selected')) {
            return i;
        }
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

document.addEventListener('keyup', function (e) {
    const key = e.key;
    console.log("key = " + key);

    currentList = buckets;
    let current_index = getCurrentIndex();

    switch (key) {

        case 'Enter':
            if (currentList[current_index].classList.contains('checked')) {
                console.log("Show popup")
            }
            break;
        case 'Escape':
            break;
        case 'ArrowUp':
            currentList[current_index].classList.remove('selected');
            current_index = mod(current_index - 1, currentList.length);
            currentList[current_index].classList.add('selected');
            changeLabelAction(currentList[current_index])
            break;
        case 'ArrowDown':
            currentList[current_index].classList.remove('selected');
            current_index = mod(current_index + 1, currentList.length);
            currentList[current_index].classList.add('selected');
            changeLabelAction(currentList[current_index])
            break;
        case '1':
            if (!currentList[current_index].classList.contains('checked')) {
                addElementToSelect(currentList[current_index]);
            } else {
                currentList[current_index].classList.remove('checked')
                currentList[current_index].innerHTML = currentList[current_index].getAttribute('data-name')
            }
            changeLabelAction(currentList[current_index])

            break;
    }

})

function addElementToSelect(elementToSelect) {
    elementToSelect.classList.add("checked")
    const iconMove = document.createElement('i');
    iconMove.setAttribute('class', 'icon-check');
    elementToSelect.appendChild(iconMove)
}

function changeLabelAction(element) {
    let label = 'Sélectionner'
    if (element.classList.contains('checked')) {
        label = 'Désélectionner'
    }
    document.querySelector('.bucket-action-select').innerHTML = '<div class="dot blue"> </div> ' +
        label + ' (1)' +
        '</div>'
}