{
	const slider = document.querySelector('[data-slider="partners-mob-slider"]');
	if(slider) {
		let mySwiper;

		function mobileSlider() {
			if(document.documentElement.clientWidth <= 767 && slider.dataset.mobile == 'false') {
				mySwiper = new Swiper(slider, {
                    slidesPerView: 2,
                    grid: {
                        rows: 3,
                    },
					speed: 600,
                    spaceBetween: 0,
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

}