var serachInput = document.getElementById('search');

serachInput.addEventListener('keyup', function (e) {
    var filter = serachInput.value.toLowerCase();
    for (var i = 0; i < channels.length; i++) {
        var textValue = channels[i].textContent || channels[i].innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            channels[i].style.display = '';
        } else {
            channels[i].style.display = 'none';
        }
    }
});