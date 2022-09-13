
   function insert_gallery() {
       var images = ['http://scikits-image.org/docs/dev/_images/plot_contours.png', 'http://scikits-image.org/docs/dev/_images/plot_equalize.png', 'http://scikits-image.org/docs/dev/_images/plot_convex_hull.png', 'http://scikits-image.org/docs/dev/_images/plot_canny.png', 'http://scikits-image.org/docs/dev/_images/plot_gabors_from_lena.png'];
       var links = ['http://scikits-image.org/docs/dev/auto_examples/plot_contours.html', 'http://scikits-image.org/docs/dev/auto_examples/plot_equalize.html', 'http://scikits-image.org/docs/dev/auto_examples/plot_convex_hull.html', 'http://scikits-image.org/docs/dev/auto_examples/plot_canny.html', 'http://scikits-image.org/docs/dev/auto_examples/plot_gabors_from_lena.html'];

       ix = Math.floor(Math.random() * images.length);
       document.write(
'<div class="gallery_image">      <a href="URL"><img src="IMG"/></a></div>'.replace('IMG', images[ix]).replace('URL', links[ix])
       );

       console.log('<div class="gallery_image">      <a href="URL"><img src="IMG"/></a></div>'.replace('IMG', images[ix]).replace('URL', links[ix]));
   };

