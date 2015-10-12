Sencha generation
=================


    sencha -sdk /path/to/ext6/distro generate workspace .
    sencha -sdk ext generate app InsistentBackoffice ./insistent-backoffice

This will create both modern and classic application under same soruces code. 
Do not use `sencha generate app --classic InsistentBackoffice ./insistent-backoffice`

Constellation
=============
Check current state of the httpd links.

    ls -lat ~/Sites/

* Linking backoffice to macos http server, no separate linking to Ext distro or build.


    rm ~/Sites/ibo-dev
    ln -ns /Users/user1/dev/github/insistent-io/src/sencha/extjs6 /Users//user1/Sites/iio-ext6
    ln -ns /Users/user1/dev/github/insistent-io/src/sencha/extjs6/build/testing/InsistentBackoffice /Users/user1/Sites/ibo-test
    ln -ns /Users/user1/dev/github/insistent-io/src/sencha/extjs6/build/production/InsistentBackoffice /Users/user1/Sites/ibo-prod

* Browser links (to bookmarks)


    http://localhost/~user1/iio-ext6/insistent-backoffice/?debug&classic
    http://localhost/~user1/ibo-test/?classic or http://localhost/~user1/ibo-test/?modern
    http://localhost/~user1/ibo-prod/?classic or http://localhost/~user1/ibo-prod/?modern

