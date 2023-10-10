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
                li.innerHTML = `<label for="checkbox-${element.wishlist_id}">
                    <span class="checkbox-icon">
                        <input type="checkbox" id="checkbox-${element.wishlist_id}" name="${element.wishlist_name}" value="${element.wishlist_id}"/>
                        <svg class="checkbox-checked" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                        </svg>
                        <svg class="checkbox-checkedNot" viewBox="0 0 24 24">
                            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                        </svg>
                    </span>
                    <span class="checkbox-text">${element.wishlist_name}</span>
                </label>`;
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