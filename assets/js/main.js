/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

				// Pricing setup.

		var pricingList = document.querySelector('#pricing-list');
		var currencySelect = document.querySelector('#pricing-currency');

		if (pricingList && currencySelect) {

		        var currencyFormatters = {
		                'price-uzs': function(value) {
		                        return value.toLocaleString('ru-RU') + ' сум';
		                },
		                'price-rub': function(value) {
		                        return value.toLocaleString('ru-RU') + ' ₽';
		                },
		                'price-usd': function(value) {
		                        return '$' + value.toLocaleString('ru-RU');
		                }
		        };

		        var pricingData = [];

		        var renderPricing = function(currencyKey) {
		                var formatter = currencyFormatters[currencyKey] || currencyFormatters['price-uzs'];

		                pricingList.innerHTML = '';

		                var sorted = pricingData.slice().sort(function(a, b) {
		                        return (a.id || 0) - (b.id || 0);
		                });

		                var categories = new Map();

		                sorted.forEach(function(item) {
		                        if (!categories.has(item.cat))
		                                categories.set(item.cat, []);

		                        categories.get(item.cat).push(item);
		                });

		                if (categories.size === 0) {
		                        pricingList.innerHTML = '<p class="pricing-error">Нет данных для отображения.</p>';
		                        return;
		                }

		                categories.forEach(function(items, categoryName) {
		                        var section = document.createElement('section');
		                        section.className = 'pricing-category';
		                        section.setAttribute('data-category', categoryName);

		                        var header = document.createElement('header');
		                        header.className = 'pricing-category__header';

		                        var eyebrow = document.createElement('span');
		                        eyebrow.className = 'pricing-category__eyebrow';
		                        eyebrow.textContent = 'Категория';

		                        var title = document.createElement('h3');
		                        title.textContent = categoryName;

		                        header.appendChild(eyebrow);
		                        header.appendChild(title);
		                        section.appendChild(header);

		                        var list = document.createElement('div');
		                        list.className = 'pricing-list';

		                        items.forEach(function(service) {
		                                var item = document.createElement('div');
		                                item.className = 'pricing-item';

		                                var name = document.createElement('span');
		                                name.className = 'pricing-item__name';
		                                name.textContent = service.name;

		                                var price = document.createElement('span');
		                                price.className = 'pricing-item__price';

		                                var rawValue = service[currencyKey];
		                                var numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);

		                                if (Number.isFinite(numericValue))
		                                        price.textContent = formatter(numericValue);
		                                else if (typeof rawValue === 'string' && rawValue.trim().length > 0)
		                                        price.textContent = rawValue;
		                                else
		                                        price.textContent = '—';

		                                item.appendChild(name);
		                                item.appendChild(price);
		                                list.appendChild(item);
		                        });

		                        section.appendChild(list);
		                        pricingList.appendChild(section);
		                });
		        };

		        fetch('assets/js/price.json')
		                .then(function(response) {
		                        if (!response.ok)
		                                throw new Error('Network response was not ok');

		                        return response.json();
		                })
		                .then(function(data) {
		                        pricingData = Array.isArray(data) ? data : [];
		                        renderPricing(currencySelect.value || 'price-uzs');
		                })
		                .catch(function() {
		                        pricingList.innerHTML = '<p class="pricing-error">Не удалось загрузить список цен.</p>';
		                });

		        currencySelect.addEventListener('change', function(event) {
		                renderPricing(event.target.value);
		        });
		}
		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);