// Audio
let context = new (window.AudioContext || window.webkitAudioContext)()
let src = context.createMediaElementSource(audio)
let analyser = context.createAnalyser()
let bufferLength = analyser.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)

// Canvas:
let canvas = document.querySelector("#visualizer")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let ctx = canvas.getContext("2d")
let cdThumb = new Image()

// Visualizer:
function visualizer() {

    // Unlock The Audio Context On IOS (Mobile):
    unlockAudioContext(context);

    // Connect audio to output:
    src.connect(analyser)
    analyser.connect(context.destination)
    analyser.fftSize = 512


    // When song pause:
    audio.addEventListener('pause', () => {
        context.suspend()
    })

    // When song play:
    audio.addEventListener('play', () => {
        context.resume()
    })

    // Scale track image with energy:
    function getAverageEnergy() {
        analyser.getByteTimeDomainData(dataArray)
        const sum = dataArray.reduce((acc, value) => acc + value)
        const average = sum / bufferLength
        return average
    }

    function getEnergyScale() {
        const energy = getAverageEnergy()
        const scaledValue = Math.min(255, Math.max(0, Math.floor(energy / 255 * 256)))
        return scaledValue
    }

    function scaleImage() {
        const scaledValue = getEnergyScale()
        const scaleFactor = (scaledValue / 255) * 0.8 + 0.8
        canvas.style.transform = `scale(${scaleFactor})`
    }

    function update() {

        requestAnimationFrame(update)

        // Load image:
        cdThumb.src = player.songImage

        // Draw image to canvas:
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(cdThumb, 0, 0, canvas.width, canvas.height)

        // Scale image:
        scaleImage()
    }
    update()

    let strokeStyle = 'transparent'

    // Draw canvas:
    function draw() {
        // Get request frame and get byte on time:
        requestAnimationFrame(draw)
        analyser.getByteTimeDomainData(dataArray)

        // Draw wave to canvas:
        ctx.beginPath()
        ctx.lineWidth = 4;

        // Caculate wave line:
        const sliceWidth = canvas.width * 5 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128;
            const y = v * (canvas.height / 2)
            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }

            x += sliceWidth
        }
        ctx.lineTo(canvas.width, canvas.height / 2)

        if (player.wavesurfer.isPlaying()) {
            strokeStyle = `rgba(255,255,255, 0.6)`
        } else {
            strokeStyle = `transparent`
        }

        ctx.strokeStyle = strokeStyle
        ctx.stroke()

    }
    draw()
}

// Unlock The Audio Context On IOS:
function unlockAudioContext(audioCtx) {
    if (audioCtx.state === 'suspended') {
        let events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
        let unlock = function unlock() {
            events.forEach(function (event) {
                document.body.removeEventListener(event, unlock)
            });
            audioCtx.resume();
        };

        events.forEach(function (event) {
            document.body.addEventListener(event, unlock, false)
        });
    }
}






