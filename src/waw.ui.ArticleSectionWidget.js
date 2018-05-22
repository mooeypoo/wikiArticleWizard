( function () {
	/**
	 * Create a section title inside the article list to represent hierarchical
	 * and categorized article items
	 *
	 * @class
	 * @extends OO.ui.MenuSectionOptionWidget
	 *
	 * @constructor
	 * @param {string} pageName Page name
	 * @param {Number} [indent=0] Indent; this dictates how many levels
	 *  of indent this page is under, in case it is in a sub-category.
	 * @param {Object} [config] Optional configuration options
	 */
	waw.ui.ArticleSectionWidget = function ArticleSectionWidget( pageName, indent, config ) {
		waw.ui.ArticleSectionWidget.super.call( this, $.extend( { label: pageName }, config ) );

		this.$element
			.addClass( 'articlesandbox-articleSectionWidget' )
			.css( { left: ( indent ) + 'em' } )
			.toggleClass( 'articlesandbox-articleSectionWidget-indent', indent );
	};
	OO.inheritClass( waw.ui.ArticleSectionWidget, OO.ui.MenuSectionOptionWidget );
}() );
