Activate

    . activate

Parse a listing

    listing [listing file]

Parse a public notice; convert it to text and then read the text.

    # Convert to text
    translate [public notice file]

    # Parse and upload
    public_notice [public notice file].txt

Take a picture of the first page of the public notice and the second page of
the drawings.

    convert -geometry 1200 public_notice.pdf[0] public_notice.jpg
    convert -geometry 1200 drawings.pdf[1] drawings.jpg

Run everything, including the download from the Army corps
and the upload to the data hub site.

    run
