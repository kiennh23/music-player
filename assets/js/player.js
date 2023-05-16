const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// Buttons
const btnPlay = $('.play__btn')
const btnPause = $('.pause__btn')
const btnShuffle = $('.shuffle__btn')
const btnRepeat = $('.repeat__btn')
const btnNext = $('.next__btn')
const btnPrev = $('.prev__btn')
const btnPlayList = $('.playlist__btn')
const btnVolume = $('.volume__btn')
const btnVisualizer = $('.visualizer__btn')
const btnLyricToggle = $('.lyrics__icon--toggle')
const btnAlignToggle = $('.lyrics__icon--align')
const btnFontToggle = $('.lyrics__icon--font')
const btnChangeWaveFormColor = $('.waveform__icon--color')
const btnTogglePlayer = $('.visualizer__player--toggle')
const btnVisualizerPlay = $('.visualizer__control--play')
const btnVisualizerPause = $('.visualizer__control--pause')
const btnVisualizerNext = $('.visualizer__control--next')
const btnVisualizerPrev = $('.visualizer__control--prev')

// Button Mobile:
const btnMbPlaylist = $('.playlist__mobile--btn')
const btnMbVisualizer = $('.visualizer__mobile--btn')
const btnMbAlignToggle = $('.align__mobile--btn')
const btnMbPlayBtn = $('.play__mobile--btn')
const btnMbPauseBtn = $('.pause__mobile--btn')
const btnMbNextBtn = $('.next__mobile--btn')
const btnMbPrevBtn = $('.prev__mobile--btn')
const btnMbRepeatBtn = $('.repeat__mobile--btn')
const btnMbShuffleBtn = $('.shuffle__mobile--btn')

// Song information
const audio = document.getElementById('audio')
const audioThumb = $('.playing__thumb--img')
const audioArtist = $('.playing__artist--name')
const audioName = $('.playing__song--name')
const totalDurationElm = $('.playing__total--duration')
const currentDurationElm = $('.playing__current--duration')
const mBtotalDurationElm = $('.timeline__mobile--total')
const mBcurrentDurationElm = $('.timeline__mobile--current')
const visualizerAnimate = $('.visualizer__cd--animate')
const cdName = $('.visualizer__cd--name')
const cdArtist = $('.visualizer__cd--artist')
const audioVisualizer = $('.visualizer__wrap')
const lyricsElmWrap = $('.lyrics')
const songListWrap = $('.song__list')
const songPlayedElm = $('.songs__played')
const songPlayedList = $('.song__played--list')


// Volume
const volProgress = $('.playing__progress--volume')
const volValue = $('.playing__volume--value')
const volMbBtn = $('.volume__mobile--btn')
const volMbProgress = $('.mobile__volume--progress')
const volMbModal = $('.modal__mobile--volume')
const volMbValue = $('.mobile__volume--value')

// Visualizer:
const visualizerContainer = $('.visualizer')
const visualizerControls = $('.visualizer__fullscreen--show')

// Playing:
const playingContainer = $('.playing')
const playingInfoWrap = $('.playing__info')
const loadingNotifyElm = $('.playing__notify--loading')
const playListWrap = $('.playlist')
const progressBar = $('.visualizer__progress')
const progressPercentText = $('.visualizer__progress--wrap > span')
const mBprogressBar = $('.playing__mobile--progress')
const crossFadeCheckBoxElm = $('.crossfade__setting--toggle')
const crossFadeElm = $('.crossfade__setting--time')
const crossFadeValueElm = $('.crossfade__setting--value')

// Music API:
const musicApi = './assets/json/db.json'


const player = {
    trackId: 1,
    currentTrack: 0,
    dataList: [],
    playedSong: [],
    dataListLength: 0,
    isRepeat: false,
    isShuffle: false,
    isMute: false,
    volume: 60,
    songPath: '',
    songName: '',
    songImage: '',
    songThumb: '',
    songArtist: '',
    lyricArr: [],
    lyricElm: [],
    crossFadeTime: 500,

    // Define wavesurfer object:
    wavesurfer: WaveSurfer.create({
        container: '#waveform',
        plugins: [
            WaveSurfer.cursor.create({
                showTime: true,
                opacity: 1,
                customShowTimeStyle: {
                    'background-color': `rgba(50,50,50,0.5)`,
                    color: '#fff',
                    padding: '2px 4px 6px 4px',
                    'font-size': '10px',
                    'backdrop-filter': 'blur(15px)',
                    'border-radius': '3px',
                },
                formatTimeCallback: (seconds) => {
                    return [
                        Math.floor((seconds % 3600) / 60),
                        Math.floor(seconds % 60)
                    ]
                        .map((value) => {
                            return value < 10 ? "0" + value : value;
                        })
                        .join(":");
                }
            })
        ],
        // progressColor: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
        progressColor: '#FFF',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 0,
        hideScrollbar: true,
        height: 20,
        barGap: 2,
        responsive: true,
        waveColor: '#999',
        backend: 'MediaElement',
        mediaType: 'audio',
    }),

    // Start function:
    start: function () {
        this.fetchPlayList()
            .then((dataList) => {
                // Get data infomation:
                this.dataList = [...dataList]
                this.dataListLength = this.dataList.length
                app.playerDataList = this.dataList
                app.playerDataListLength = this.dataListLength

                // Functions:
                this.getLocalStorageVariables()
                this.renderPlayList(this.dataList)
                this.renderSongs(this.dataList, 12)
                this.handleSearch()
                this.reloadSongElements()
                this.loadMusicHandle(this.currentTrack)
                this.setVolumeFunc(this.volume)
                this.handleEvents()
                this.handleMusicEvents()
                this.handleShowPlayedSongs(this.playedSong)
            })

            .catch(() => {
                // Notify error:
                console.log('Error...')
            })
    },

    // Handle events:
    handleEvents: function () {
        let songListElm = $$('.song__wrap')

        // Listen for keyboard keydown event:
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                //         case 'KeyL': // Playlist
                //             playListWrap.classList.toggle('show')
                //             btnPlayList.classList.toggle('active')
                //             break;
                //         case 'KeyM': // Mute/Unmute
                //             this.muteFunc()
                //             break;
                case 'Escape': // Visualizer
                    btnVisualizer.classList.remove('active')
                    visualizerContainer.classList.remove('active')
                    break;
                //         case 'Space': // Play/Pause
                //             if (this.wavesurfer.isPlaying()) {
                //                 this.changeVolumeSmoothDown(0, this.volume, this.crossFadeTime)
                //                     .then(() => {
                //                         this.wavesurfer.pause()
                //                     })
                //             } else {
                //                 this.wavesurfer.play()
                //             }
                //             break;
                //         case 'ArrowRight': // Seek forward 10s
                //             this.seekAudio(10)
                //             break;
                //         case 'ArrowLeft':  // Seek backwrad 10s
                //             this.seekAudio(-10)
                //             break;
                //         case 'ArrowUp':  // Volume Up + 5%
                //             this.volume = (this.wavesurfer.getVolume() * 100) + 5
                //             if (this.volume >= 100) {
                //                 this.volume = 100
                //             }
                //             this.setVolumeFunc(this.volume)
                //             break;
                //         case 'ArrowDown':  // Volume Up - 5%
                //             this.volume = (this.wavesurfer.getVolume() * 100) - 5
                //             if (this.volume < 0) {
                //                 this.volume = 0
                //             }
                //             this.setVolumeFunc(this.volume)
                //             break;
                //         case 'KeyA': // Align Lyrics and CD Animate
                //             lyricsElmWrap.classList.toggle('horizontal')
                //             lyricsElmWrap.classList.toggle('vertical')
                //             visualizerContainer.classList.toggle('horizontal')
                //             visualizerContainer.classList.toggle('vertical')
                //             break;
                //         case 'KeyF': // Full screen mode
                //             playingContainer.classList.toggle('hide')
                //             visualizerContainer.classList.toggle('full')
                //             playListWrap.classList.toggle('full')
                //             visualizerControls.classList.toggle('active')
                //             break;
                default:
                    break;
            }
        })

        // Listen for playlist button click event:
        btnPlayList.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            playListWrap.classList.toggle('show')
            btnPlayList.classList.toggle('active')
        })

        // Listen for playlist mobile button click event:
        btnMbPlaylist.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            playListWrap.classList.toggle('show')
            btnPlayList.classList.toggle('active')
            btnMbPlaylist.classList.toggle('active')
        })

        // Listen for playlist song click and hover event:
        songListElm.forEach((elmNode) => {
            elmNode.addEventListener('click', () => {

                this.dataList = app.playerDataList
                this.dataListLength = app.playerDataListLength

                // Get trackId with data-id attribute:
                this.trackId = elmNode.getAttribute('data-id')

                // Get song index and set current track with trackId:
                this.currentTrack = this.getSongIndex(this.dataList, this.trackId)

                // Load music:
                this.loadMusicHandle(this.currentTrack)

                // Play music:
                this.playMusic()

            })
        })

        // Listen for play button click event:
        btnPlay.addEventListener('click', () => {
            this.wavesurfer.play()
        })

        // Listen for pause button click event:
        btnPause.addEventListener('click', () => {
            this.changeVolumeSmoothDown(0, this.volume, this.crossFadeTime)
                .then(() => {
                    this.wavesurfer.pause()
                })
        })

        // Listen for visualizer play button click event:
        btnVisualizerPlay.addEventListener('click', () => {
            this.wavesurfer.play()
        })

        // Listen for visualizer pause button click event:
        btnVisualizerPause.addEventListener('click', () => {
            this.changeVolumeSmoothDown(0, this.volume, this.crossFadeTime)
                .then(() => {
                    this.wavesurfer.pause()
                })
        })

        // Listen for mobile play button click event:
        btnMbPlayBtn.addEventListener('click', () => {
            this.wavesurfer.play()
        })

        // Listen for mobile pause button click event:
        btnMbPauseBtn.addEventListener('click', () => {
            this.changeVolumeSmoothDown(0, this.volume, this.crossFadeTime)
                .then(() => {
                    this.wavesurfer.pause()
                })
        })

        // Listen for next button click event:
        btnNext.addEventListener('click', () => {
            this.nextSong()
        })

        // Listen for prev button click event:
        btnPrev.addEventListener('click', () => {
            this.prevSong()
        })

        // Listen for visualizer next button click event:
        btnVisualizerNext.addEventListener('click', () => {
            this.nextSong()
        })

        // Listen for visualizer prev button click event:
        btnVisualizerPrev.addEventListener('click', () => {
            this.prevSong()
        })

        // Listen for mobile next button click event:
        btnMbNextBtn.addEventListener('click', () => {
            this.nextSong()
        })

        // Listen for mobile prev button click event:
        btnMbPrevBtn.addEventListener('click', () => {
            this.prevSong()
        })

        // Listen for repeat button click event:
        btnRepeat.addEventListener('click', () => {
            // btnRepeat.classList.toggle('active')
            // this.isRepeat = btnRepeat.getAttribute('class').includes('active')
            if (!this.isRepeat || this.isRepeat === 'false') {
                btnMbRepeatBtn.classList.add('active')
                btnRepeat.classList.add('active')
                this.isRepeat = true
                localStorage.setItem('repeat', true)
            } else {
                btnMbRepeatBtn.classList.remove('active')
                btnRepeat.classList.remove('active')
                this.isRepeat = false
                localStorage.setItem('repeat', false)
            }
        })

        // Listen for repeat mobile button click event:
        btnMbRepeatBtn.addEventListener('click', () => {
            // btnMbRepeatBtn.classList.toggle('active')
            // this.isRepeat = btnMbRepeatBtn.getAttribute('class').includes('active')
            if (!this.isRepeat || this.isRepeat === 'false') {
                btnMbRepeatBtn.classList.add('active')
                btnRepeat.classList.add('active')
                this.isRepeat = true
                localStorage.setItem('repeat', true)
            } else {
                btnMbRepeatBtn.classList.remove('active')
                btnRepeat.classList.remove('active')
                this.isRepeat = false
                localStorage.setItem('repeat', false)
            }
        })

        // Listen for shuffle button click event:
        btnShuffle.addEventListener('click', () => {
            if (!this.isShuffle || this.isShuffle === 'false') {
                btnMbShuffleBtn.classList.add('active')
                btnShuffle.classList.add('active')
                this.isShuffle = true
                localStorage.setItem('shuffle', true)
            } else {
                btnMbShuffleBtn.classList.remove('active')
                btnShuffle.classList.remove('active')
                this.isShuffle = false
                localStorage.setItem('shuffle', false)
            }
        })

        // Listen for shuffle mobile button click event:
        btnMbShuffleBtn.addEventListener('click', () => {
            if (!this.isShuffle || this.isShuffle === 'false') {
                btnMbShuffleBtn.classList.add('active')
                btnShuffle.classList.add('active')
                this.isShuffle = true
                localStorage.setItem('shuffle', true)
            } else {
                btnMbShuffleBtn.classList.remove('active')
                btnShuffle.classList.remove('active')
                this.isShuffle = false
                localStorage.setItem('shuffle', false)
            }
        })

        // Listen for volume button click event:
        btnVolume.addEventListener('click', () => {
            btnVolume.classList.toggle('active')
            this.muteFunc()
        })

        // Listen for volume mobile button click event:
        volMbBtn.addEventListener('click', () => {
            volMbBtn.classList.toggle('active')
            volMbModal.classList.toggle('active')
            volMbProgress.addEventListener('change', () => {
                timeout = 2000
                setTimeout(() => {
                    if (volMbModal.getAttribute('class').includes('active')) {
                        volMbModal.classList.remove('active')
                        volMbBtn.classList.remove('active')
                    }
                }, timeout)
            })

        })

        // Listen for volume oninput:
        volProgress.addEventListener('input', (e) => {
            btnVolume.classList.remove('active')
            this.volume = Number(e.target.value)
            this.setVolumeFunc(this.volume)
        })

        // Listen for volume mobile oninput:
        volMbProgress.addEventListener('input', (e) => {
            btnVolume.classList.remove('active')
            volMbValue.textContent = e.target.value + '%'
            this.volume = Number(e.target.value)
            this.setVolumeFunc(this.volume)
        })

        // Listen for progress bar oninput:
        progressBar.addEventListener('input', () => {
            this.wavesurfer.seekTo(progressBar.value / 100)
        })

        //Listen for progress mobile bar oninput:
        mBprogressBar.addEventListener('input', () => {
            this.wavesurfer.seekTo(mBprogressBar.value / 100)
        })

        // Listen for audioThum click event:
        audioThumb.addEventListener('click', () => {
            if (this.wavesurfer.isPlaying()) {
                this.changeVolumeSmoothDown(0, this.volume, this.crossFadeTime)
                    .then(() => {
                        this.wavesurfer.pause()
                    })
            } else {
                this.wavesurfer.play()
            }
        })

        // Listen for visualizer button click event:
        btnVisualizer.addEventListener('click', () => {
            btnVisualizer.classList.toggle('active')
            visualizerContainer.classList.toggle('active')
        })

        // Listen for visualizer mobile button click event:
        btnMbVisualizer.addEventListener('click', () => {
            btnVisualizer.classList.toggle('active')
            visualizerContainer.classList.toggle('active')
            btnMbVisualizer.classList.toggle('active')
        })

        // Listen for visualizer audio click event:
        audioVisualizer.addEventListener('click', () => {
            if (this.wavesurfer.isPlaying()) {
                this.changeVolumeSmoothDown(0, this.volume, this.crossFadeTime)
                    .then(() => {
                        this.wavesurfer.pause()
                    })
            } else {
                this.wavesurfer.play()
            }
        })

        // Listen for lyric btn click event:
        btnLyricToggle.addEventListener('click', () => {
            lyricsElmWrap.classList.toggle('active')
            visualizerContainer.classList.toggle('show')
        })

        // Listen for align btn click event:
        btnAlignToggle.addEventListener('click', () => {
            lyricsElmWrap.classList.toggle('horizontal')
            lyricsElmWrap.classList.toggle('vertical')
            visualizerContainer.classList.toggle('horizontal')
            visualizerContainer.classList.toggle('vertical')
        })

        // Listen for align mobile btn click event:
        btnMbAlignToggle.addEventListener('click', () => {
            visualizerAnimate.classList.toggle('hide')
            lyricsElmWrap.classList.toggle('horizontal')
            lyricsElmWrap.classList.toggle('vertical')
            btnMbAlignToggle.classList.toggle('active')
        })

        // Listen for font btn click event:
        btnFontToggle.addEventListener('click', () => {
            this.lyricElm.forEach(item => {
                item.classList.toggle('changed')
            })
        })

        // Listen for change waveform color btn click event:
        btnChangeWaveFormColor.addEventListener('click', () => {
            let color = this.randomColor()
            this.wavesurfer.setProgressColor(color)
        })

        // Listen for player toggle btn click event:
        btnTogglePlayer.addEventListener('click', () => {
            playingContainer.classList.toggle('hide')
            visualizerContainer.classList.toggle('full')
            playListWrap.classList.toggle('full')
            visualizerControls.classList.toggle('active')
        })

        // Stop ImmediatePropagation for playlist container:
        playListWrap.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
        })

        // Hide playlist when click document:
        document.addEventListener('click', () => {
            if (playListWrap.getAttribute('class').includes('show')) {
                playListWrap.classList.remove('show')
                btnPlayList.classList.remove('active')
                btnMbPlaylist.classList.remove('active')
            }
        })

        // Listen for crossfade time checkbox event:
        crossFadeCheckBoxElm.addEventListener('input', (e) => {
            if (e.target.checked) {
                crossFadeElm.disabled = false
                crossFadeElm.classList.remove('disabled')
                this.crossFadeTime = Number(crossFadeElm.value) * 1000
            } else {
                crossFadeElm.disabled = true
                crossFadeElm.classList.add('disabled')
                this.crossFadeTime = 0
            }
        })

        // Listen for crossfade time range input event:
        crossFadeElm.addEventListener('input', (e) => {
            this.crossFadeTime = Number(e.target.value) * 1000
            localStorage.setItem('crossFadeTime', this.crossFadeTime)
            crossFadeValueElm.textContent = e.target.value + ' s'
        })

    },

    // Handle music events:
    handleMusicEvents: function () {
        let songListElm = $$('.song__wrap')

        // When audio loaded:
        this.wavesurfer.on('ready', () => {
            // Render total duration:
            this.renderTime(this.wavesurfer.getDuration(), totalDurationElm)
            this.renderTime(this.wavesurfer.getDuration(), mBtotalDurationElm)

        })

        // When audio loaded and waveform ready:
        this.wavesurfer.on('waveform-ready', () => {

            // Visualizer start:
            visualizer()

            // Change curshor to pointer when hover the waveform:
            $('#waveform > wave').style.cursor = 'pointer'
        })

        // When audio play:
        audio.addEventListener('play', () => {
            // Hanlde Played Songs:
            this.playedSong.push(Number(this.currentTrack))
            localStorage.setItem('played', this.playedSong)
            this.handleShowPlayedSongs(this.playedSong)
            this.renderPlayedSongs(this.playedSong)

            //Smooth volume change when music play:
            this.changeVolumeSmooth(0, this.volume, this.crossFadeTime)

            // Show animate for song now playing:
            const songPlayingAnimate = $$('.playing__bars--animation')

            // Get all element playing:
            let listPlayingAnimate = this.getElementBySongIndex(songPlayingAnimate, this.dataList, this.currentTrack)
            songPlayingAnimate.forEach((item) => {
                // Set opacity for all element not play:
                item.style.opacity = 0
                listPlayingAnimate.forEach((item) => {
                    // Set opacity for all element playing:
                    item.style.opacity = 1
                })
            })

            // Show button play when hover a song:
            const songPlayingThumb = $$('.song__thumb')
            const songPlayingBtn = $$('.playing__button--play')

            // Get all element playing:
            let listPlayingBtn = this.getElementBySongIndex(songPlayingBtn, this.dataList, this.currentTrack)
            songPlayingThumb.forEach((item, index) => {
                item.addEventListener('mouseover', () => {
                    // Set opacity for all element not play:
                    songPlayingBtn[index].style.opacity = '1'
                    listPlayingBtn.forEach((item) => {
                        // Set opacity for all element playing:
                        item.style.opacity = 0
                    })
                })
                // Set opacity when mouseout event for all element:
                item.addEventListener('mouseout', () => {
                    songPlayingBtn[index].style.opacity = '0'
                })
            })

            // Hide button pause when song resume play:
            const songPauseBtn = $$('.playing__button--pause')
            songPauseBtn.forEach((item) => {
                item.style.opacity = '0'
            })

            // Set background color for song nowplaying:

            // Filter all element have data-id === trackId:
            let elmPlayings = [...songListElm].filter((elmNode) => {
                return Number(elmNode.getAttribute('data-id')) === Number(this.trackId)
            })

            // Remove background color for all element not play:
            songListElm.forEach(item => {
                item.style.backgroundColor = 'transparent'
            })

            // Set background for all element now playing:
            elmPlayings.forEach(item => {
                gsap.to(playListWrap, { duration: 0.6, scrollTo: { y: item.offsetTop } })
                item.style.backgroundColor = '#434343'
            })


            btnPlay.classList.remove('active')
            btnPause.classList.add('active')
            btnVisualizerPlay.classList.remove('active')
            btnVisualizerPause.classList.add('active')
            btnMbPlayBtn.classList.remove('active')
            btnMbPauseBtn.classList.add('active')
            playingInfoWrap.style.opacity = 1
            totalDurationElm.style.opacity = 1
            currentDurationElm.style.opacity = 1
            this.wavesurfer.container.style.opacity = 1;
            audioThumb.style.transform = 'scale(1)'
            visualizerAnimate.style.filter = 'brightness(1)'
            visualizerAnimate.style.opacity = 1
            visualizerAnimate.style.transform = 'scale(1)'
            audioVisualizer.style.boxShadow = `0 0 2px ${this.randomColor()}`
            localStorage.setItem('track', this.currentTrack)
        })

        // When audio pause:
        this.wavesurfer.on('pause', () => {

            // Hide animate for song when paused:
            const songPauseBtn = $$('.playing__button--pause')
            const songPlayingAnimate = $$('.playing__bars--animation')
            let listPlayingAnimate = this.getElementBySongIndex(songPlayingAnimate, this.dataList, this.currentTrack)
            songPlayingAnimate.forEach((item) => {
                item.style.opacity = 0
                listPlayingAnimate.forEach((item) => {
                    item.style.opacity = 0
                })
            })

            // Show pause buton when song pause:
            let listSongPauseBtn = this.getElementBySongIndex(songPauseBtn, this.dataList, this.currentTrack)
            songPauseBtn.forEach((item) => {
                item.style.opacity = '0'
                listSongPauseBtn.forEach((item) => {
                    item.style.opacity = '1'
                })
            })

            btnPlay.classList.add('active')
            btnPause.classList.remove('active')
            btnVisualizerPlay.classList.add('active')
            btnVisualizerPause.classList.remove('active')
            btnMbPlayBtn.classList.add('active')
            btnMbPauseBtn.classList.remove('active')
            playingInfoWrap.style.opacity = 0.8
            totalDurationElm.style.opacity = 0.8
            currentDurationElm.style.opacity = 0.8
            this.wavesurfer.container.style.opacity = 0.8;
            audioThumb.style.transform = 'scale(0.95)'
            visualizerAnimate.style.filter = 'brightness(0.95)'
            visualizerAnimate.style.opacity = 0.9
            visualizerAnimate.style.transform = 'scale(0.95)'
        })

        // When audio process:
        this.wavesurfer.on('audioprocess', () => {
            // Render current time:
            let currentTime = this.wavesurfer.getCurrentTime()
            let totalTime = this.wavesurfer.getDuration()
            this.renderTime(currentTime, currentDurationElm)
            this.renderTime(currentTime, mBcurrentDurationElm)
            this.updateLyric(currentTime, this.lyricElm, this.lyricArr)
            let percent = parseInt(currentTime * 100 / totalTime)
            progressBar.style.backgroundSize = `${percent}% 100%`
            progressBar.value = percent
            progressPercentText.textContent = `${percent}%`
            progressPercentText.style.left = `calc(${percent}% - 0.5rem)`
            mBprogressBar.style.backgroundSize = `${percent}% 100%`
            mBprogressBar.value = percent
        })

        // When finish a song:
        audio.addEventListener('ended', () => {
            if (this.isShuffle && this.isRepeat) {
                this.repeatSong()
            } else if (this.isShuffle) {
                this.shuffleSong()
            } else if (this.isRepeat) {
                this.repeatSong()
            } else {
                this.nextSong()
            }
        })

        // When click seek:
        this.wavesurfer.on('seek', (position) => {
            currentDurationElm.innerText = this.renderTime(position * this.wavesurfer.getDuration(), currentDurationElm)
            this.updateLyric(this.wavesurfer.getCurrentTime(), this.lyricElm, this.lyricArr, position)
        })

    },

    // Fetch information songs function:
    fetchPlayList: function () {
        return new Promise((resolve, reject) => {
            fetch(musicApi)
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch(() => reject())
        })
    },

    // Render playlist function:
    renderPlayList: function (dataList) {
        const htmls = dataList.map((item) => {
            return `
            <li class="song__wrap" data-id="${item.id}" title="${item.name}">
            <div class="song__thumb">
            <img src="${item.thumb}" alt="" class="song__thumb--img">
                <div class="playing__bars--animation" data-id="${item.id}">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div class="playing__button--play control__btn--icon" data-id="${item.id}">
                        <i class="bi bi-play-fill"></i>
                </div>
                <div class="playing__button--pause control__btn--icon" data-id="${item.id}">
                        <i class="bi bi-pause-fill"></i>
                </div>
            </div>

            <div class="song__info">
                    <p class="song__info--name">${item.name}</p>
                    <p class="song__info--artist">${item.artist}</p>
            </div>

            <div class="song__option">
                    <i class="bi bi-three-dots"></i>
            </div>
            </li>
            `
        })
        playListWrap.innerHTML = htmls.join('')
    },

    // Render Trendy Songs (num Songs):
    renderSongs: function (dataList, num) {
        let htmls = dataList.slice(0, num).map((song) => {
            return `<div class="song__wrap col l-4 m-6 c-12" data-id="${song.id}" title="${song.name}">
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
            </div>`
        })
        songListWrap.innerHTML = htmls.join('')
    },

    // Render Played Songs:
    renderPlayedSongs: function (listId) {
        let playedSongs = []
        let newListId = new Set(listId)
        newListId.forEach((id) => {
            let song = this.dataList.filter((item, index) => {
                return index === Number(id)
            })
            playedSongs.push(...song)
        })

        if (playedSongs.length >= 3) {
            playedSongs = playedSongs.slice(-3)
        }

        let htmls = playedSongs.map((song, index) => {
            return `<div class="song__wrap col l-4 m-6 c-12" data-id="${song.id}" title="${song.name}">
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
        </div>`
        })
        songPlayedList.innerHTML = htmls.join('')
        this.reloadSongElements()
    },

    handleShowPlayedSongs: function (listId) {
        if (listId.length > 0) {
            songPlayedElm.style.display = 'block'
        } else {
            songPlayedElm.style.display = 'none'
        }
    },

    // Reload Song Elements Function:
    reloadSongElements: function () {
        // Reload songs element:
        let newSongListElm = $$('.song__wrap')
        newSongListElm.forEach((elmNode) => {
            elmNode.addEventListener('click', () => {

                this.dataList = app.playerDataList
                this.dataListLength = app.playerDataListLength

                // Get trackId with data-id attribute:
                player.trackId = elmNode.getAttribute('data-id')

                // Get song index and set current track with trackId:
                player.currentTrack = player.getSongIndex(player.dataList, player.trackId)

                // Load music:
                player.loadMusicHandle(player.currentTrack)

                // Play music:
                player.playMusic()

            })
        })
    },

    // Hanlde Search Function:
    handleSearch: function () {
        // Listen search input events:
        searchInputElm.addEventListener('input', (e) => {
            let keyword = e.target.value.trim()
            if (keyword != '') {
                // Filter with song name:
                let songsFilter = this.dataList.filter((song) => {
                    return song.name.toLowerCase().includes(`${e.target.value.toLowerCase()}`)
                })

                // Filter with artist name:
                let artistsFilter = this.dataList.filter((song) => {
                    return song.artist.toLowerCase().includes(`${e.target.value.toLowerCase()}`)
                })

                // Concat two array and remove duplicate song:
                let songs = [...new Set(songsFilter.concat(artistsFilter))]

                // If not founds:
                if (songs.length === 0) {
                    suggestListElm.innerHTML = `
                <h2 style="text-align: center; font-weight: 400;" class="suggest--list--heading">Not Founds</h2>
                `
                } else {
                    // Render songs match with input to suggest list:
                    let htmls = songs.map((song) => {
                        return search.renderSongsMatch(song)
                    })
                    suggestListElm.innerHTML = htmls
                    this.reloadSongElements()
                }

            } else {
                search.renderSuggestElement(this.dataListLength)
                this.reloadSongElements()
            }
        })
    },

    // Render lyrics function:
    renderLyric: function () {
        let htmls = this.lyricArr.map((lyricArrItem) => {
            return `
            <h5 class="current__line">${lyricArrItem[1]}</h5>
            `
        })
        lyricsElmWrap.innerHTML = htmls.join('')
        this.lyricElm = $$('.current__line')
    },

    // Update lyrics ontime function:
    updateLyric: function (currentTime, lyricElm, lyricArr, position) {
        let timeArr = []

        // Convert time from [minute, second] => [second]:
        lyricArr.forEach((item) => {
            timeArr.push(this.convertTime(item[0]))
        })

        let timeArrLength = timeArr.length
        // let options = {
        //     behavior: "auto",
        //     block: "center",
        //     inline: "nearest"
        // }

        // When start music:
        if (currentTime <= timeArr[1]) {
            lyricElm[0].classList.add('show')
            lyricElm[0].classList.remove('showed')
            // lyricElm[0].scrollIntoView(options)
            gsap.to(lyricsElmWrap, { duration: 0.5, scrollTo: { y: lyricElm[0].offsetTop - lyricElm[0].clientHeight / 1.5 } });

        } else {
            lyricElm[0].classList.add('showed')
            lyricElm[0].classList.remove('show')
        }

        // When finished first line:
        for (let i = 1; i < timeArrLength; i++) {
            if (currentTime > timeArr[i] && currentTime < timeArr[i + 1]) {
                lyricElm[i - 1].classList.add('showed')
                lyricElm[i].classList.add('show')
                // lyricElm[i].scrollIntoView(options)
                gsap.to(lyricsElmWrap, { duration: 0.5, scrollTo: { y: lyricElm[i].offsetTop - lyricElm[i].clientHeight / 1.5 } });

            } else {
                lyricElm[i].classList.remove('show')
            }
        }

        // When music end:
        if (currentTime >= timeArr[timeArrLength - 1]) {
            lyricElm[timeArrLength - 2].classList.add('showed')
            lyricElm[timeArrLength - 1].classList.add('show')
            // lyricElm[0].scrollIntoView(options)
            gsap.to(lyricsElmWrap, { duration: 0.5, scrollTo: { y: lyricElm[timeArrLength - 1].offsetTop - lyricElm[timeArrLength - 1].clientHeight / 1.5 } });
        } else {
            lyricElm[timeArrLength - 2].classList.remove('showed')
        }

        // Update lyric if user click seek:
        if (position) {
            let newCurrentTime = position * this.wavesurfer.getDuration()
            for (let i = 1; i < timeArrLength - 1; i++) {
                if (newCurrentTime > timeArr[i]) {
                    lyricElm[i - 1].classList.add('showed')
                    // lyricElm[i - 1].scrollIntoView(options)
                    gsap.to(lyricsElmWrap, { duration: 0.5, scrollTo: { y: lyricElm[i].offsetTop - lyricElm[i].clientHeight / 1.5 } });


                } else {
                    lyricElm[i - 1].classList.remove('showed')
                    // lyricElm[i - 1].scrollIntoView(options)
                    gsap.to(lyricsElmWrap, { duration: 0.5, scrollTo: { y: lyricElm[i].offsetTop - lyricElm[i].clientHeight / 1.5 } });

                }
            }
        }
    },

    // Get song index whith trackId:
    getSongIndex: function (dataList, trackId) {
        let songIndex = dataList.findIndex((item) => {
            return Number(item.id) === Number(trackId)
        })
        return songIndex
    },

    // Load music handle function:
    loadMusicHandle: function (songIndex) {

        // Get infomation:
        this.songPath = this.dataList[songIndex].path
        this.songName = this.dataList[songIndex].name
        this.songImage = this.dataList[songIndex].image
        this.songThumb = this.dataList[songIndex].thumb
        this.songArtist = this.dataList[songIndex].artist
        this.trackId = this.dataList[songIndex].id
        this.lyricArr = this.convertLyric(this.dataList[songIndex].lyricArr)

        // Set audio information:

        // Set audio thumbnail:
        audioThumb.style.backgroundImage = `url(${this.songThumb})`

        // Set audio title:
        audioVisualizer.setAttribute('title', `${this.songName}`)

        // Set audio src:
        audio.setAttribute('src', this.songPath)

        // Set audio name:
        cdName.innerText = this.songName
        audioName.innerText = this.songName

        // Set audio artist:
        cdArtist.innerText = this.songArtist
        audioArtist.innerText = this.songArtist

        // Load song:
        this.wavesurfer.load(audio)

        // Render lyric:
        this.renderLyric()

        // Show notify loading...::
        loadingNotifyElm.style.display = 'block'

        // When waveform ready:
        this.wavesurfer.on('waveform-ready', () => {

            // Hide notify loading...:
            loadingNotifyElm.style.display = 'none'

        })
    },

    // Render time function:
    renderTime: function (value, elmNode) {
        let second = Math.floor(value % 60)
        let minute = Math.floor(value / 60)
        if (second < 10) {
            second = `0${second}`
        }
        if (minute < 10) {
            minute = `0${minute}`
        }
        return elmNode.textContent = `${minute} : ${second}`
    },

    // Convert time [minute, seconds] to seconds:
    convertTime: function (arr) {
        let time = arr[0] * 60 + arr[1]
        return time
    },

    // Convert lrc file to this application format file:
    convertLyric: function (lrcFile) {
        let newArray = []
        lrcFile.forEach((item) => {
            let myArr = []
            let minute = Number(item.slice(1, 3))
            let second = Number(item.slice(4, 9))
            let time = [minute, second]
            myArr.push(time)
            let lyric = item.slice(10)
            myArr.push(lyric)
            newArray.push(myArr)
        })
        return newArray
    },

    // Next song function:
    nextSong: function () {
        if (this.isShuffle) {
            this.shuffleSong()
        } else {
            this.currentTrack++
            if (this.currentTrack >= this.dataListLength) {
                this.currentTrack = 0
            }
            this.loadMusicHandle(this.currentTrack)
            this.playMusic()
        }
    },

    // Prev song function:
    prevSong: function () {
        if (this.isShuffle) {
            this.shuffleSong()
        } else {
            this.currentTrack--
            if (this.currentTrack < 0) {
                this.currentTrack = this.dataListLength - 1
            }
            this.loadMusicHandle(this.currentTrack)
            this.playMusic()
        }
    },

    // Repeat song funtion:
    repeatSong: function () {
        this.loadMusicHandle(this.currentTrack)
        this.playMusic()
    },

    // Repeat song funtion:
    shuffleSong: function () {
        this.currentTrack = this.randomNumber(this.dataListLength)
        this.loadMusicHandle(this.currentTrack)
        this.playMusic()
    },

    // Seek function:
    seekAudio: function (value) {
        let currentDuration = this.wavesurfer.getCurrentTime()
        let totalDuration = this.wavesurfer.getDuration()
        let time = (currentDuration + value) / totalDuration
        if (time < 0) {
            time = 0
        }
        if (time >= 1) {
            time = 1
        }
        this.wavesurfer.seekTo(time)
    },

    // Set volume function:
    setVolumeFunc: function (value) {
        // Set the new volume:
        value = Math.floor(value)
        this.wavesurfer.setVolume(value / 100)
        localStorage.setItem("volume", value)
        // Render value to HTML:
        volProgress.value = value
        volProgress.style.backgroundSize = `${value}% 100%`
        volValue.innerText = `${value}%`
    },

    // Set mute/unMute function:
    muteFunc: function () {
        if (this.wavesurfer.getVolume() != 0) {
            // Save the current vol to volume variable:
            this.volume = this.wavesurfer.getVolume()
            // Set volume 0:
            btnVolume.classList.add('active')
            volProgress.value = 0
            volProgress.style.backgroundSize = `0% 100%`
            volValue.innerText = `0%`
            this.wavesurfer.setVolume(0)

        } else {
            // Set current volume = volume variable:
            this.wavesurfer.setVolume(this.volume)
            volProgress.value = this.volume * 100
            btnVolume.classList.remove('active')
            volProgress.style.backgroundSize = `${this.volume * 100}% 100%`
            volValue.innerText = `${this.volume * 100}%`
        }
    },

    // Smooth volume change funtion:
    changeVolumeSmooth: function (initialVol, targetVol, time) {
        if (time === 0) {
            this.wavesurfer.setVolume(targetVol / 100)
        } else {
            let currentVol = initialVol
            let valueChange = (targetVol - initialVol) / (time / 10)
            const intervalId = setInterval(() => {
                if (currentVol >= targetVol) {
                    clearInterval(intervalId)
                    currentVol = targetVol
                    this.wavesurfer.setVolume(currentVol / 100)
                } else {
                    currentVol += valueChange
                    this.wavesurfer.setVolume(currentVol / 100)
                }
            }, 10)
        }
    },

    changeVolumeSmoothDown: function (initialVol, targetVol, time) {
        return new Promise((resolve) => {
            let isDone = false
            let currentVol = targetVol
            let valueChange = (targetVol - initialVol) / (time / 10)
            const intervalId = setInterval(() => {
                if (currentVol > 0) {
                    currentVol -= valueChange
                    if (currentVol <= 0) {
                        currentVol = 0
                        clearInterval(intervalId)
                        isDone = true
                        resolve(isDone)
                    }
                    this.wavesurfer.setVolume(currentVol / 100)
                }
            }, 10)
        })
    },

    // Play music:
    playMusic: function () {
        this.wavesurfer.on('ready', () => {
            this.wavesurfer.play()
        })
    },

    // Random number function:
    randomNumber: function (max) {
        return Math.floor(Math.random() * max)
    },

    // Random color function:
    randomColor: function () {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
        if (color.length >= 7) {
            return color
        }
        return this.randomColor()
    },

    // Get Element By Song Index:
    getElementBySongIndex: function (elementList, dataList, songIndex) {
        let dataElements = [...elementList].filter((item) => {
            return Number(item.getAttribute('data-id')) === dataList[songIndex].id
        })
        return dataElements
    },

    // Get Local Storage:
    getLocalStorageVariables: function () {
        // Get volume:
        if (!localStorage.getItem('volume')) {
            localStorage.setItem('volume', this.volume)
        } else {
            this.volume = localStorage.getItem('volume')
        }

        // Get crossFadeTime:
        if (!localStorage.getItem('crossFadeTime')) {
            localStorage.setItem('crossFadeTime', 500)
            this.crossFadeTime = localStorage.getItem('crossFadeTime')
            crossFadeElm.value = this.crossFadeTime / 1000
            crossFadeValueElm.textContent = this.crossFadeTime / 1000 + ' s'
        } else {
            this.crossFadeTime = localStorage.getItem('crossFadeTime')
            crossFadeElm.value = this.crossFadeTime / 1000
            crossFadeValueElm.textContent = this.crossFadeTime / 1000 + ' s'
        }

        // Get current track
        if (!localStorage.getItem('track')) {
            localStorage.setItem('track', 0)
            this.currentTrack = localStorage.getItem('track')
        } else {
            this.currentTrack = localStorage.getItem('track')
        }

        // Get isRepeat:
        if (localStorage.getItem('repeat') === 'true') {
            this.isRepeat = true
            btnMbRepeatBtn.classList.add('active')
            btnRepeat.classList.add('active')
        } else {
            this.isRepeat = false
            btnMbRepeatBtn.classList.remove('active')
            btnRepeat.classList.remove('active')
        }

        // Get isShuffle:
        if (localStorage.getItem('shuffle') === 'true') {
            this.isShuffle = true
            btnMbShuffleBtn.classList.add('active')
            btnShuffle.classList.add('active')
        } else {
            this.isShuffle = false
            btnMbShuffleBtn.classList.remove('active')
            btnShuffle.classList.remove('active')
        }

        // Get Played Song:
        if (localStorage.getItem('played') != null) {
            this.playedSong = localStorage.getItem('played').split(',')
            this.renderPlayedSongs(this.playedSong)
        }

    }

}
player.start()
