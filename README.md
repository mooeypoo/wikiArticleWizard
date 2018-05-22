= wikiArticleWizard
== A script to allow wiki communities to create dynamic wizards for contributing content through article skeletons

It was introduced in the [2018 Wikimedia Hackathon in Barcelona](https://www.mediawiki.org/wiki/Wikimedia_Hackathon_2018).

== Contribute ==
For the moment, this tool is a user script. Because user scripts and gadgets don't go through any of our usual CI, the code is hosted here with tests, linting, and tools that help proper development.

To pull this locally for development, please clone the repository and run `npm install`

To test the final script, run `grunt build` which will produce a distribution file that can be copy/pasted as a user script on local wiki for testing.

If there is much need and use for this tool, it may become an extension and be transferred to the normal Gerrit code hosting.

**This is a collaborative effort -- please feel free to contribute pull requests and/or submit issues!**

== Credits ==
This script was initially based on the idea of [{{User sandbox+}}](https://en.wikipedia.org/wiki/Template:User_sandbox%2B) on English Wikipedia, by [User:ManosHacker](https://en.wikipedia.org/wiki/User:ManosHacker)

There was a request to bring this tool to other communities, which created the need to create something scalable and translatable. This is how **wikiArticleWizard** was born.
