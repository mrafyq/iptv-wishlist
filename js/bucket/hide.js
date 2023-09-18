var popupPinHideBucket = document.querySelector('.popup-check-pin-hide-buckets');
var popupPinHideBucketForm = document.querySelector('.popup-check-pin-hide-buckets form');

popupPinHideBucketForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let popupPinInput = document.querySelector('.popup-check-pin-hide-buckets #pin-hide-field-bucket');
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                let bouquetId = bucketSelected.getAttribute('data-id')
                const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                console.log(result)
                if (result[0].hidden) {
                    result[0].hidden = 0
                } else {
                    result[0].hidden = 1
                    bucketSelected.remove()
                }
                save(data)
                let bucketList = document.querySelectorAll('.list-bouquet .bouquet');
                bucketList[0].classList.add('selected');
            } else {
                popupError = true
            }
            popupPinInput.value = "";
            adaptPopup(popupPinHideBucket);
        }
    })
})

