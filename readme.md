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
    sudo pacman -S python2-lxml python2-cssselect \
      tesseract-data-eng tesseract
    (
      cd reader
      sudo pip2 install -r requirements.txt
    )

`server` contains a restify web server, and `client`
contains a Backbone application. The server also serves
the client files. Serve the site like so

    ./serve

It expects a database to be in /tmp/wetlands.db. This
often ram, so you might need to put one there.

## Useful stuff

* [Automatic permit application data](http://wetlands.thomaslevine.com)
* [Parish coordinates](https://twitter.com/ian_villeda/status/267334042507169793)
