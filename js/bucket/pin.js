const popupCheckPinBuckets = document.querySelector('.popup-check-pin-buckets');
const popupCheckPinBucketsForm = document.querySelector('.popup-check-pin-buckets form');
const bucketHideButton = document.querySelector('.bucket-action-pin')

bucketHideButton.addEventListener('click', function () {
    popupAction = true;
    let popupCheckPinBucket = document.querySelector('.popup-check-pin-buckets');
    let popupPinInput = document.querySelector('.popup-check-pin-buckets #pin-field-bucket');
    popupCheckPinBucket.classList.add('active');
    popupPinInput.focus();
})

popupCheckPinBucketsForm.addEventListener('submit', function (e) {
    console.log('submit from pin buckets!')
    e.preventDefault();
    let popupPinInput = document.querySelector('.popup-check-pin-buckets #pin-field-bucket');
    read().then(data => {
        if (data) {
            if (popupPinInput.value === data.pin) {
                let bucketSelected = document.querySelector('.list-bucket .bucket.selected');
                let bucketId = bucketSelected.getAttribute('data-id')
                const result = data.buckets.filter(bucket => bucket.bucket_id == bucketId);
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

