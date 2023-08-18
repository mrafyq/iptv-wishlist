var listSelected = 'tabs';
var tabs = document.getElementsByClassName('tab');
var bouquets = document.getElementsByClassName('bouquet');
var favoris = document.getElementsByClassName('favoris');
var channels = document.getElementsByClassName('channel');
var groupName = document.querySelector('.group-name');
var serachInput = document.getElementById('search');
var tab_btns;


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

document.addEventListener('keyup', function (e) {

    var key = event.key;
    console.log(key);

    var listChannels = document.getElementById('list-channels');
    // console.log(listChannels);

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
        case 'Enter':
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
                    let bouquetId = tab_btns[current_index].getAttribute('id');
                    let bouquetName = tab_btns[current_index].getAttribute('data-name');
                    groupName.innerHTML = bouquetName;
                    groupName.setAttribute('id', bouquetId);
                    fetch('data/db.json')
                        .then(res => res.json())
                        .then(data =>
                            {
                                let result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
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
                } else {
                    let favorisId = tab_btns[current_index].getAttribute('id');
                    let bouquetName = tab_btns[current_index].getAttribute('data-name');
                    
                    groupName.innerHTML = bouquetName;
                    groupName.setAttribute('id', favorisId);
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
                document.getElementById('sidebar').style.display = 'none';
                document.getElementById('right-buttons').style.display = 'flex';
                if (listSelected === 'favoris') {
                    document.querySelector('#right-buttons .remove-from-favoris').style.display = 'block';
                } else {
                    document.querySelector('#right-buttons .remove-from-favoris').style.display = 'none';
                }
                listSelected = 'channels';
                tab_btns = channels;
            }

            console.log(tab_btns)
            break;
        case 'Escape':
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
                document.getElementById('right-buttons').style.display = '';
            }
            break;
        case "ArrowUp":
            tab_btns[current_index].classList.remove('selected');
            if (listSelected === 'tabs') {
                getItem(tab_btns[current_index], 'none');
            }
            current_index = mod(current_index - 1, tab_btns.length);
            tab_btns[current_index].classList.add('selected');
            if (listSelected === 'tabs') {
                getItem(tab_btns[current_index], 'flex');
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
                getItem(tab_btns[current_index], 'flex');
            }
            break;
        case '1':
            if (listSelected === 'channels') {
                
                var favorisSelected = document.querySelector('.group-name');
                var favorisChannelSelected = document.querySelector('.list-channels .channel.selected');
                var popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
                var popupRemoveFromWishlistForm = document.getElementById('remove-from-wishlist-form');
                var popupRemoveFromWishlistTitle = document.querySelector('.popup-remove-from-wishlist .popup-title');
                var popupRemoveFromWishlistActionCancel = document.querySelector('.action-remove-from-wishlist-cancel');
                
                // Popup title => Favoris
                popupRemoveFromWishlistTitle.innerHTML = 'Are you sure you want to remove <strong>' + favorisChannelSelected.getAttribute('data-attr-name') + '</strong> from <strong>' + favorisSelected.textContent + '</strong> ?'
                
                // Popup title => Bouquet
                // popupRemoveFromWishlistTitle.innerHTML = 'Are you sure you want to remove <strong>' + favorisChannelSelected.getAttribute('data-attr-name') + '</strong> from <strong>' + bouquetSelected.getAttribute('data-name') + '</strong> ?'
                
                // Show popup remove channel item from wishlist
                popupRemoveFromWishlist.style.display = 'flex'; 

                // Hide popup remove channel item from wishlist
                popupRemoveFromWishlistActionCancel.addEventListener('click', () => {  
                    popupRemoveFromWishlist.style.display = 'none';
                })

                // Submit form remove channel item from wishlist
                popupRemoveFromWishlistForm.addEventListener('submit', (e) => {  
                    e.preventDefault();
                    fetch('data/db.json')
                        .then(res => res.json())
                        .then(data =>
                            {
                                let getFav = data.favoris.filter(item => item.favori_id == favorisSelected.id);
                                let getFavChannels = getFav[0].channels.filter(item => item.channel_id != favorisChannelSelected.getAttribute('data-attr-id'));
                                getFav[0].channels = getFavChannels;
                                console.log(data.favoris);
                            }
                        )
                        .catch(err => console.log(err));
                })
            }
            break;
        case '2':
            let newArr = [];
            var getAllChannels = document.querySelectorAll('#list-channels .channel');
            getAllChannels.forEach(el => {
                var channelName = el.getAttribute('data-attr-name');
                newArr.push(channelName);
            })

            // ASC
            newArr.sort()
            console.log('ASC ' + newArr);

            // DESC
            newArr.sort((a, b) => {
                if (a > b) {
                    return -1;
                }
                if (b > a) {
                    return 1;
                }
                return 0;
            });
            console.log('DESC ' + newArr);

            console.log('Sort button has been clicked!');
            break;
    }

});


function mod(n, m) {
    return ((n % m) + m) % m;
}

function getItem(selector, display) {
    console.log(selector)
    document.querySelector('.' + selector.getAttribute('data-list')).style.display = display;
}
