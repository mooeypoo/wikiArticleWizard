( function () {
	var mainDialog = new waw.ui.WizardDialog(),
		windowManager = new OO.ui.WindowManager(),
		mainButton = new OO.ui.ButtonWidget( {
			label: mw.msg( 'articlesandbox-button' ),
			icon: 'article',
			flags: [ 'progressive' ]
		} );

	mainButton.setDisabled( true );
	windowManager.addWindows( [ mainDialog ] );

	// Attach events
	mainButton.on( 'click', function () {
		windowManager.openWindow( mainDialog );
	} );

	if ( waw.Config.ARTICLE_REPO ) {
		// Get the data
		$.when(
			// Get the data for the articles
			waw.Utils.buildArticleStructure( waw.Config.ARTICLE_REPO ),
			// Get the content for the introduction page
			waw.Utils.getRestbasePage( waw.Config.ARTICLE_REPO )
		).then(
			// Success
			mainDialog.buildContent.bind( mainDialog ),
			// Failure
			mainDialog.setError.bind( mainDialog )
		).always( function () {
			mainButton.setDisabled( false );
		} );
	} else {
		// If ARTICLE_REPO is undefined, show an error
		mainDialog.setError( 'noconfig' );
		mainButton.setDisabled( false );
	}

	// Load the stylesheet and wait for document ready to attach the
	// main button to the DOM
	$.when(
		// Stylesheet
		mw.loader.load( 'https://www.mediawiki.org/w/index.php?title=User:Mooeypoo/articlesandbox.css&action=raw&ctype=text/css', 'text/css' ),
		// Document ready
		$.ready
	).then( function () {
		// Attach to DOM
		$( '#right-navigation' ).append( mainButton.$element );
		$( 'body' ).append( windowManager.$element );
	} );
}() );
