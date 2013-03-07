**Scott**'s goal is to automate the tedious parts of
[Scott](http://healthygulf.org/who-we-are/staff/)'s
job so that he has time to do the important parts.

## How to

Clone with submodules

    git clone git@github.com:tlevine/scott.git --recursive

Install dependencies

    # For the server
    (
      cd server
      npm install
    )

    # For the reader
    (
      cd reader
      sudo pip2 install -r requirements.txt
    )

    # In Arch
    sudo pacman -S python2-lxml python2-cssselect \
      tesseract-data-eng tesseract coffee-script \
      poppler imagemagick git

    # In Ubuntu 12.04
    echo Install node 0.8 from source. Then,
    sudo apt-get install python-lxml tesseract-ocr tesseract-ocr-eng \
      coffeescript git poppler-utils imagemagick

`server` contains a restify web server, and `client`
contains a Backbone application. The server also serves
the client files. Serve the site like so

    ./serve

It expects a database to be in /tmp/wetlands.db. This
often ram, so you might need to put one there.

## Useful stuff

* [Automatic permit application data](http://wetlands.thomaslevine.com)
* [Parish coordinates](https://twitter.com/ian_villeda/status/267334042507169793)

## Network of servers
I want to run this across three or four computers/providers.

1. One serves the node application. Anything that is not explicitly mentioned
    as running somewhere else runs from this computer
2. One runs the downloader/reader. It inserts the extracted data into the node
    application through the REST API. It pushes the new files to GitHub or
    BitBucket
3. Primary documents are served from GitHub or BitBucket rather than
    from the the local disk.
4. The database could be separate if that makes things easier.

In practice, I really only use two.

1. One (`server`) serves the node application, the downloader/reader, the database
    and the primary documents
2. A second (`desk`) coordinates backups; it periodically pulls the documents and
    listings submodules and the logs directory and then pushes those to external
    git repository hosting services.
