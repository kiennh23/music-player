// Upload music:
const uploadToggleElm = $('.user__setting--upload')
const uploadWrapElm = $('.upload__wrap')
const userAudioElm = $('#song-audio')
const userImageElm = $('#song-img')
const userNameElm = $('#song-name')
const userArtistElm = $('#song-artist')
const userBtnUpload = $('.upload__btn')
const modalUploadElm = $('.modal__upload')
const btnCloseModal = $('.modal__close--icon')

const labelMusicElm = $('.mediafile__label--music')
const labelImageElm = $('.mediafile__label--image')
const musicFileELm = $('.music__file--text')
const imageFileELm = $('.image__file--text')
let musicSrc, imageSrc, name, artist


const upload = {
    start: function () {
        this.handleUpload()
    },

    // Hanlde Upload Function:
    handleUpload: function () {
        // Listen for input file (music) change event:
        userAudioElm.addEventListener('change', (e) => {
            musicSrc = URL.createObjectURL(e.target.files[0])
            musicFileELm.textContent = userAudioElm.files[0].name
        })

        // Listen for input file (image) change event:
        userImageElm.addEventListener('change', (e) => {
            imageSrc = URL.createObjectURL(e.target.files[0])
            imageFileELm.textContent = userImageElm.files[0].name
        })

        // Listen for upload button click event:
        userBtnUpload.addEventListener('click', () => {
            lyricsElmWrap.innerHTML = `...`
            name = userNameElm.value
            artist = userArtistElm.value
            this.setUploadSongInfo(musicSrc, imageSrc, name, artist)
        })

        // Stop propagation for upload container element:
        uploadWrapElm.addEventListener('click', (e) => {
            e.stopPropagation()
        })

        // Listen for upload music item in user setting click event:
        uploadToggleElm.addEventListener('click', () => {
            modalUploadElm.classList.toggle('active')
        })

        // Listen for close modal upload click event:
        btnCloseModal.addEventListener('click', () => {
            modalUploadElm.classList.remove('active')
        })

        // Listen for upload wrap click event:
        modalUploadElm.addEventListener('click', () => {
            modalUploadElm.classList.remove('active')
        })
    },

    // Set upload song info when uploaded function:
    setUploadSongInfo: function (musicSrc, imageSrc, name, artist) {
        audio.src = musicSrc
        player.wavesurfer.load(audio)
        player.songImage = imageSrc
        audioThumb.style.backgroundImage = `url(${imageSrc})`
        audioName.textContent = name
        audioArtist.textContent = artist
        cdName.textContent = name
        cdArtist.textContent = artist
    }
}
upload.start()