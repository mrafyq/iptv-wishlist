var hideBucketBtn = document.querySelector('.bucket-action-hide');

hideBucketBtn.addEventListener('click', HideBucket)

function HideBucket() {
    let PINField = document.querySelector('#pin-field');
    popupAction = true;
    popupPin.classList.add('active');
    PINField.focus()
    let confirmPin = document.querySelector('.action-pin-ok')
    confirmPin.addEventListener('click', function (event) {
        read().then(data => {
            if (data) {
                if (PINField.value === data.pin) {
                    let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                    let bouquetId = bucketSelected.getAttribute('id')
                    const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                    if (result[0].hidden) {
                        result[0].hidden = 0
                    } else {
                        result[0].hidden = 1
                    }
                    save(data)
                    bucketSelected.remove();
                    popupAction = false;
                    popupPin.classList.remove('active');
                    PINField.value = "";
                }
            }
        })
    })
}
