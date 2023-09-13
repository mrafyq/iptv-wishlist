var popupPin = document.querySelector('.popup-check-pin');

function HideBucket() {
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
                    let bucketList = document.querySelectorAll('.list-bouquet .bouquet');
                    let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                    let bouquetId = bucketSelected.getAttribute('id')
                    const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                    if (result[0].hidden) {
                        result[0].hidden = 0
                    } else {
                        result[0].hidden = 1
                    }
                    save(data)
                    bucketList[0].classList.add('selected');
                    bucketSelected.remove();
                    popupAction = false;
                    PINField.value = "";
                    popupPin.classList.remove('active');
                }
            }
        })
    })
}

