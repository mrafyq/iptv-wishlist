var PinBucketBtn = document.querySelector('.bucket-action-pin');

PinBucketBtn.addEventListener('click', PINBucket)

function PINBucket() {
    let PINField = document.querySelector('#pin-field');
    popupAction = true;
    popupPin.classList.add('active');
    PINField.focus()
    let confirmPin = document.querySelector('.action-pin-ok')
    confirmPin.addEventListener('click', function (event) {
        fetch('data/db.json')
            .then(res => res.json())
            .then(data =>
                {
                    if (PINField.value === data.pin) {
                        let bucketSelected = document.querySelector('.list-bouquet .bouquet.selected');
                        let bouquetId = bucketSelected.getAttribute('id')
                        const result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                        if (result[0].pin) {
                            result[0].pin = 0
                            bucketSelected.querySelector('.icon-lock').remove()
                        } else {
                            result[0].pin = 1
                            const iconLock = document.createElement('i');
                            iconLock.setAttribute('class', 'icon-lock');
                            bucketSelected.appendChild(iconLock);
                        }
                        console.log(data.bouquets);
                        popupAction = false;
                        popupPin.classList.remove('active');
                        PINField.value = "";
                    }
                }
            )
            .catch(err => console.log(err));
    })
}

