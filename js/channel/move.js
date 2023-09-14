function moveChannel (elementToMove, action = 'select') {
    console.log(elementToMove)
    var oldOrder =  parseInt(elementToMove.getAttribute('data-attr-order'))
    switch (action) {
        case "select":
            console.log("select for move")
            const iconMove = document.createElement('i');
            iconMove.setAttribute('class', 'arrow');
            elementToMove.classList.add("move")
            elementToMove.appendChild(iconMove)
            break;
        case "moveUp":
            console.log("move up")
            var prevElement = document.querySelector('.channel[data-attr-order="' + (oldOrder - 1) + '"]')
            prevElement.setAttribute('data-attr-order', oldOrder)
            prevElement.style.order = oldOrder
            elementToMove.setAttribute('data-attr-order', oldOrder - 1)
            elementToMove.style.order = oldOrder - 1
            break;
        case "moveDown":
            console.log("move down")
            var nextElement = document.querySelector('.channel[data-attr-order="' + (oldOrder + 1) + '"]')
            nextElement.setAttribute('data-attr-order', oldOrder)
            nextElement.style.order = oldOrder
            elementToMove.setAttribute('data-attr-order', oldOrder + 1)
            elementToMove.style.order = oldOrder + 1
            break;
    }
}
function saveMoveChannel() {
    read().then(data => {
        if (data) {
            console.log('save')
        }
    })
}

