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

During development, it expects a database to be in /tmp/wetlands.db.
This often ram, so you might need to put one there.

## Useful stuff

* [Automatic permit application data](http://wetlands.thomaslevine.com)
* [Parish coordinates](https://twitter.com/ian_villeda/status/267334042507169793)

## Network of servers
This is run across two computers.

1. One (`server`) serves the node application, the downloader/reader, the database
    and the primary documents
2. A second (`desk`) coordinates backups; it periodically pulls the documents and
    listings submodules and the logs directory and then pushes those to external
    git repository hosting services.

## Downloading old documents

## Download of old documents
You can see all the previous permit applications
[here](https://github.com/tlevine/mvn-www2-backup)
(except for a couple that went missing).

If you want to integrate them with your csv file,
switch everything in the respective urls before the
final (sixth) slash for
"`https://raw.github.com/tlevine/mvn-www2-backup/master/documents`"

For example,
[`http://www2.mvn.usace.army.mil/ops/regulatory/pdf/document2011-09-09-103911.pdf`](http://www2.mvn.usace.army.mil/ops/regulatory/pdf/document2011-09-09-103911.pdf)
becomes
[`https://raw.github.com/tlevine/mvn-www2-backup/master/documents/document2011-09-09-103911.pdf`](https://raw.github.com/tlevine/mvn-www2-backup/master/documents/document2011-09-09-103911.pdf)

You can also download them all at once
[here](https://github.com/tlevine/mvn-www2-backup/archive/master.zip)

