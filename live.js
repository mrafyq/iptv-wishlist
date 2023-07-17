const fs = require('fs');

const result = fs.readFileSync('data/db.json', {
    encoding: 'utf-8',
});
console.log(result);

var listSelected = 'tabs';
var tabs = document.getElementsByClassName('tab');
var bouquets = document.getElementsByClassName('bouquet');
var favoris = document.getElementsByClassName('favoris');
var channels = document.getElementsByClassName('channel');
var tab_btns;


document.addEventListener('keydown', function (e) {

    var key = event.key;

    var listChannels = document.getElementById('list-channels');
    console.log(listChannels)

    if (listSelected === 'tabs') {
        tab_btns = tabs;
    } else if (listSelected === 'bouquets') {
        tab_btns = bouquets;
    } else if (listSelected === 'favoris') {
        tab_btns = favoris;
    } else if (listSelected === 'channels') {
        tab_btns = channels;
    }

    var current_index;
    for (var i = 0; i < tab_btns.length; i++) {
        if (tab_btns[i].classList.contains('selected')) {
            current_index = i;
        }
    }

    console.log('current index = ' + current_index)

    switch (key) {
        case 'ArrowLeft':
            if (listSelected === 'bouquets' || listSelected === 'favoris') {
                if (listSelected === 'bouquets') {
                    // remove class selected from bouquet list
                    for (var k = 0; k < bouquets.length; k++) {
                        bouquets[k].classList.remove('selected')
                    }
                } else {
                    document.getElementById('wishlist-buttons').style.display = 'none';
                    // remove class selected from favoris list
                    for (var l = 0; l < favoris.length; l++) {
                        favoris[l].classList.remove('selected')
                    }
                }
                listSelected = 'tabs';
                tab_btns = tabs;
                for (var j = 0; j < tab_btns.length; j++) {
                    if (tab_btns[j].classList.contains('active')) {
                        current_index = j;
                        tab_btns[j].classList.remove('active')
                        tab_btns[j].classList.add('selected')
                    }
                }
            } else if (listSelected === 'channels') {
                listSelected = listChannels.getAttribute('data-attr-back-list');
                if (listSelected === 'bouquets') {
                    tab_btns = bouquets;
                } else {
                    tab_btns = favoris;
                }
                document.getElementById('sidebar').style.display = "";
            }
            break;
        case 'ArrowRight':
            if (listSelected === 'tabs') {
                if (tab_btns[current_index].getAttribute('data-list') === 'list-favoris') {
                    listSelected = 'favoris';
                    tab_btns[current_index].classList.remove('selected');
                    tab_btns[current_index].classList.add('active');
                    tab_btns = favoris;
                    document.getElementById('wishlist-buttons').style.display = 'flex';
                } else {
                    listSelected = 'bouquets';
                    tab_btns[current_index].classList.remove('selected');
                    tab_btns[current_index].classList.add('active');
                    tab_btns = bouquets;
                    document.getElementById('wishlist-buttons').style.display = 'none';
                }
                current_index = 0;
                tab_btns[current_index].classList.add('selected');
            } else if (listSelected === 'bouquets' || listSelected === 'favoris') {
                listChannels.setAttribute('data-attr-back-list', listSelected)
                listChannels.setAttribute('data-attr-back-list-index', current_index)
                listChannels.innerHTML = '';
                if (listSelected === 'bouquets') {
                    // @TODO fetch channels bouquet
                } else {
                    let favorisId = tab_btns[current_index].getAttribute('id')
                    fetch('data/db.json')
                        .then(res => res.json())
                        .then(data =>
                            {
                                let result = data.favoris.filter(favoris => favoris.favori_id == favorisId);
                                console.log(result);
                                (result[0].channels).forEach((element, index) => {
                                    const li = document.createElement('li');
                                    li.setAttribute('data-attr-id', element.channel_id);
                                    li.setAttribute('data-attr-name', element.channel_name);
                                    if (index == 0) {
                                        li.setAttribute('class', 'channel selected');
                                    } else {
                                        li.setAttribute('class', 'channel');
                                    }
                                    li.innerHTML = element.channel_name;
                                    listChannels0.appendChild(li);
                                });
                            }
                        )
                        .catch(err => console.log(err));
                }
                listSelected = 'channels';
                document.getElementById('sidebar').style.display = 'none';
                tab_btns = channels;
            }

            console.log(tab_btns)
            break;
        case "ArrowUp":
            tab_btns[current_index].classList.remove('selected');
            if (listSelected === 'tabs') {
                getItem(tab_btns[current_index], 'none');
            }
            current_index = mod(current_index - 1, tab_btns.length);
            tab_btns[current_index].classList.add('selected');
            if (listSelected === 'tabs') {
                getItem(tab_btns[current_index], 'block');
            }
            break;
        case 'ArrowDown':
            tab_btns[current_index].classList.remove('selected');
            console.log(listSelected)
            if (listSelected === 'tabs') {
                getItem(tab_btns[current_index], 'none');
            }
            current_index = mod(current_index + 1, tab_btns.length);
            tab_btns[current_index].classList.add('selected');
            if (listSelected === 'tabs') {
                getItem(tab_btns[current_index], 'block');
            }
            break;
    }

});

var buttonRenameFavoris = document.querySelector('.action-rename');
var buttonRenameCancel = document.querySelector('.action-cancel');
var popupRename = document.querySelector('.popup.popup-rename');
var buttonRenameSave = document.querySelector('.action-rename-save');
var inputRename = document.querySelector('.popup #rename');



buttonRenameFavoris.addEventListener('click', (event) => {
    var favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    inputRename.value = favorisSelected.textContent
    popupRename.style.display = 'flex';

})

buttonRenameCancel.addEventListener('click', (event) => {
    popupRename.style.display = 'none';
})

buttonRenameSave.addEventListener('click', (event) => {
    console.log(inputRename.value)
    var favorisSelected = document.querySelector('.list-favoris .favoris.selected');
    let favorisId = favorisSelected.getAttribute('id')

    fetch('data/db.json')
        .then(res => res.json())
        .then(data =>
            {
                (data.favoris).forEach((element) => {
                    if (element.favori_id == favorisId) {
                        element.favori_name = inputRename.value
                    }
                });

                console.log(data.favoris)
                fs.writeFileSync("./config.json", JSON.stringify(data), err => {
                    if (err) console.log("Error writing file:", err);
                });
            }
        )
        .catch(err => console.log(err));
})


function mod(n, m) {
    return ((n % m) + m) % m;
}

function getItem(selector, display) {
    console.log(selector)
    document.querySelector('.' + selector.getAttribute('data-list')).style.display = display;
}
