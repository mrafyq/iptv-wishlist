const popupPinHideBucket = document.querySelector('.popup-check-pin-hide-buckets');
const popupPinHideBucketForm = document.querySelector('.popup-check-pin-hide-buckets form');
const popupPinHideBucketFormInput = document.querySelector('.popup-check-pin-hide-buckets form #pin-hide-field-bucket');

popupPinHideBucketForm.addEventListener('submit', function (e) {
    e.preventDefault();
    read().then(data => {
        if (data) {
            if (popupPinHideBucketFormInput.value === data.pin) {
                let bucketSelected = document.querySelector('.list-bucket .bucket.selected');
                let bucketId = bucketSelected.getAttribute('data-id')
                const result = data.buckets.filter(bucket => bucket.bucket_id == bucketId);
                console.log(result)
                if (result[0].hidden) {
                    result[0].hidden = 0
                } else {
                    result[0].hidden = 1
                    bucketSelected.remove()
                }
                save(data)
                let bucketList = document.querySelectorAll('.list-bucket .bucket');
                bucketList[0].classList.add('selected');
            } else {
                popupError = true
            }
            popupPinHideBucketFormInput.value = "";
            adaptPopup(popupPinHideBucket);
        }
    })
})

