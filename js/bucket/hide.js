var popupPin = document.querySelector('.popup-check-pin-hide-buckets form');

popupPin.addEventListener('submit', function (e) {
    e.preventDefault();
    let popupPinInput = document.querySelector('.popup-check-pin-hide-buckets #pin-hide-field-bucket');
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                let bouquetId = bucketSelected.getAttribute('id')
                const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                if (result[0].hidden) {
                    result[0].hidden = 0
                } else {
                    result[0].hidden = 1
                    bucketSelected.remove()
                }
                save(data)
                let bucketList = document.querySelectorAll('.list-bouquet .bouquet');
                bucketList[0].classList.add('selected');
                popupPinInput.value = "";
            }
        }
    })
})

