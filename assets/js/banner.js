// Banner Elements:
const bannerWrapElm = $('.banner__slider')
const bannerItemElm = $$('.banner__item')
const btnBannerPrev = $('.banner__prev--btn')
const btnBannerNext = $('.banner__next--btn')

const banner = {
    currentIndex: 1,
    isScroll: false,
    bannerItemElmLength: bannerItemElm.length,
    start: function () {
        this.handleEvents()
        this.autoScrollBanner()
    },
    // Hanlde Events Function:
    handleEvents: function () {
        bannerWrapElm.addEventListener('mouseover', () => {
            this.isScroll = true
        })
        bannerWrapElm.addEventListener('mouseout', () => {
            this.isScroll = false
        })
        btnBannerPrev.addEventListener('mouseover', () => {
            this.isScroll = true
        })
        btnBannerNext.addEventListener('mouseover', () => {
            this.isScroll = true
        })
        btnBannerPrev.addEventListener('click', () => {
            this.currentIndex = this.hanldeCurrentIndexPrev(this.currentIndex, this.bannerItemElmLength)
            this.scrollFuntion(bannerWrapElm, `banner${this.currentIndex}`, 0.5)
        })
        btnBannerNext.addEventListener('click', () => {
            this.currentIndex = this.hanldeCurrentIndexNext(this.currentIndex, this.bannerItemElmLength)
            this.scrollFuntion(bannerWrapElm, `banner${this.currentIndex}`, 0.5)
        })
    },
    // Auto Scroll Banner Function:
    autoScrollBanner: function () {
        setInterval(() => {
            if (this.isScroll) {
                clearInterval()
            } else {
                this.currentIndex = this.hanldeCurrentIndexNext(this.currentIndex, this.bannerItemElmLength)
                this.scrollFuntion(bannerWrapElm, `banner${this.currentIndex}`, 0.5)
            }
        }, 5000)
    },
    // Scroll Funtion:
    scrollFuntion: function (parentElement, scrollId, time) {
        gsap.to(parentElement, { duration: time, scrollTo: `#${scrollId}` })
    },
    // Hanlde Index Next Funtion:
    hanldeCurrentIndexNext: function (index, length) {
        if (window.innerWidth > 1024) {
            index++
            if (index > length - 2) {
                index = 1
            }
        } else {
            index++
            if (index > length) {
                index = 1
            }
        }
        return index
    },
    // Hanlde Index Prev Function:
    hanldeCurrentIndexPrev: function (index, length) {
        if (window.innerWidth > 1024) {
            index--
            if (index < 1) {
                index = length - 2
            }
        } else {
            index--
            if (index < 1) {
                index = length
            }
        }
        return index
    }

}
banner.start()



