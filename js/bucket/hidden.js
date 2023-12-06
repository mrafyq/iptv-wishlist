const listBucket = document.getElementById('sidebar-bucket__list');
const popup = document.querySelector('.popup-enable-buckets');
let popupAction = false;
const form = document.querySelector('form[name="enable-buckets"]')

read().then(data => {
    if (data) {
        fetchBuckets(data.buckets);
    }
});

function fetchBuckets(buckets) {
    listBucket.innerHTML = '';

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
                changeLabelAction(li)
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
            if (popupAction === true) {
                let popupBtnActive = document.querySelector('.popup.active form button[class~="active"]');
                popupBtnActive.click();
            } else if (currentList[current_index].classList.contains('checked')) {
                popup.classList.add('active');
                popup.style.display = 'flex'
                popupAction = true
            }
            break;
        case 'Escape':
            break;
        case 'ArrowUp':
            currentList[current_index].classList.remove('selected');
            current_index = mod(current_index - 1, currentList.length);
            currentList[current_index].classList.add('selected');
            changeLabelAction(currentList[current_index])
            makeActiveElementOnMiddleOfScreen(currentList[current_index]);
            break;
        case 'ArrowDown':
            currentList[current_index].classList.remove('selected');
            current_index = mod(current_index + 1, currentList.length);
            currentList[current_index].classList.add('selected');
            changeLabelAction(currentList[current_index])
            makeActiveElementOnMiddleOfScreen(currentList[current_index]);
            break;
        case 'ArrowLeft':
            if (popupAction) {
                switchPopupActiveYesNo()
            }
            break;
        case 'ArrowRight':
            if (popupAction) {
                switchPopupActiveYesNo()
            }
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
    const svgCheckIcon = `
        <svg class="checkbox-checked" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
        </svg>
    `;
    iconMove.innerHTML = svgCheckIcon;
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

function switchPopupActiveYesNo() {
    let popupButtons = document.querySelectorAll('.popup.active form button');
    let popupBtnActive = document.querySelector('.popup.active form button[class~="active"]');
    popupButtons.forEach(button => {
        if (button === popupBtnActive) {
            button.classList.remove('active')
        } else {
            button.classList.add('active')
        }
    })
}

let popupCloseBtn = document.querySelector('.popup .btn-cancel');
popupCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    popup.classList.remove('active');
    popup.style.display = 'none'
    popupAction = false;
});

form.addEventListener('submit', event => {
    event.preventDefault()
    let elementsToEnable = document.querySelectorAll('li.bucket.checked')
    if (elementsToEnable.length) {
        read().then(data => {
            if (data) {
                for (let element of elementsToEnable) {
                    const result = data.buckets.filter(bucket => bucket.bucket_id == parseInt(element.getAttribute('data-id')));
                    if (result.length) {
                        result[0].hidden = 0;
                    }
                }
                save(data)
                popup.classList.remove('active')
                popup.style.display = 'none'
                popupAction = false
                fetchBuckets(data.buckets)
            }
        })
    }
})

const makeActiveElementOnMiddleOfScreen = (selector) => {
    selector.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    });
};