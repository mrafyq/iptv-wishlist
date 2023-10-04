let searchInput = document.getElementById('search');

searchInput.addEventListener('keyup', function (e) {
    let filter = searchInput.value.toLowerCase();
    for (const element of channels) {
        let textValue = element.textContent || element.innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    }
});