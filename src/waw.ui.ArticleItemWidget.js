( function () {
	/**
	 * Create a special item option that represents an article item.
	 *
	 * @param {string} pageName Page name
	 * @param {string} path Page path
	 * @param {string} [parentPath=''] Page parent path
	 * @param {Number} [indent=0] Indent; this dictates how many levels
	 *  of indent this page is under, in case it is in a sub-category.
	 * @constructor
	 */
	waw.ui.ArticleItemWidget = function ArticleItemWidget( pageName, path, parentPath, indent ) {
		waw.ui.ArticleItemWidget.super.call( this, { label: pageName, data: { path: path, parentPath: parentPath }, icon: 'article' } );

		this.$element
			.addClass( 'articlesandbox-articleItemWidget' )
			.css( { left: ( indent ) + 'em' } )
			.toggleClass( 'articlesandbox-articleItemWidget-indent', indent );
	};
	OO.inheritClass( waw.ui.ArticleItemWidget, OO.ui.DecoratedOptionWidget );
}() );
