var listSelected = 'tabs';
var tabs = document.getElementsByClassName('tab');
var bouquets = document.getElementsByClassName('bouquet');
var favoris = document.getElementsByClassName('favoris');
var channels = document.getElementsByClassName('channel');
var groupName = document.querySelector('.group-name');
var searchForm = document.querySelector('#searchForm');
var serachInput = document.getElementById('search');
var tab_btns;
var sortAscDesc = 0;
var sortBy = document.querySelector('.sortBy');

var popupAction = false;

var parsedChannels = [];

var popupAction = false;
var popupSuccess = false;

var moveWishlistAction = false;


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

var popupCloseBtn = document.querySelectorAll('.popup .btn-cancel');
popupCloseBtn.forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const getPopup = el.getAttribute('data-popup');
        const popup = document.querySelector('.popup.' + getPopup);
        popup.classList.remove('active');
        popupAction = false;
    });
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
            if (moveWishlistAction === true) {
                saveMoveWishlist(tab_btns[current_index])
                moveWishlistAction = false
                current_index = 0
            } else if (popupAction === true) {
                var popupSubmitBtn = document.querySelector('.popup.active form button[type="submit"]');
                var popupActive = document.querySelector('.popup.active');
                popupSubmitBtn.click();
                popupActive.classList.add('confirmed');
                setTimeout(() => {
                    popupActive.classList.remove('confirmed');
                    popupActive.classList.remove('active');
                }, 2000);
                popupAction = false;
            } else {
                if (listSelected === 'tabs') {
                    if (tab_btns[current_index].getAttribute('data-list') === 'list-favoris') {
                        listSelected = 'favoris';
                        tab_btns[current_index].classList.remove('selected');
                        tab_btns[current_index].classList.add('active');
                        tab_btns = favoris;
                        document.getElementById('wishlist-buttons').style.display = 'flex';
                        document.getElementById('buckets-buttons').style.display = 'none';
                    } else {
                        listSelected = 'bouquets';
                        tab_btns[current_index].classList.remove('selected');
                        tab_btns[current_index].classList.add('active');
                        tab_btns = bouquets;
                        document.getElementById('buckets-buttons').style.display = 'flex';
                        document.getElementById('wishlist-buttons').style.display = 'none';
                    }
                    current_index = 0;
                    tab_btns[current_index].classList.add('selected');
                } else if (listSelected === 'bouquets' || listSelected === 'favoris') {
                    listChannels.setAttribute('data-attr-back-list', listSelected)
                    listChannels.setAttribute('data-attr-back-list-index', current_index)
                    listChannels.innerHTML = '';
                    groupName.setAttribute('list-selected', listSelected);
                    searchForm.classList.add('visible');
                    if (listSelected === 'bouquets') {
                        let bouquetId = tab_btns[current_index].getAttribute('id');
                        let bouquetName = tab_btns[current_index].getAttribute('data-name');
                        groupName.innerHTML = bouquetName;
                        groupName.setAttribute('id', bouquetId);

                        read().then(data => {
                            if (data) {
                                let result = data.bouquets.filter(bouquet => bouquet.bouquet_id == bouquetId);
                                console.log(result);
                                parsedChannels = result[0].channels
                                if (result[0].pin) {
                                    checkPin()
                                } else {
                                    showChannels()
                                }
                            }
                        })
                    } else {
                        let favorisId = tab_btns[current_index].getAttribute('id');
                        let bouquetName = tab_btns[current_index].getAttribute('data-name');

                        groupName.innerHTML = bouquetName;
                        groupName.setAttribute('id', favorisId);

                        read().then(data => {
                            if (data) {
                                const result = data.favoris.filter(favoris => favoris.favori_id == favorisId);
                                console.log(result);
                                parsedChannels = result[0].channels
                                if (result[0].pin) {
                                    checkPin()
                                } else {
                                    showChannels()
                                }
                            }
                        })
                    }
                }
            }
            console.log(tab_btns)
            break;
        case 'Escape':
            if (listSelected === 'tabs') {
                return false;
            } else {
                if (popupAction === true) {
                    var popupActive = document.querySelector('.popup.active');
                    popupActive.classList.remove('active');
                    popupAction = false;
                } else {
                    if (listSelected === 'bouquets' || listSelected === 'favoris') {
                        if (listSelected === 'bouquets') {
                            document.getElementById('buckets-buttons').style.display = 'none';
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
                }
            }
            break;
        case "ArrowRight":
            if (listSelected === 'tabs') {
                tab_btns[current_index].classList.remove('selected');
                getItem(tab_btns[current_index], 'none');
                current_index = mod(current_index - 1, tab_btns.length);
                tab_btns[current_index].classList.add('selected');
                getItem(tab_btns[current_index], 'flex');
            }
            break;
        case "ArrowLeft":
            if (listSelected === 'tabs') {
                tab_btns[current_index].classList.remove('selected');
                getItem(tab_btns[current_index], 'none');
                current_index = mod(current_index + 1, tab_btns.length);
                tab_btns[current_index].classList.add('selected');
                getItem(tab_btns[current_index], 'flex');
            }
            break;
        case "ArrowUp":
            if (listSelected !== 'tabs') {
                if (tab_btns[current_index].classList.contains('move')) {
                    moveWishlist(tab_btns[current_index], 'moveUp')
                } else {
                    tab_btns[current_index].classList.remove('selected');
                    current_index = mod(current_index - 1, tab_btns.length);
                    tab_btns[current_index].classList.add('selected');
                }
            }
            break;
        case 'ArrowDown':
            if (listSelected !== 'tabs') {
                if (tab_btns[current_index].classList.contains('move')) {
                    moveWishlist(tab_btns[current_index], 'moveDown')
                } else {
                    tab_btns[current_index].classList.remove('selected');
                    current_index = mod(current_index + 1, tab_btns.length);
                    tab_btns[current_index].classList.add('selected');
                }
            }
            break;
        case '1': // Remove channel from favoris
            if (listSelected === 'channels') {
                var groupNameSelected = document.querySelector('.group-name');
                if (groupNameSelected.getAttribute('list-selected') === 'favoris') {
                    popupAction = true;
                    var favorisSelected = document.querySelector('.group-name');
                    var favorisChannelSelected = document.querySelector('.list-channels .channel.selected');
                    var popupRemoveFromWishlist = document.querySelector('.popup-remove-from-wishlist');
                    var popupRemoveFromWishlistForm = document.getElementById('remove-from-wishlist-form');
                    var popupRemoveFromWishlistTitle = document.querySelector('.popup-remove-from-wishlist .popup-title');

                    // Popup title => Favoris
                    popupRemoveFromWishlistTitle.innerHTML = 'Are you sure you want to remove <strong>' + favorisChannelSelected.getAttribute('data-attr-name') + '</strong> from <strong>' + favorisSelected.textContent + '</strong> ?'

                    // Popup title => Bouquet
                    // popupRemoveFromWishlistTitle.innerHTML = 'Are you sure you want to remove <strong>' + favorisChannelSelected.getAttribute('data-attr-name') + '</strong> from <strong>' + bouquetSelected.getAttribute('data-name') + '</strong> ?'

                    // Show popup remove channel item from wishlist
                    popupRemoveFromWishlist.classList.add('active');

                    // Submit form remove channel item from wishlist
                    popupRemoveFromWishlistForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        favorisChannelSelected.remove();

                        read().then(data => {
                            if (data) {
                                let getFav = data.favoris.filter(item => item.favori_id == favorisSelected.id);
                                let getFavChannels = getFav[0].channels.filter(item => item.channel_id != favorisChannelSelected.getAttribute('data-attr-id'));
                                let favorisChannel = document.querySelectorAll('.list-channels .channel');
                                favorisChannel[0].classList.add('selected');
                                getFav[0].channels = getFavChannels;
                                save(data);
                            }
                        })
                    })
                }
            }
            break;
        case '2': // Sort channels by ASC or DESC
            if (listSelected === 'channels') {
                let normalArr = [];
                let newArr = [];
                var getAllChannels = document.querySelectorAll('#list-channels .channel');
                listChannels0.innerHTML = '';
                getAllChannels.forEach(el => {
                    var channelID = el.getAttribute('data-attr-id');
                    var channelName = el.getAttribute('data-attr-name');
                    var channelOrder = el.getAttribute('data-attr-order');
                    newArr.push({
                        "channel_id" : parseInt(channelID),
                        "channel_name" : channelName,
                        "channel_order" : parseInt(channelOrder)
                    });
                    normalArr.push({
                        "channel_id" : parseInt(channelID),
                        "channel_name" : channelName,
                        "channel_order" : parseInt(channelOrder)
                    });
                });
                
                newArr.sort((a, b) => {
                    if ( a.channel_name < b.channel_name ){
                      return -1;
                    }
                    if ( a.channel_name > b.channel_name ){
                      return 1;
                    }
                    return 0;
                });
                normalArr.sort((a, b) => {
                    if ( a.channel_order < b.channel_order ){
                      return -1;
                    }
                    if ( a.channel_order > b.channel_order ){
                      return 1;
                    }
                    return 0;
                });
    
                if (sortAscDesc === 0) {
                    newArr.forEach((element, index) => {
                        const li = document.createElement('li');
                        li.setAttribute('data-attr-id', element.channel_id);
                        li.setAttribute('data-attr-name', element.channel_name);
                        li.setAttribute('data-attr-order', element.channel_order);
                        if (index == 0) {
                            li.setAttribute('class', 'channel selected');
                        } else {
                            li.setAttribute('class', 'channel');
                        }
                        li.innerHTML = element.channel_name;
                        listChannels0.appendChild(li);
                    });
                    sortBy.textContent = '(A-Z)';
                    sortAscDesc = 1;
                } else if (sortAscDesc === 1) {
                    newArr.reverse();
                    newArr.forEach((element, index) => {
                        const li = document.createElement('li');
                        li.setAttribute('data-attr-id', element.channel_id);
                        li.setAttribute('data-attr-name', element.channel_name);
                        li.setAttribute('data-attr-order', element.channel_order);
                        if (index == 0) {
                            li.setAttribute('class', 'channel selected');
                        } else {
                            li.setAttribute('class', 'channel');
                        }
                        li.innerHTML = element.channel_name;
                        listChannels0.appendChild(li);
                    });
                    sortBy.textContent = '(Z-A)';
                    sortAscDesc = 2;
                } else if (sortAscDesc === 2) {
                    normalArr.forEach((element, index) => {
                        const li = document.createElement('li');
                        li.setAttribute('data-attr-id', element.channel_id);
                        li.setAttribute('data-attr-name', element.channel_name);
                        li.setAttribute('data-attr-order', element.channel_order);
                        if (index == 0) {
                            li.setAttribute('class', 'channel selected');
                        } else {
                            li.setAttribute('class', 'channel');
                        }
                        li.innerHTML = element.channel_name;
                        listChannels0.appendChild(li);
                    });
                    sortBy.textContent = '(Normal)';
                    sortAscDesc = 0;
                }
            }
            if (listSelected === 'favoris') {
                moveWishlistAction = true;
                moveWishlist(tab_btns[current_index])
            }
            break;
        case '3':
            if (listSelected === 'bouquets') {
                HideBucket()
            }
            break;
        case '4':
            if (listSelected === 'favoris') {
                PINWishlist()
            } else if (listSelected === 'bouquets') {
                PINBucket()
            }
            break;
        case '5': // Add new favoris
            if (listSelected === 'favoris') {
                popupAction = true;
                var popupWishlist = document.querySelector('.popup.popup-add-wishlist');
                popupWishlist.classList.add('active');
                addNewFavoris();
            }
            break;
        case '6': // Add channel to favoris
            if (listSelected === 'channels') {
                popupAction = true;
                var popupFav = document.querySelector('.popup.popup-favoris');
                var popupFavForm = document.querySelector('.popup.popup-favoris form');
                popupFav.classList.add('active');

                read().then(data => {
                    if (data) {
                        popupFavList.innerHTML = '';
                        (data.favoris).forEach((element, index) => {
                            const li = document.createElement('li');
                            li.setAttribute('id', element.favori_id);
                            li.setAttribute('class', 'favoris');
                            li.innerHTML = `
                                <input type="checkbox" id="${element.favori_id}" name="${element.favori_name}" value="${element.favori_id}" /> ${element.favori_name}
                            `;
                            popupFavList.appendChild(li);
                        });
                    }
                })

                popupFavForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const listChanSelected = document.querySelector('#list-channels .channel.selected');
                    const listChanSelectedID = listChanSelected.getAttribute('data-attr-id');
                    const listChanSelectedName = listChanSelected.getAttribute('data-attr-name');
                    const listChanSelectedOrder = listChanSelected.getAttribute('data-attr-order');
                    const checkedFav = document.querySelectorAll('.popup-favoris-list-fav li input:checked');

                    console.log(checkedFav);
                    var favArr = [];
                    checkedFav.forEach(el => {
                        favArr.push(parseInt(el.value));
                        console.log(el.value);
                    })
                    console.log(favArr);

                    read().then(data => {
                        if (data) {
                            (data.favoris).forEach((element, index) => {
                                if (favArr.indexOf(element.favori_id) !== -1) {
                                    console.log(element);
                                    element.channels.push({
                                        "channel_id": parseInt(listChanSelectedID),
                                        "channel_name": listChanSelectedName,
                                        "channel_id": parseInt(listChanSelectedOrder)
                                    });
                                }
                            });
                            save(data);
                        }
                    })
                })
                console.log('Key code nbr 6 clicked!');
            }
            break;
    }

});

//////////////////////////
/// Start PIN
//////////////////////////
function checkPin() {
    let PINField = document.querySelector('#pin-field');
    popupAction = false;
    popupPin.classList.add('active');
    PINField.focus()
    let confirmPin = document.querySelector('.action-pin-ok');
    confirmPin.addEventListener('click', function (event) {

        read().then(data => {
            if (data) {
                if (PINField.value === data.pin) {
                    showChannels();
                    popupAction = false;
                    popupPin.classList.remove('active');
                    PINField.value = "";
                }
            }
        })
    })
}

function showChannels() {
    (parsedChannels).forEach((element, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-attr-id', element.channel_id);
        li.setAttribute('data-attr-name', element.channel_name);
        li.setAttribute('data-attr-order', element.channel_order);
        if (index == 0) {
            li.setAttribute('class', 'channel selected');
        } else {
            li.setAttribute('class', 'channel');
        }
        li.innerHTML = element.channel_name;
        listChannels0.appendChild(li);
    });
    hideSidebar()
}

function hideSidebar(){
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

//////////////////////////
/// END PIN
//////////////////////////

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getItem(selector, display) {
    console.log(selector)
    document.querySelector('.' + selector.getAttribute('data-list')).style.display = display;
}
