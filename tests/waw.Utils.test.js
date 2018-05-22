( function () {
	QUnit.module( 'MenuTagMultiselectWidget' );

	QUnit.test( 'getArticleStrctureFromPrefixSearch', function ( assert ) {
		var cases = [
			{
				msg: 'Structure with sub pages and a dangling page (no parent result)',
				repo: 'Namespace:Something',
				input: [
					{ ns: 1, pageid: 1234, title: 'Namespace:Something' },
					{ ns: 1, pageid: 1235, title: 'Namespace:Something/Page' },
					{ ns: 1, pageid: 1236, title: 'Namespace:Something/Page/subpage' },
					{ ns: 1, pageid: 1237, title: 'Namespace:Something/Page/subpage/subsubpage' },
					{ ns: 1, pageid: 1238, title: 'Namespace:Something/Foo/bar/dangling' }
				],
				expected: {
					Page: {
						_path: 'Namespace:Something/Page',
						_articles: {
							subpage: {
								_articles: {
									subsubpage: {
										_path: 'Namespace:Something/Page/subpage/subsubpage',
										_articles: {}
									}
								},
								_path: 'Namespace:Something/Page/subpage'
							}
						}
					},
					Foo: {
						_articles: {
							_path: 'Namespace:Something/Foo',
							bar: {
								_path: 'Namespace:Something/Foo/bar',
								_articles: {
									dangling: {
										_articles: {},
										_path: 'Namespace:Something/Foo/bar/dangling'
									}
								}
							}
						}
					}
				}
			}
		];

		cases.forEach( function ( testCase ) {
			assert.deepEqual(
				waw.Utils.getArticleStrctureFromPrefixSearch( testCase.input, testCase.repo ),
				testCase.expected,
				testCase.msg
			);
		} );
	} );
}() );
