let popupCloseBtn = document.querySelectorAll('.popup .btn-cancel');
popupCloseBtn.forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const getPopup = el.getAttribute('data-popup');
        const popup = document.querySelector('.popup.' + getPopup);
        popup.classList.remove('active');
        popupAction = false;
    });
});

function adaptPopup(popupActive) {
    console.log("fn adaptPopup")
    if (popupError === true) {
        popupActive.classList.add('error');
    } else {
        popupActive.classList.remove('error');
        popupActive.classList.add('confirmed');
        setTimeout(() => {
            popupActive.classList.remove('confirmed');
            popupActive.classList.remove('active');
        }, 2000);
        popupAction = false;
    }
    popupError = false;
}

function switchPopupActiveYesNo() {
    let popupButtons = document.querySelectorAll('.popup.active form button');
    let popupBtnActive = document.querySelector('.popup.active form button[class~="active"]');
    popupButtons.forEach(button => {
        if (button === popupBtnActive) {
            button.classList.remove('active')
        } else {
            button.classList.add('active')
        }
    })
}