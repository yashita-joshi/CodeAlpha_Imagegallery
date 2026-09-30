# Frames

A small photo gallery I made using HTML, CSS and JavaScript. The photos are my own, from my Mussoorie trip, some food I liked, and flowers I clicked around.

## What it does
- Photos are shown in a grid with different heights (a masonry-type layout)
- Buttons at the top filter the photos by category: Mussoorie, Food and Flowers
- Clicking a photo opens it bigger in a lightbox
- In the lightbox you can go to the next or previous photo with the buttons, the left/right arrow keys, or by swiping on a phone
- Esc or clicking outside the photo closes it
- Hover effects on the photos and a fade when you change the filter
- Layout changes for phone, tablet and laptop screens (1, 2 or 3 columns)

## Built with
- HTML for the structure
- CSS for the layout, hover effects and transitions
- JavaScript for the filters and the lightbox (no libraries or frameworks)

## How to run it
Download or clone this repo and open `index.html` in any browser. No installation needed.

## Files
- `index.html` - page structure
- `style.css` - all the styling
- `script.js` - the photo list, filters and lightbox
- `images/` - the photos

## Adding more photos
Put the photo in the `images` folder and add one line for it in the `PHOTOS` list at the top of `script.js` with its file name, width, height, title and category.

## What I learned
Getting the lightbox to go through only the photos of the selected category was the trickiest part. I also learned how to make a layout respond to screen size and how to use git to push a project to GitHub.