/**/( function () {
	/**
	 * Define translation messages and initialize by user language
	 * This happens early, without waiting for modules to load.
	 */
	var userLang = mw.config.get( 'wgUserLanguage' ),
		messages = {
			he: {
				'articlesandbox-title': 'אשף ערכים',
				'articlesandbox-button': 'אשף ערכים',
				'articlesandbox-dismiss': 'ביטול',
				'articlesandbox-moreinfo': 'מידע נוסף',
				'articlesandbox-goback': 'חזרה למסך הקודם',
				'articlesandbox-create-article': '{{GENDER:|צור|צרי}} ערך',
				'articlesandbox-create-article-for': '{{GENDER:|צור|צרי}} ערך עבור $1',
				'articlesandbox-sections': 'רשימת ערכים',
				'articlesandbox-create-button': '{{GENDER:|צור|צרי}} ערך',
				'articlesandbox-create-input-placeholder': 'כותרת הערך',
				'articlesandbox-create-articlesummary': 'נוצר באמצעות [https://www.mediawiki.org/wiki/User:Mooeypoo/articlesandbox.js|אשף הערכים]',
				'articlesandbox-error-badtitle': 'כותרת הערך שבחרת אינה תקינה. אנא {{GENDER:|נסה|נסי}} שוב.'
			},
			en: {
				'articlesandbox-title': 'Article wizard',
				'articlesandbox-button': 'Article wizard',
				'articlesandbox-dismiss': 'Dismiss',
				'articlesandbox-goback': 'Go back',
				'articlesandbox-moreinfo': 'More info',
				'articlesandbox-title-error': 'Error displaying contents',
				'articlesandbox-create-article': 'Create article',
				'articlesandbox-create-article-for': 'Create article for $1',
				'articlesandbox-sections': 'Available article templates',
				'articlesandbox-create-button': 'Create article',
				'articlesandbox-create-input-placeholder': 'Article title',
				'articlesandbox-create-articlesummary': 'Created by [https://www.mediawiki.org/wiki/User:Mooeypoo/articlesandbox.js|ArticleSandbox] user script',
				'articlesandbox-error-missing-repoconfig': 'Cannot load article templates, since there is no repository configured. Please configure a base repository for all article templates through setting the mw.config entry \'articlesandbox-article-repo\' where you load this script, and try again.',
				'articlesandbox-error-missing-articles': 'Cannot find any defined article templates. Please add articles to the repository, and try again.',
				'articlesandbox-error-missing-articles-gotorepo': 'Go to the article repository',
				'articlesandbox-error-badtitle': 'Invalid title: The title you chose contains invalid characters. Please retry.',
				'articlesandbox-error-restbase-preview': 'There was a problem fetching the preview. You can still add the article!',
				'articlesandbox-error-restbase-preview-content': 'Preview could not be displayed.'
			}
		};

	// Set language, with default 'English'
	mw.messages.set( messages.en );
	if ( userLang && userLang !== 'en' && userLang in messages ) {
		mw.messages.set( messages[ userLang ] );
	}
}() );
