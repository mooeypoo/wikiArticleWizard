( function () {
	/**
	 * Define a set of utility functions and values
	 *
	 * @return {Objects}
	 */
	waw.Utils = ( function () {
		/**
		 * Translate from the structure given by the prefixsearch API to
		 * the required hierarchical article structure and paths that
		 * the wikiArticleWizard expects
		 *
		 * @param  {Object} apiPrefixSearch API result
		 * @param  {string} repository Name of the base repository
		 * @return {Object} Article structure
		 */
		var getArticleStrctureFromPrefixSearch = function ( apiPrefixSearch, repository ) {
				var path, flatPath,
					articles = {};

				apiPrefixSearch.forEach( function ( articleData ) {
					var pieces = [],
						title = articleData.title;

					if ( title.indexOf( repository ) !== 0 ) {
						return;
					}

					pieces = title.replace( repository, '' ).split( '/' );
					pieces = pieces.filter( function ( piece ) {
						return !!piece; // Get rid of empty strings
					} );

					// Build article structure
					path = articles;
					flatPath = '';
					pieces.forEach( function ( piece ) {
						flatPath += '/' + piece;

						path[ piece ] = path[ piece ] || {
							_path: repository + flatPath,
							_articles: {}
						};

						// Shift reference
						// eslint-disable-next-line no-underscore-dangle
						path = path[ piece ]._articles;
					} );
				} );
				return articles;
			},
			/**
			 * Fetch the details from the API and build the base article
			 * structure the system is expecting, in the form of a hierarchical
			 * object representing sections and their sub-pages.
			 *
			 * @param {string} repository Path to the article repository
			 * @return {Object} Article structure
			 */
			buildArticleStructure = function ( repository ) {
				var utils = this;

				if ( !repository ) {
					return $.Deferred().reject( 'noconfig' );
				}

				return ( new mw.Api() ).get( {
					action: 'query',
					format: 'json',
					list: 'prefixsearch',
					pssearch: repository
				} ).then(
					// Success
					function ( queryData ) {
						var articles = utils.getArticleStrctureFromPrefixSearch(
							queryData.query.prefixsearch,
							repository
						);

						if ( $.isEmptyObject( articles ) ) {
							return $.Deferred().reject( 'noarticles' );
						}

						return articles;
					},
					function () {
						return $.Deferred().reject( 'noarticles' );
					}
				);
			},
			/**
			 * Fetch the HTML contents of a given wiki page from restbase
			 *
			 * @param  {string} page Page name
			 * @return {jQuery} HTML content of the page body
			 */
			getRestbasePage = function ( page ) {
				return mw.libs.ve.targetLoader.requestParsoidData( page, {} )
					.then(
						function ( response ) {
							var content = response.visualeditor.content,
								doc = new DOMParser().parseFromString( content, 'text/html' );

							// TODO: Consider re-adding the body classes so the
							// inner classes will be represented properly; otherwise
							// images and some templates are not floated correctly
							// in the preview
							return $( doc.body.childNodes );
						},
						// Failure
						function () {
							OO.ui.alert( mw.msg( 'articlesandbox-error-restbase-preview' ) );

							// Resolve with an error message
							return $.Deferred().resolve(
								$( '<span>' )
									.append( mw.msg( 'articlesandbox-error-restbase-preview-content' ) )
							);
						}
					);
			},
			/**
			 * Create an array of article items preceeded by a section item per section
			 * in the article structure.
			 *
			 * Recursively adds sections with the respective indent for representation
			 * in the end result list.
			 *
			 * @param {string} title Section title
			 * @param {Object} articles Article structure object
			 * @param {string} sectionPath A full path for the parent section
			 * @param {number} [indent=0] The indentation of this section, if it is a sub-section
			 * @return {waw.ui.ArticleItemWidget[]} An array of items and section items representing
			 *  the section and its sub sections
			 */
			buildItemsSection = function ( title, articles, sectionPath, indent ) {
				var utils = this,
					items = [],
					pages = articles ? Object.keys( articles ) : [],
					sectionTitle = new waw.ui.ArticleSectionWidget( title, indent );

				indent = indent || 0;

				// Add title
				if ( title ) {
					items.push( sectionTitle );
				}

				// Look for sub sections and items
				pages.forEach( function ( page ) {
					// eslint-disable-next-line no-underscore-dangle
					if ( !$.isEmptyObject( articles[ page ]._articles ) ) {
						// This is a sub-section, recurse
						// eslint-disable-next-line no-underscore-dangle
						items.concat( utils.buildItemsSection( page, articles[ page ]._articles, articles[ page ]._path, indent + 1 ) );
					} else {
						// This is a direct child
						items.push(
							new waw.ui.ArticleItemWidget(
								page,
								// eslint-disable-next-line no-underscore-dangle
								articles[ page ]._path,
								sectionPath,
								indent
							)
						);
					}
				} );

				return items;
			},
			/**
			 * Build the 'create page' form.
			 * This will be updated with details from the item as it is chosen
			 *
			 * @param {string} itemPath Path to the article this item represents
			 * @return {jQuery} Form jQuery object with the relevant data in the
			 *  fields.
			 */
			buildCreatePageForm = function ( itemPath ) {
				var makeHiddenInput = function ( name, value ) {
						return $( '<input>' )
							.attr( 'type', 'hidden' )
							.attr( 'name', name )
							.attr( 'value', value );
					},
					titleInput = new OO.ui.TextInputWidget( {
						name: 'visibletitle',
						// name: 'title',
						placeholder: mw.msg( 'articlesandbox-create-input-placeholder' )
					} ),
					errorLabel = new OO.ui.LabelWidget( {
						classes: [ 'articlesandbox-create-titleerror' ],
						label: mw.msg( 'articlesandbox-error-badtitle' )
					} ),
					submit = new OO.ui.ButtonInputWidget( {
						type: 'submit',
						icon: 'add',
						flags: [ 'progressive' ],
						label: mw.msg( 'articlesandbox-create-button' )
					} ),
					$hiddenTitle = makeHiddenInput( 'title' ),
					// Mock a inputbox process
					$form = $( '<form>' )
						.attr( 'action', '/w/index.php' )
						.attr( 'method', 'get' )
						.append(
							makeHiddenInput( 'veaction', 'edit' ),
							$hiddenTitle,
							makeHiddenInput( 'preload', itemPath ),
							makeHiddenInput( 'summary', mw.msg( 'articlesandbox-create-articlesummary' ) ),
							makeHiddenInput( 'prefix', 'Special:MyPage/' + waw.Config.NAME_FOR_SANDBOX + '/' )
						);

				errorLabel.toggle( false );
				submit.setDisabled( true );

				titleInput.on( 'change', function ( val ) {
					var valid = !!mw.Title.newFromText( val );

					titleInput.setValidityFlag( valid );
					submit.setDisabled( !valid );
					errorLabel.toggle( !valid );
					$hiddenTitle.attr( 'value', 'Special:MyPage/' + waw.Config.NAME_FOR_SANDBOX + '/' + titleInput.getValue() );
				} );

				$form.append(
					titleInput.$element,
					errorLabel.$element,
					submit.$element
				);

				return $form;
			};

		// Public methods
		return {
			buildArticleStructure: buildArticleStructure,
			getRestbasePage: getRestbasePage,
			buildItemsSection: buildItemsSection,
			buildCreatePageForm: buildCreatePageForm,
			getArticleStrctureFromPrefixSearch: getArticleStrctureFromPrefixSearch
		};
	}() );
}() );
