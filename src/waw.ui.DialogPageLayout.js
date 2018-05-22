( function () {
	/**
	 * Create a custom page layout for the wizard dialog
	 *
	 * @class
	 * @extends OO.ui.PageLayout
	 *
	 * @constructor
	 * @param {string} name Page name
	 * @param {Object} [config] Optional config
	 */
	waw.ui.DialogPageLayout = function DialogPageLayout( name, config ) {
		waw.ui.DialogPageLayout.super.call( this, name, config );

		config = config || {};

		this.titleWidget = new OO.ui.LabelWidget( {
			label: config.title,
			classes: [ 'articlesandbox-page-title' ]
		} );
		this.$content = config.$content;

		// Create a panel that holds the intro
		this.$intro = $( '<div>' )
			.addClass( 'articlesandbox-page-intro-content' )
			.append( config.intro );
		this.introPanel = new OO.ui.PanelLayout( {
			$content: this.$intro,
			classes: [ 'articlesandbox-page-intro' ],
			framed: true,
			expanded: false,
			padded: true
		} );

		this.introLink = new OO.ui.ButtonWidget( {
			label: mw.msg( 'articlesandbox-moreinfo' ),
			icon: 'newWindow',
			framed: false,
			classes: [ 'articlesandbox-page-introlink' ],
			target: '_blank'
		} );

		this.$element.append(
			this.titleWidget.$element,
			this.introPanel.$element,
			this.introLink.$element,
			this.$content
		);

		// Initialize
		this.titleWidget.toggle( config.title );
		this.introPanel.toggle( config.intro );
		this.introLink.toggle( false );
	};
	OO.inheritClass( waw.ui.DialogPageLayout, OO.ui.PageLayout );

	/**
	 * Set the title for the page
	 *
	 * @param  {string} title Page title
	 */
	waw.ui.DialogPageLayout.prototype.setTitle = function ( title ) {
		this.titleWidget.setLabel( title );
		this.titleWidget.toggle( title );
	};

	/**
	 * Set or change the intro of this page.
	 * Also include an optional button to 'read more'
	 *
	 * @param  {jQuery|string} intro Page intro
	 * @param  {string} [linkToReadMore] Link to the 'read more' button.
	 *  If not given, the 'read more' button won't be displayed.
	 */
	waw.ui.DialogPageLayout.prototype.setIntro = function ( intro, linkToReadMore ) {
		this.$intro.empty().append( intro );
		this.introLink.setHref( linkToReadMore );

		this.introPanel.toggle( !!intro );
		this.introLink.toggle( !!intro && !!linkToReadMore );
	};

}() );
