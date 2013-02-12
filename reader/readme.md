# Automatically loading permit application data into Scott

## How to use

Activate

    . activate

Parse a listing, and upload it.

    listing [listing file]

Parse a public notice; convert it to text and then read the text.

    # Convert to text
    translate [public notice file]

    # Parse and upload
    public_notice [public notice file].txt

Take a picture of the first page of the public notice and the second page of
the drawings. XXX: We're not doing this anymore because it doesn't always work.

    convert -geometry 1200 public_notice.pdf[0] public_notice.jpg
    convert -geometry 1200 drawings.pdf[1] drawings.jpg

Run everything, including the download from the Army corps
and the upload to the data hub site.

    run

## Batch loading data

All source files are saved, and you can load them all with this script.

    . activate
    batch_listings
    batch_public_notices

The source files were previously downloaded, and they have been named in the
new format, which isn't that different from the old one. This migration was
useful for loading those data.
