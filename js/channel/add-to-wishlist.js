//////////////////////////////////////////////
/// CHANNELS : ADD TO WISHLIST /// START
//////////////////////////////////////////////
const popupAddToWishlistForm = document.querySelector('.popup.popup-wishlist form');
const popupAddToWishlistList = document.getElementById('popup-wishlist-list-fav');

popupAddToWishlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const listChanSelected = document.querySelector('#list-channels .channel.selected');
    const listChanSelectedID = listChanSelected.getAttribute('data-attr-id');
    const listChanSelectedName = listChanSelected.getAttribute('data-attr-name');
    const checkedFav = document.querySelectorAll('.popup-wishlist-list-fav li input:checked');

    const wishlistArr = [];
    checkedFav.forEach(el => {
        wishlistArr.push(parseInt(el.value));
    })

    read().then(data => {
        if (data) {
            (data.wishlists).forEach((element, index) => {
                if (wishlistArr.indexOf(element.wishlist_id) !== -1) {
                    console.log(element);
                    element.channels.push({
                        "channel_id": parseInt(listChanSelectedID),
                        "channel_name": listChanSelectedName,
                        "channel_order": element.channels.length + 1
                    });
                }
            });
            save(data);
            popupAddToWishlist.classList.remove('error');
            popupAddToWishlist.classList.add('confirmed');
            setTimeout(() => {
                popupAddToWishlist.classList.remove('confirmed');
                popupAddToWishlist.classList.remove('active');
            }, 2000);
            popupAction = false;

            list_selected = 'channels';
            document.querySelector('#list-channels .channel.selected').classList.remove('active');
        }
    })
})

function fillPopupAddToWishlist() {
    read().then(data => {
        if (data) {
            popupAddToWishlistList.innerHTML = '';
            (data.wishlists).forEach((element, index) => {
                const li = document.createElement('li');
                li.setAttribute('id', element.wishlist_id);
                li.setAttribute('class', 'checkbox-wishlist');
                li.innerHTML = `<input type="checkbox" id="checkbox-${element.wishlist_id}" 
                    name="${element.wishlist_name}" value="${element.wishlist_id}" /> ${element.wishlist_name}`;
                if (index === 0) {
                    li.classList.add('selected')
                }
                popupAddToWishlistList.appendChild(li);
            });
            list_selected = 'checkboxes-channels'
        }
    })
}

//////////////////////////////////////////////
/// CHANNELS : ADD TO WISHLIST /// END
//////////////////////////////////////////////