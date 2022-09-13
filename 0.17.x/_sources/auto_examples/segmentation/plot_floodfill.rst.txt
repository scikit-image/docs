.. only:: html

    .. note::
        :class: sphx-glr-download-link-note

        Click :ref:`here <sphx_glr_download_auto_examples_segmentation_plot_floodfill.py>`     to download the full example code or to run this example in your browser via Binder
    .. rst-class:: sphx-glr-example-title

    .. _sphx_glr_auto_examples_segmentation_plot_floodfill.py:


==========
Flood Fill
==========

Flood fill is an algorithm to identify and/or change adjacent values in an
image based on their similarity to an initial seed point [1]_. The conceptual
analogy is the 'paint bucket' tool in many graphic editors.

.. [1] https://en.wikipedia.org/wiki/Flood_fill

Basic example
-------------

First, a basic example where we will change a checkerboard square from white
to mid-gray.


.. code-block:: default


    import numpy as np
    import matplotlib.pyplot as plt
    from skimage import data, filters
    from skimage.segmentation import flood, flood_fill


    checkers = data.checkerboard()

    # Fill a square near the middle with value 127, starting at index (76, 76)
    filled_checkers = flood_fill(checkers, (76, 76), 127)

    fig, ax = plt.subplots(ncols=2, figsize=(10, 5))

    ax[0].imshow(checkers, cmap=plt.cm.gray)
    ax[0].set_title('Original')
    ax[0].axis('off')

    ax[1].imshow(filled_checkers, cmap=plt.cm.gray)
    ax[1].plot(76, 76, 'wo')  # seed point
    ax[1].set_title('After flood fill')
    ax[1].axis('off')

    plt.show()





.. image:: /auto_examples/segmentation/images/sphx_glr_plot_floodfill_001.png
    :class: sphx-glr-single-img





Advanced example
----------------

Because standard flood filling requires the neighbors to be strictly equal,
its use is limited on real-world images with color gradients and noise.
The `tolerance` keyword argument widens the permitted range about the initial
value, allowing use on real-world images.

Here we will experiment a bit on the cameraman.  First, turning his coat from
dark to light.


.. code-block:: default


    cameraman = data.camera()

    # Change the cameraman's coat from dark to light (255).  The seed point is
    # chosen as (200, 100),
    light_coat = flood_fill(cameraman, (200, 100), 255, tolerance=10)
    fig, ax = plt.subplots(ncols=2, figsize=(10, 5))

    ax[0].imshow(cameraman, cmap=plt.cm.gray)
    ax[0].set_title('Original')
    ax[0].axis('off')

    ax[1].imshow(light_coat, cmap=plt.cm.gray)
    ax[1].plot(100, 200, 'wo')  # seed point
    ax[1].set_title('After flood fill')
    ax[1].axis('off')

    plt.show()





.. image:: /auto_examples/segmentation/images/sphx_glr_plot_floodfill_002.png
    :class: sphx-glr-single-img





Because the cameraman is dark haired it also changed his hair, as well as
parts of the tripod.

Experimentation with tolerance
------------------------------

To get a better intuitive understanding of how the tolerance parameter
works, here is a set of images progressively increasing the parameter with
seed point in the upper left corner.


.. code-block:: default



    output = []

    for i in range(8):
        tol = 5 + 20*i
        output.append(flood_fill(cameraman, (0, 0), 255, tolerance=tol))

    # Initialize plot and place original image
    fig, ax = plt.subplots(nrows=3, ncols=3, figsize=(12, 12))
    ax[0, 0].imshow(cameraman, cmap=plt.cm.gray)
    ax[0, 0].set_title('Original')
    ax[0, 0].axis('off')

    # Plot all eight different tolerances for comparison.
    for i in range(8):
        m, n = np.unravel_index(i+1, (3, 3))
        ax[m, n].imshow(output[i], cmap=plt.cm.gray)
        ax[m, n].set_title('Tolerance {0}'.format(str(5 + 20*i)))
        ax[m, n].axis('off')
        ax[m, n].plot(0, 0, 'bo')  # seed point

    fig.tight_layout()
    plt.show()





.. image:: /auto_examples/segmentation/images/sphx_glr_plot_floodfill_003.png
    :class: sphx-glr-single-img





Flood as mask
-------------

A sister function, `flood`, is available which returns a mask identifying
the flood rather than modifying the image itself.  This is useful for
segmentation purposes and more advanced analysis pipelines.

Here we segment the nose of a cat.  However, multi-channel images are not
supported by flood[_fill].  Instead we Sobel filter the red channel to
enhance edges, then flood the nose with a tolerance.


.. code-block:: default


    cat = data.chelsea()
    cat_sobel = filters.sobel(cat[..., 0])
    cat_nose = flood(cat_sobel, (240, 265), tolerance=0.03)

    fig, ax = plt.subplots(nrows=3, figsize=(10, 20))

    ax[0].imshow(cat)
    ax[0].set_title('Original')
    ax[0].axis('off')

    ax[1].imshow(cat_sobel)
    ax[1].set_title('Sobel filtered')
    ax[1].axis('off')

    ax[2].imshow(cat)
    ax[2].imshow(cat_nose, cmap=plt.cm.gray, alpha=0.3)
    ax[2].plot(265, 240, 'wo')  # seed point
    ax[2].set_title('Nose segmented with `flood`')
    ax[2].axis('off')

    fig.tight_layout()
    plt.show()



.. image:: /auto_examples/segmentation/images/sphx_glr_plot_floodfill_004.png
    :class: sphx-glr-single-img






.. rst-class:: sphx-glr-timing

   **Total running time of the script:** ( 0 minutes  1.278 seconds)


.. _sphx_glr_download_auto_examples_segmentation_plot_floodfill.py:


.. only :: html

 .. container:: sphx-glr-footer
    :class: sphx-glr-footer-example


  .. container:: binder-badge

    .. image:: https://mybinder.org/badge_logo.svg
      :target: https://mybinder.org/v2/gh/scikit-image/scikit-image/v0.17.x?filepath=notebooks/auto_examples/segmentation/plot_floodfill.ipynb
      :width: 150 px


  .. container:: sphx-glr-download sphx-glr-download-python

     :download:`Download Python source code: plot_floodfill.py <plot_floodfill.py>`



  .. container:: sphx-glr-download sphx-glr-download-jupyter

     :download:`Download Jupyter notebook: plot_floodfill.ipynb <plot_floodfill.ipynb>`


.. only:: html

 .. rst-class:: sphx-glr-signature

    `Gallery generated by Sphinx-Gallery <https://sphinx-gallery.github.io>`_
