// Header search:
const searchInputElm = $('.header__search--input')
const suggestListElm = $('.search__suggest--list')
const headerSearchElm = $('.header__search')

const search = {
    start: function () {
        this.handleShowSuggest()
        player.handleSearch()
        window.onload = function() {
            search.renderSuggestElement(player.dataListLength)
            player.reloadSongElements()
        }
    },

    // Handle Show Suggest Function:
    handleShowSuggest: function () {
        // Show suggest when click search input:
        searchInputElm.addEventListener('focus', () => {
            headerSearchElm.classList.add('searching')
        })

        // Hide suggest when blur search input:
        searchInputElm.addEventListener('blur', () => {
            headerSearchElm.classList.remove('searching')
        })

        // Show suggest when hover suggest list:
        suggestListElm.addEventListener('mouseover', () => {
            suggestListElm.classList.add('selecting')
        })

        // Hide suggest when leave suggest list:
        suggestListElm.addEventListener('mouseout', () => {
            suggestListElm.classList.remove('selecting')
        })
    },

    // Render Songs Match With Input:
    renderSongsMatch: function (song) {
        return `
        <li class="song__wrap" data-id="${song.id}" title="${song.name}">
            <div class="song__thumb">
                <img src="${song.thumb}" alt="${song.name}" class="song__thumb--img">
                <div class="playing__bars--animation" data-id="${song.id}">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div class="playing__button--play control__btn--icon" data-id="${song.id}">
                    <i class="bi bi-play-fill"></i>
                </div>
                <div class="playing__button--pause control__btn--icon" data-id="${song.id}">
                    <i class="bi bi-pause-fill"></i>
                </div>
            </div>

            <div class="song__info">
                <p class="song__info--name">${song.name}</p>
                <p class="song__info--artist">${song.artist}</p>
            </div>
            <div class="song__option">
                <i class="bi bi-three-dots"></i>
            </div>
        </li>
        `
    },

    // Render Suggest Element Function:
    renderSuggestElement: function (number) {
        let songId = player.randomNumber(number)
        if(player.dataList[songId]) {
            suggestListElm.innerHTML = `
            <h2 class="suggest--list--heading">Đề xuất cho bạn</h2>
            <li class="song__wrap" data-id="${player.dataList[songId].id}" title="${player.dataList[songId].name}">
                <div class="song__thumb">
                    <img src="assets/images/songs/img-thumb${player.dataList[songId].id}.jpg" alt="" class="song__thumb--img">
                    <div class="playing__bars--animation" data-id="${player.dataList[songId].id}">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <div class="playing__button--play control__btn--icon" data-id="${player.dataList[songId].id}">
                        <i class="bi bi-play-fill"></i>
                    </div>
                    <div class="playing__button--pause control__btn--icon" data-id="${player.dataList[songId].id}">
                        <i class="bi bi-pause-fill"></i>
                    </div>
                </div>

                <div class="song__info">
                    <p class="song__info--name">${player.dataList[songId].name}</p>
                    <p class="song__info--artist">${player.dataList[songId].artist}</p>
                </div>
                <div class="song__option">
                    <i class="bi bi-three-dots"></i>
                </div>
            </li>
            `
        }
    }

}
search.start()