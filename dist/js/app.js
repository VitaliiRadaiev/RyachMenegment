class Utils {
	slideUp(target, duration = 500) {
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
	slideDown(target, duration = 500) {
		target.style.removeProperty('display');
		let display = window.getComputedStyle(target).display;
		if (display === 'none')
			display = 'block';

		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
	slideToggle(target, duration = 500) {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (window.getComputedStyle(target).display === 'none') {
				return this.slideDown(target, duration);
			} else {
				return this.slideUp(target, duration);
			}
		}
	}

	Android() {
		return navigator.userAgent.match(/Android/i);
	}
	BlackBerry() {
		return navigator.userAgent.match(/BlackBerry/i);
	}
	iOS() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	}
	Opera() {
		return navigator.userAgent.match(/Opera Mini/i);
	}
	Windows() {
		return navigator.userAgent.match(/IEMobile/i);
	}
	isMobile() {
		return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
	}

}
;
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".content__column-garden,992,2"
// https://github.com/FreelancerLifeStyle/dynamic_adapt

class DynamicAdapt {
	constructor(type) {
	  this.type = type;
	}
  
	init() {
	  this.оbjects = [];
	  this.daClassname = '_dynamic_adapt_';
	  this.nodes = [...document.querySelectorAll('[data-da]')];
  
	  this.nodes.forEach((node) => {
		const data = node.dataset.da.trim();
		const dataArray = data.split(',');
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
		оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	  });
  
	  this.arraySort(this.оbjects);
  
	  this.mediaQueries = this.оbjects
		.map(({
		  breakpoint
		}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
		.filter((item, index, self) => self.indexOf(item) === index);
  
	  this.mediaQueries.forEach((media) => {
		const mediaSplit = media.split(',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];
  
		const оbjectsFilter = this.оbjects.filter(
		  ({
			breakpoint
		  }) => breakpoint === mediaBreakpoint
		);
		matchMedia.addEventListener('change', () => {
		  this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	  });
	}
  
	mediaHandler(matchMedia, оbjects) {
	  if (matchMedia.matches) {
		оbjects.forEach((оbject) => {
		  оbject.index = this.indexInParent(оbject.parent, оbject.element);
		  this.moveTo(оbject.place, оbject.element, оbject.destination);
		});
	  } else {
		оbjects.forEach(
		  ({ parent, element, index }) => {
			if (element.classList.contains(this.daClassname)) {
			  this.moveBack(parent, element, index);
			}
		  }
		);
	  }
	}
  
	moveTo(place, element, destination) {
	  element.classList.add(this.daClassname);
	  if (place === 'last' || place >= destination.children.length) {
		destination.append(element);
		return;
	  }
	  if (place === 'first') {
		destination.prepend(element);
		return;
	  }
	  destination.children[place].before(element);
	}
  
	moveBack(parent, element, index) {
	  element.classList.remove(this.daClassname);
	  if (parent.children[index] !== undefined) {
		parent.children[index].before(element);
	  } else {
		parent.append(element);
	  }
	}
  
	indexInParent(parent, element) {
	  return [...parent.children].indexOf(element);
	}
  
	arraySort(arr) {
	  if (this.type === 'min') {
		arr.sort((a, b) => {
		  if (a.breakpoint === b.breakpoint) {
			if (a.place === b.place) {
			  return 0;
			}
			if (a.place === 'first' || b.place === 'last') {
			  return -1;
			}
			if (a.place === 'last' || b.place === 'first') {
			  return 1;
			}
			return a.place - b.place;
		  }
		  return a.breakpoint - b.breakpoint;
		});
	  } else {
		arr.sort((a, b) => {
		  if (a.breakpoint === b.breakpoint) {
			if (a.place === b.place) {
			  return 0;
			}
			if (a.place === 'first' || b.place === 'last') {
			  return 1;
			}
			if (a.place === 'last' || b.place === 'first') {
			  return -1;
			}
			return b.place - a.place;
		  }
		  return b.breakpoint - a.breakpoint;
		});
		return;
	  }
	}
}
;

class App {
	constructor() {
		this.utils = new Utils();
		this.dynamicAdapt = new DynamicAdapt('max');
	} 

	init() {
		if (this.utils.isMobile()) {
			document.body.classList.add('mobile');
		}
	
		if (this.utils.iOS()) {
			document.body.classList.add('mobile-ios');
		}
	
		this.dynamicAdapt.init();
		this.headerHandler();
		this.popupHandler();
		//this.setHtmlFontSize();
		//this.inputMaskInit();
		//this.tabsInit();
		
		window.addEventListener('load', () => {
			document.body.classList.add('page-is-load');

			this.setPaddingTopHeaderSize();
			this.videoHandlerInit();
			//this.scrollTgriggerAnimationInit();
			//this.smoothScroll();
			this.slidersInit();
			this.componentsScripts();
		});

	}

	headerHandler() {
		let header = document.querySelector('[data-header]');
let mobileMenu = document.querySelector('[data-mobile-menu]');
let burger = document.querySelector('[data-action="open-mobile-menu"]');
let mobileMenuCloseBtn = document.querySelector('[data-action="close-mobile-menu"]');

function burgerBtnAnimationToggle(burger) {
	burger.children[0].classList.toggle('first')
	burger.children[1].classList.toggle('second')
	burger.children[2].classList.toggle('third')
	burger.children[3].classList.toggle('fourth')
}


if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--is-scroll', window.pageYOffset > 50);
    })
}

if (mobileMenu) {
    let itemsHasSubMenu = mobileMenu.querySelectorAll('.menu-item-has-children');
    if (itemsHasSubMenu.length) {
        itemsHasSubMenu.forEach(item => {
            let link = item.querySelector('.menu__link');
            let subMenu = item.querySelector('.sub-menu');

            if (link && subMenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    link.classList.toggle('menu__link--submenu-is-open')
                    this.utils.slideToggle(subMenu);

                    itemsHasSubMenu.forEach(i => {
                        if (i === item) return;

                        let link = i.querySelector('.menu__link');
                        let subMenu = i.querySelector('.sub-menu');

                        link.classList.remove('menu__link--submenu-is-open')
                        this.utils.slideUp(subMenu);
                    })
                })
            }
        })
    }
}

if(mobileMenu && burger && mobileMenuCloseBtn) {
    burger.addEventListener('click', () => {
        mobileMenu.classList.add('mobile-menu--open');
        mobileMenuCloseBtn.classList.add('mobile-menu-close--show');
        document.body.classList.add('overflow-hidden');
        document.documentElement.classList.add('overflow-hidden');
    })
    mobileMenuCloseBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu--open');
        mobileMenuCloseBtn.classList.remove('mobile-menu-close--show');
        document.body.classList.remove('overflow-hidden');
        document.documentElement.classList.remove('overflow-hidden');
    })
};
	}

	popupHandler() {
		
	}

	slidersInit() {
		{
	const slider = document.querySelector('[data-slider="gallery-mob-slider"]');
	if(slider) {
		let mySwiper;

		function mobileSlider() {
			if(document.documentElement.clientWidth <= 767 && slider.dataset.mobile == 'false') {
				mySwiper = new Swiper(slider, {
					slidesPerView: 1,
					speed: 600,
                    spaceBetween: 24,
					pagination: {
					    el: slider.querySelector('.swiper-pagination'),
					    clickable: true,
					},
				});

				slider.dataset.mobile = 'true';
			}

			if(document.documentElement.clientWidth > 767) {
				slider.dataset.mobile = 'false';

				if(slider.classList.contains('swiper-initialized')) {
					mySwiper.destroy();
				}
			}
		}

		mobileSlider();

		window.addEventListener('resize', () => {
			mobileSlider();
		})
	}

};
	}

	smoothScroll() {

	}

	tabsInit() {
		let tabsContainers = document.querySelectorAll('[data-tabs]');
		if (tabsContainers.length) {
			tabsContainers.forEach(tabsContainer => {
				let triggerItems = tabsContainer.querySelectorAll('[data-tab-trigger]');
				let contentItems = Array.from(tabsContainer.querySelectorAll('[data-tab-content]'));

				const getContentItem = (id) => {
					if (!id.trim()) return;
					return contentItems.filter(item => item.dataset.tabContent === id)[0];
				}

				if (triggerItems.length && contentItems.length) {
					triggerItems[0].classList.add('tab-active');
					getContentItem(triggerItems[0].dataset.tabTrigger).classList.add('tab-active');

					triggerItems.forEach(item => {
						item.addEventListener('click', () => {
							item.classList.add('tab-active');
							getContentItem(item.dataset.tabTrigger).classList.add('tab-active');

							triggerItems.forEach(i => {
								if (i === item) return;

								i.classList.remove('tab-active');
								getContentItem(i.dataset.tabTrigger).classList.remove('tab-active');
							})
						})
					})
				}
			})
		}
	}

	spollerInit() {
		let spollers = document.querySelectorAll('[data-spoller]');
		if (spollers.length) {
			spollers.forEach(spoller => {
				let isOneActiveItem = spoller.dataset.spoller.trim() === 'one' ? true : false;
				let triggers = spoller.querySelectorAll('[data-spoller-trigger]');
				if (triggers.length) {
					triggers.forEach(trigger => {
						let parent = trigger.parentElement;
						let content = trigger.nextElementSibling;

						trigger.addEventListener('click', (e) => {
							e.preventDefault();
							parent.classList.toggle('active');
							trigger.classList.toggle('active');
							content && this.utils.slideToggle(content);

							if (isOneActiveItem) {
								triggers.forEach(i => {
									if (i === trigger) return;

									let parent = i.parentElement;
									let content = i.nextElementSibling;

									parent.classList.remove('active');
									i.classList.remove('active');
									content && this.utils.slideUp(content);
								})
							}
						})
					})
				}
			})
		}
	}

	inputMaskInit() {
		let items = document.querySelectorAll('[data-mask]');
		if (items.length) {
			items.forEach(item => {
				let maskValue = item.dataset.mask;
				let input = item.querySelector('input[type="text"]');

				if (input) {
					Inputmask(maskValue, {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
					}).mask(input);
				}
			})
		}
	}

	setPaddingTopHeaderSize() {
		let wrapper = document.querySelector('[data-padding-top-header-size]');
		if (wrapper) {
			let header = document.querySelector('[data-header]');
			if (header) {
				const setPedding = () => wrapper.style.paddingTop = header.clientHeight + 'px';
				setPedding();
				let id = setInterval(setPedding, 200);
				setTimeout(() => {
					clearInterval(id);
				}, 1000)
				window.addEventListener('resize', setPedding);
			}

		}
	}

	videoHandlerInit() {
		
function togglePlayPause(video, btn) {
	if (video.paused) {
		video.play();
		btn.classList.remove('video-block__controll--play');
		btn.classList.add('video-block__controll--pause');
		video.setAttribute('controls', true);

	} else {
		video.pause();
		btn.classList.add('video-block__controll--play');
		btn.classList.remove('video-block__controll--pause');
		btn.style.opacity = '1';
	}
}

let videoBlock = document.querySelectorAll('[data-video]');
if (videoBlock.length) {
	videoBlock.forEach((item) => {
		let videoWrap = item.querySelector('.video-block__video-wrap');
		let video = item.querySelector('.video-block__video');
		let btn = item.querySelector('.video-block__controll');

		if (video) {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				togglePlayPause(video, btn);
			});

			video.addEventListener('ended', () => {
				video.pause();
				btn.classList.add('video-block__controll--play');
				btn.classList.remove('video-block__controll--pause');
				btn.style.opacity = '1';
				video.removeAttribute('controls');
			});

			video.addEventListener('play', () => {
				btn.classList.remove('video-block__controll--play');
				btn.classList.add('video-block__controll--pause');

				if (this.utils.isMobile()) {
					btn.style.opacity = '0';
				}
			});

			video.addEventListener('pause', () => {
				btn.classList.add('video-block__controll--play');
				btn.classList.remove('video-block__controll--pause');
			});

			videoWrap.addEventListener('mouseenter', (e) => {
				if (!video.paused) {
					btn.style.opacity = '1';
				}
			});

			videoWrap.addEventListener('mouseleave', (e) => {
				if (!video.paused) {
					btn.style.opacity = '0';
				}
			});
		}
	})
}

;
	}

	componentsScripts() {
		{
    let textScrollBtnAll = document.querySelectorAll('[data-action="scroll-to-next-block"]');
    if(textScrollBtnAll.length) {
        textScrollBtnAll.forEach(textScrollBtn => {
            textScrollBtn.addEventListener('click', () => {
                let parent = textScrollBtn.closest('.text-block');
                window.scrollTo({
                    top: parent.nextElementSibling.offsetTop - 40,
                    behavior: "smooth"
                })
            })
        })
    }
};
	}

}

window.addEventListener('DOMContentLoaded', function () {
	let app = new App();
	app.init();
});

