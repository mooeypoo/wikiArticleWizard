( function () {
	/**
	 * Create the wizard dialog
	 *
	 * @class
	 * @extends OO.ui.ProcessDialog
	 *
	 * @constructor
	 * @param {Object} [config] Configuration options
	 */
	waw.ui.WizardDialog = function WizardDialog( config ) {
		waw.ui.WizardDialog.super.call( this, config );

		this.chosenItem = null;
		this.error = false;
	};
	OO.inheritClass( waw.ui.WizardDialog, OO.ui.ProcessDialog );
	waw.ui.WizardDialog.static.actions = [
		{ label: mw.msg( 'articlesandbox-dismiss' ), modes: [ 'articles', 'error', 'create' ], flags: 'safe' },
		{ action: 'back', label: mw.msg( 'articlesandbox-goback' ), modes: 'create', flags: 'safe', icon: 'arrowPrevious' }
	];
	waw.ui.WizardDialog.static.title = mw.msg( 'articlesandbox-title' );
	waw.ui.WizardDialog.static.name = 'articlehelperdialog';
	waw.ui.WizardDialog.static.size = 'large';

	/**
	 * Set error state for the dialog
	 *
	 * @param {string} [type='noarticles'] Error type; 'noconfig' or 'noarticles'
	 */
	waw.ui.WizardDialog.prototype.setError = function ( type ) {
		var label = type === 'noconfig' ?
			mw.msg( 'articlesandbox-error-missing-repoconfig' ) :
			$( '<span>' )
				.append(
					mw.msg( 'articlesandbox-error-missing-articles' ),
					new OO.ui.ButtonWidget( {
						flags: [ 'progressive' ],
						icon: 'newWindow',
						label: mw.msg( 'articlesandbox-error-missing-articles-gotorepo' ),
						href: mw.config.get( 'wgArticlePath' ).replace( '$1', waw.Config.ARTICLE_REPO ),
						target: '_blank'
					} ).$element
				);

		this.error = true;
		this.errorLabel.setLabel( label );
		this.showPage( 'error' );
	};

	/**
	 * @inheritdoc
	 */
	waw.ui.WizardDialog.prototype.initialize = function () {
		waw.ui.WizardDialog.super.prototype.initialize.apply( this, arguments );

		this.$articlesPage = $( '<div>' )
			.addClass( 'articlesandbox-page-articles' );
		this.$createPageForm = $( '<div>' )
			.addClass( 'articlesandbox-page-create-form' );

		this.errorLabel = new OO.ui.LabelWidget( {
			classes: [ 'articlesandbox-error' ]
		} );

		this.bookletLayout = new OO.ui.BookletLayout();
		this.bookletLayout.addPages( [
			new waw.ui.DialogPageLayout( 'error', {
				title: mw.msg( 'articlesandbox-title-error' ),
				$content: this.errorLabel.$element
			} ),
			new waw.ui.DialogPageLayout( 'articles', {
				title: mw.msg( 'articlesandbox-create-article' ),
				$content: this.$articlesPage
			} ),
			new waw.ui.DialogPageLayout( 'create', {
				$content: $( '<div>' )
					.addClass( 'articlesandbox-page-create' )
					.append( this.$createPageForm )
			} )
		] );

		this.$body.append( this.bookletLayout.$element );
	};

	/**
	 * @inheritdoc
	 */
	waw.ui.WizardDialog.prototype.getActionProcess = function ( action ) {
		if ( action === 'back' ) {
			this.showPage( 'articles' );
		}
		return waw.ui.WizardDialog.super.prototype.getActionProcess.call( this, action );
	};

	/**
	 * @inheritdoc
	 */
	waw.ui.WizardDialog.prototype.getSetupProcess = function ( data ) {
		return waw.ui.WizardDialog.super.prototype.getSetupProcess.call( this, data )
			.next( function () {
				if ( this.error ) {
					this.showPage( 'error' );
				} else {
					this.showPage( 'articles' );
				}
			}, this );
	};

	/**
	 * Show a specific page in the dialog
	 *
	 * @param {string} [name='articles'] Page name; 'articles', 'create' or 'error'
	 */
	waw.ui.WizardDialog.prototype.showPage = function ( name ) {
		name = name || 'articles';

		this.bookletLayout.setPage( name );
		this.getActions().setMode( name );
	};

	/**
	 * Respond to 'choose' event from any of the list widgets.
	 *
	 * @param {OO.ui.OptionWidget} item Chosen item
	 */
	waw.ui.WizardDialog.prototype.onArticleListChoose = function ( item ) {
		var promise,
			dialog = this,
			data = item.getData();

		this.chosenItem = item;

		// Get the data from parent section
		if ( data.parentPath ) {
			promise = waw.Utils.getRestbasePage( data.path );
		} else {
			promise = $.Deferred().resolve( '' ).promise();
		}

		this.pushPending();
		promise.then( function ( $intro ) {
			var currPage;

			dialog.$createPageForm.empty().append( waw.Utils.buildCreatePageForm( data.path ) );
			dialog.showPage( 'create' );

			currPage = dialog.bookletLayout.getCurrentPage();
			currPage.setTitle( mw.msg( 'articlesandbox-create-article-for', item.getLabel() ) );
			currPage.setIntro( $intro );

			dialog.popPending();
		} );
	};

	/**
	 * Build the content based on the article structure given
	 *
	 * @param {Object} articles Article structure with paths
	 * @param {jQuery} [$introContent] A jQuery object for the intro
	 */
	waw.ui.WizardDialog.prototype.buildContent = function ( articles, $introContent ) {
		var introLink = new OO.ui.ButtonWidget( {
				label: mw.msg( 'articlesandbox-moreinfo' ),
				icon: 'newWindow',
				framed: false,
				href: mw.config.get( 'wgArticlePath' ).replace( '$1', waw.Config.ARTICLE_REPO ),
				target: '_blank'
			} ),
			list = new OO.ui.SelectWidget( {
				classes: [ 'articlesandbox-articles-section-list' ]
			} );

		if ( $introContent ) {
			this.$articlesPage.append(
				new OO.ui.PanelLayout( {
					$content: $introContent,
					classes: [ 'articlesandbox-page-intro' ],
					framed: true,
					expanded: false,
					padded: true
				} ).$element,
				introLink.$element
			);
		}

		// Events
		list.on( 'choose', this.onArticleListChoose.bind( this ) );

		// Create the list
		Object.keys( articles ).forEach( function ( page ) {
			// eslint-disable-next-line no-underscore-dangle
			var items = waw.Utils.buildItemsSection( page, articles[ page ]._articles, articles[ page ]._path, 0 );
			list.addItems( items );
		} );

		// Append to articles page
		this.$articlesPage.append( list.$element );
	};

	/**
	 * @inheritdoc
	 */
	waw.ui.WizardDialog.prototype.getBodyHeight = function () {
		// 50% height of window
		// TODO: Figure out how to make the height variable
		// every time a page is switched
		return $( window ).height() * 0.7;
	};

}() );
