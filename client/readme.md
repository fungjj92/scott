# Idea for making this snappier

When you load `index.html`, regardless of what the hash thingy is, you fetch
these pages in this order.

1. The page you are on
2. The home page
3. The applications list with only the fields for the list page
4. The applications list with all of the fields, but only for the applications that are likely to be opened.

After this initial retrieval, the fourth of these pages is periodically
retrieved. Maybe I save the last retrieval datetime and on `click *`
(clicking anything), I download again if the last retrieval datetime is
more than a minute ago. Or actually maybe I just check for changes
every ten seconds.

The only times that you wait on something to download are when you go to
the list or a particular application long after it has last loaded and
when you click the manual update button.
