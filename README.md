# wikiArticleWizard
#### A script to allow wiki communities to create dynamic wizards for contributing content through article skeletons

First introduced in the [2018 Wikimedia Hackathon in Barcelona](https://www.mediawiki.org/wiki/Wikimedia_Hackathon_2018).

## Installation
This script is meant, for the moment, to be a user script on wikis.

[](#installing-wikimedia-wikis)
### Installation for Wikimedia wikis
For Wikimedia-run wikis, the script is maintained on MediaWiki.org and can be loaded directly by adding it to your `User:YourUsername/common.js` with the following:

```javacript
// Set up your article repository
mw.config.set( 'articlesandbox-article-repo', '[PAGE NAME FOR THE TOP LEVEL OF THE ARTICLE REPOSITORY]' );
// Load the script
mw.loader.load('//www.mediawiki.org/w/index.php?title=User:Mooeypoo/wikiArticleWizard.js&action=raw&ctype=text/javascript');
```

### Installation for Non Wikimedia wikis
If you want to add this to your non-Wikimedia wiki, you should first build the full script, then put it on your wiki for your users to load (or for the wiki to load automatically in its general `common.js` as you choose).

See [Insalling for local use and contribution](#installing-local)

[](#installing-local)
### Installing for local use and contribution
If you want to use this locally for testing, or to contribute to the script, or to produce the full user script to be copied into a wiki, you'll need to first build the full script itself:

1. Clone the repo
2. In the repo directory:
	a. Run `npm install`
	b. Run `grunt build` to build the final script
3. Copy the code from `dist/wikiArticleWizard.userscript.js` into the wiki

This is also useful for testing.

Note: Because this script is already available on mediawiki.org, any Wikimedia-operated wikis will automatically gain an update if they use the original script. See [Installation for Wikimedia wikis](#installing-wikimedia-wikis)

## On-wiki usage
The script relies on having an article repository on the wiki to display article skeletons for users. In order to provide and control that, you should decide where the article templates/skeletons reside first, then create an initial page with this structure.

The system then reads, automatically, the structure of the sub-pages of that page to display the hierarchy of the article skeletons, and some information for the users:

1. The original page of the article repository contains information that is displayed on the first screen of the wizard. (A welcome message, etc)
2. Any sub-page of the original page is then looked at to build the skeleton:
	a. If a sub-page has sub-pages of its own, that page is considered a category of skeleton articles.
	b. Any page that is a "leaf" (has no sub-pages of its own) is considered a skeleton and will be offered to the user as a pre-filled new article.

For example, if our article repository is at `MediaWiki:ArticleWizard`:

- `MediaWiki:ArticleWizard` page contains a welcome message
- `MediaWiki:ArticleWizard/Person` is a category of skeleton articles. Its content doesn't matter.
- `MediaWiki:ArticleWizard/Person/Singer` is a skeleton article; it will appear as an option to the user, and its content will be used as the pre-filled content for the new article.
- `MediaWiki:ArticleWizard/Person/Artist` is a skeleton article; it will appear as an option to the user, and its content will be used as the pre-filled content for the new article.
- `MediaWiki:ArticleWizard/Animal` is a category of skeleton articles. Its content doesn't matter.
- `MediaWiki:ArticleWizard/Animal/Dog` is a skeleton article; it will appear as an option to the user, and its content will be used as the pre-filled content for the new article.
- etc

**Note:** You could continue with sub-categories, but overdoing that is not advised, as they tend to look very weird in the wizard itself.

## Contribute
For the moment, this tool is a user script. Because user scripts and gadgets don't go through any of our usual CI, the code is hosted here with tests, linting, and tools that help proper development.

* To pull this locally for development, please clone the repository and run `npm install`
* To test the final script, run `grunt build` which will produce a distribution file that can be copy/pasted as a user script on local wiki for testing.

If there is much need and use for this tool, it may become an extension and be transferred to the normal Gerrit code hosting.

**This is a collaborative effort -- please feel free to contribute pull requests and/or submit issues!**

## Credits
This script was initially based on the idea of [{{User sandbox+}}](https://en.wikipedia.org/wiki/Template:User_sandbox%2B) on English Wikipedia, by [User:ManosHacker](https://en.wikipedia.org/wiki/User:ManosHacker)

There was a request to bring this tool to other communities, which created the need to create something scalable and translatable. This is how **wikiArticleWizard** was born.
