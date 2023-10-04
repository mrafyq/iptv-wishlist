const popupCheckPinBuckets = document.querySelector('.popup-check-pin-buckets');
const popupCheckPinBucketsForm = document.querySelector('.popup-check-pin-buckets form');

popupCheckPinBucketsForm.addEventListener('submit', function (e) {
    console.log('submit from pin buckets!')
    e.preventDefault();
    let popupPinInput = document.querySelector('.popup-check-pin-buckets #pin-field-bucket');
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                let bouquetId = bucketSelected.getAttribute('data-id')
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
            } else {
                popupError = true
            }
            popupPinInput.value = "";
            adaptPopup(popupCheckPinBuckets);
        }
    });
});

