.. note::
    :class: sphx-glr-download-link-note

    Click :ref:`here <sphx_glr_download_auto_examples_transform_plot_masked_register_translation.py>` to download the full example code
.. rst-class:: sphx-glr-example-title

.. _sphx_glr_auto_examples_transform_plot_masked_register_translation.py:


===================================
Masked Normalized Cross-Correlation
===================================

In this example, we use the masked normalized cross-correlation to identify the relative shift
between two similar images containing invalid data.

In this case, the images cannot simply be masked before computing the cross-correlation, 
as the masks will influence the computation. The influence of the masks must be removed from
the cross-correlation, as is described in [1]_.

In this example, we register the translation between two images. However, one of the 
images has about 25% of the pixels which are corrupted.

.. [1] D. Padfield, "Masked object registration in the Fourier domain" 
       IEEE Transactions on Image Processing (2012). :DOI:`10.1109/TIP.2011.2181402`




.. code-block:: python

    import numpy as np
    import matplotlib.pyplot as plt

    from skimage import data, draw
    from skimage.feature import masked_register_translation
    from scipy import ndimage as ndi







Define areas of the image which are invalid.
Probability of an invalid pixel is 25%.
This could be due to a faulty detector, or edges that
are not affected by translation (e.g. moving object in a window).
See reference paper for more examples



.. code-block:: python

    image = data.camera()
    shift = (-22, 13)

    corrupted_pixels = np.random.choice([False, True], 
                                        size = image.shape, 
                                        p = [0.25, 0.75])

    # The shift corresponds to the pixel offset relative to the reference image
    offset_image = ndi.shift(image, shift)
    offset_image *= corrupted_pixels
    print("Known offset (row, col): {}".format(shift))

    # Determine what the mask is based on which pixels are invalid
    # In this case, we know what the mask should be since we corrupted 
    # the pixels ourselves
    mask = corrupted_pixels

    detected_shift = masked_register_translation(image, offset_image, mask)

    print("Detected pixel offset (row, col): {}".format(-detected_shift))

    fig = plt.figure(figsize=(8, 3))
    ax1 = plt.subplot(1, 3, 1)
    ax2 = plt.subplot(1, 3, 2, sharex=ax1, sharey=ax1)
    ax3 = plt.subplot(1, 3, 3, sharex=ax1, sharey=ax1)

    ax1.imshow(image, cmap='gray')
    ax1.set_axis_off()
    ax1.set_title('Reference image')

    ax2.imshow(offset_image.real, cmap='gray')
    ax2.set_axis_off()
    ax2.set_title('Corrupted, offset image')

    ax3.imshow(mask, cmap='gray')
    ax3.set_axis_off()
    ax3.set_title('Masked pixels')


    plt.show()




.. image:: /auto_examples/transform/images/sphx_glr_plot_masked_register_translation_001.png
    :class: sphx-glr-single-img


.. rst-class:: sphx-glr-script-out

 Out:

 .. code-block:: none

    Known offset (row, col): (-22, 13)
    Detected pixel offset (row, col): [-22.  13.]


Solid masks are another illustrating example. In this case, we have a 
limited view of an image and an offset image. The masks for these images 
need not be the same. The `masked_register_translation` function will correctly identify
which part of the images should be compared.



.. code-block:: python

    image = data.camera()
    shift = (-22, 13)

    rr1, cc1 = draw.ellipse(259, 248, 
                          r_radius = 125, c_radius = 100, 
                          shape = image.shape)

    rr2, cc2 = draw.ellipse(300, 200, 
                            r_radius = 110, c_radius = 180, 
                            shape = image.shape)

    mask1 = np.zeros_like(image, dtype = np.bool)
    mask2 = np.zeros_like(image, dtype = np.bool)
    mask1[rr1, cc1] = True
    mask2[rr2, cc2] = True

    offset_image = ndi.shift(image, shift)
    image *= mask1
    offset_image *= mask2

    print("Known offset (row, col): {}".format(shift))

    detected_shift = masked_register_translation(image, offset_image, mask1, mask2)

    print("Detected pixel offset (row, col): {}".format(-detected_shift))

    fig = plt.figure(figsize=(8,3))
    ax1 = plt.subplot(1, 2, 1)
    ax2 = plt.subplot(1, 2, 2, sharex=ax1, sharey=ax1)

    ax1.imshow(image, cmap='gray')
    ax1.set_axis_off()
    ax1.set_title('Reference image')

    ax2.imshow(offset_image.real, cmap='gray')
    ax2.set_axis_off()
    ax2.set_title('Masked, offset image')

    plt.show()


.. image:: /auto_examples/transform/images/sphx_glr_plot_masked_register_translation_002.png
    :class: sphx-glr-single-img


.. rst-class:: sphx-glr-script-out

 Out:

 .. code-block:: none

    Known offset (row, col): (-22, 13)
    Detected pixel offset (row, col): [-22.  13.]


**Total running time of the script:** ( 0 minutes  1.721 seconds)


.. _sphx_glr_download_auto_examples_transform_plot_masked_register_translation.py:


.. only :: html

 .. container:: sphx-glr-footer
    :class: sphx-glr-footer-example



  .. container:: sphx-glr-download

     :download:`Download Python source code: plot_masked_register_translation.py <plot_masked_register_translation.py>`



  .. container:: sphx-glr-download

     :download:`Download Jupyter notebook: plot_masked_register_translation.ipynb <plot_masked_register_translation.ipynb>`


.. only:: html

 .. rst-class:: sphx-glr-signature

    `Gallery generated by Sphinx-Gallery <https://sphinx-gallery.readthedocs.io>`_
