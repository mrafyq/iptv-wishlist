var popupPin = document.querySelector('.popup-check-pin');

function PINBucket() {
    let PINField = document.querySelector('#pin-field');
    popupAction = true;
    popupPin.classList.add('active');
    PINField.focus()
    let popupPinForm = document.querySelector('.popup-check-pin form')
    popupPinForm.addEventListener('submit', function (e) {
        e.preventDefault();
        read().then(data => {
            if (data) {
                if (PINField.value === data.pin) {
                    let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                    let bouquetId = bucketSelected.getAttribute('id')
                    const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                    let pin;
                    if (parseInt(bucketSelected.getAttribute('data-pin'))) {
                        pin = 0
                        result[0].pin = pin
                        bucketSelected.setAttribute('data-pin', pin)
                        bucketSelected.querySelector('.icon-lock').remove()
                    } else {
                        pin = 1
                        result[0].pin = pin
                        const iconLock = document.createElement('i');
                        iconLock.setAttribute('class', 'icon-lock');
                        bucketSelected.setAttribute('data-pin', pin)
                        bucketSelected.appendChild(iconLock);
                    }
                    save(data)
                    popupAction = false;
                    popupPin.classList.remove('active');
                    PINField.value = "";
                }
            }
        })
    })
}

