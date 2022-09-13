.. only:: html

    .. note::
        :class: sphx-glr-download-link-note

        Click :ref:`here <sphx_glr_download_auto_examples_transform_plot_transform_types.py>`     to download the full example code or to run this example in your browser via Binder
    .. rst-class:: sphx-glr-example-title

    .. _sphx_glr_auto_examples_transform_plot_transform_types.py:


===================================
Types of homographies
===================================

`Homographies <https://en.wikipedia.org/wiki/Homography>`_
are transformations of a Euclidean space that preserve the alignment of points.
Specific cases of homographies correspond to the conservation of more
properties, such as parallelism (affine transformation), shape (similar
transformation) or distances (Euclidean transformation).

Homographies on a 2D Euclidean space (i.e., for 2D grayscale or multichannel
images) are defined by a 3x3 matrix. All types of homographies can be defined
by passing either the transformation matrix, or the parameters of the simpler
transformations (rotation, scaling, ...) which compose the full transformation.

The different types of homographies available in scikit-image are
shown here, by increasing order of complexity (i.e. by reducing the number of
constraints). While we focus here on the mathematical properties of
transformations, tutorial
:ref:`sphx_glr_auto_examples_transform_plot_geometric.py` explains how to use
such transformations for various tasks such as image warping or parameter
estimation.


.. code-block:: default

    import math
    import numpy as np
    import matplotlib.pyplot as plt

    from skimage import data
    from skimage import transform
    from skimage import img_as_float








Euclidean (rigid) transformation
=================================

A `Euclidean transformation <https://en.wikipedia.org/wiki/Rigid_transformation>`_,
also called rigid transformation, preserves the Euclidean distance between
pairs of points. It can be described as a rotation about the origin
followed by a translation.


.. code-block:: default


    tform = transform.EuclideanTransform(
        rotation=np.pi / 12.,
        translation = (100, -20)
        )
    print(tform.params)





.. rst-class:: sphx-glr-script-out

 Out:

 .. code-block:: none

    [[  0.96592583  -0.25881905 100.        ]
     [  0.25881905   0.96592583 -20.        ]
     [  0.           0.           1.        ]]




Now let's apply this transformation to an image. Because we are trying
to reconstruct the *image* after transformation, it is not useful to see
where a *coordinate* from the input image ends up in the output, which is
what the transform gives us. Instead, for every pixel (coordinate) in the
output image, we want to figure out where in the input image it comes from.
Therefore, we need to use the inverse of ``tform``, rather than ``tform``
directly.


.. code-block:: default


    img = img_as_float(data.chelsea())
    tf_img = transform.warp(img, tform.inverse)
    fig, ax = plt.subplots()
    ax.imshow(tf_img)
    _ = ax.set_title('Euclidean transformation')




.. image:: /auto_examples/transform/images/sphx_glr_plot_transform_types_001.png
    :class: sphx-glr-single-img





For a rotation around the center of the image, one can 
compose a translation to change the origin, a rotation, and finally
the inverse of the first translation.


.. code-block:: default


    rotation = transform.EuclideanTransform(rotation=np.pi/3)
    shift = transform.EuclideanTransform(translation=-np.array(img.shape[:2]) / 2)
    # Compose transforms by multiplying their matrices
    matrix = np.linalg.inv(shift.params) @ rotation.params @ shift.params
    tform = transform.EuclideanTransform(matrix)
    tf_img = transform.warp(img, tform.inverse)
    fig, ax = plt.subplots()
    _ = ax.imshow(tf_img)




.. image:: /auto_examples/transform/images/sphx_glr_plot_transform_types_002.png
    :class: sphx-glr-single-img





Similarity transformation
=================================

A `similarity transformation <https://en.wikipedia.org/wiki/Similarity_(geometry)>`_
preserves the shape of objects. It combines scaling, translation and rotation.


.. code-block:: default


    tform = transform.SimilarityTransform(
        scale=0.5,
        rotation=np.pi/12,
        translation=(100, 50))
    print(tform.params)
    tf_img = transform.warp(img, tform.inverse)
    fig, ax = plt.subplots()
    ax.imshow(tf_img)
    _ = ax.set_title('Similarity transformation')




.. image:: /auto_examples/transform/images/sphx_glr_plot_transform_types_003.png
    :class: sphx-glr-single-img


.. rst-class:: sphx-glr-script-out

 Out:

 .. code-block:: none

    [[  0.48296291  -0.12940952 100.        ]
     [  0.12940952   0.48296291  50.        ]
     [  0.           0.           1.        ]]




Affine transformation
=================================

An `affine transformation <https://en.wikipedia.org/wiki/Affine_transformation>`_
preserves lines (hence the alignment of objects), as well as parallelism
between lines. It can be decomposed into a similarity transform and a
`shear transformation <https://en.wikipedia.org/wiki/Shear_mapping>`_.


.. code-block:: default


    tform = transform.AffineTransform(
            shear=np.pi/6,
            )
    print(tform.params)
    tf_img = transform.warp(img, tform.inverse)
    fig, ax = plt.subplots()
    ax.imshow(tf_img)
    _ = ax.set_title('Affine transformation')





.. image:: /auto_examples/transform/images/sphx_glr_plot_transform_types_004.png
    :class: sphx-glr-single-img


.. rst-class:: sphx-glr-script-out

 Out:

 .. code-block:: none

    [[ 1.        -0.5        0.       ]
     [ 0.         0.8660254  0.       ]
     [ 0.         0.         1.       ]]




Projective transformation (homographies)
========================================

A `homography <https://en.wikipedia.org/wiki/Homography>`_, also called
projective transformation, preserves lines but not necessarily
parallelism.


.. code-block:: default


    matrix = np.array([[1, -0.5, 100],
                       [0.1, 0.9, 50],
                       [0.0015, 0.0015, 1]])
    tform = transform.ProjectiveTransform(matrix=matrix)
    tf_img = transform.warp(img, tform.inverse)
    fig, ax = plt.subplots()
    ax.imshow(tf_img)
    ax.set_title('Projective transformation')

    plt.show()



.. image:: /auto_examples/transform/images/sphx_glr_plot_transform_types_005.png
    :class: sphx-glr-single-img





See also
========================================

* :ref:`sphx_glr_auto_examples_transform_plot_geometric.py` for composing
  transformations or estimating their parameters
* :ref:`sphx_glr_auto_examples_transform_plot_rescale.py` for simple
  rescaling and resizing operations
* :func:`skimage.transform.rotate` for rotating an image around its center



.. rst-class:: sphx-glr-timing

   **Total running time of the script:** ( 0 minutes  0.695 seconds)


.. _sphx_glr_download_auto_examples_transform_plot_transform_types.py:


.. only :: html

 .. container:: sphx-glr-footer
    :class: sphx-glr-footer-example


  .. container:: binder-badge

    .. image:: https://mybinder.org/badge_logo.svg
      :target: https://mybinder.org/v2/gh/scikit-image/scikit-image/v0.17.x?filepath=notebooks/auto_examples/transform/plot_transform_types.ipynb
      :width: 150 px


  .. container:: sphx-glr-download sphx-glr-download-python

     :download:`Download Python source code: plot_transform_types.py <plot_transform_types.py>`



  .. container:: sphx-glr-download sphx-glr-download-jupyter

     :download:`Download Jupyter notebook: plot_transform_types.ipynb <plot_transform_types.ipynb>`


.. only:: html

 .. rst-class:: sphx-glr-signature

    `Gallery generated by Sphinx-Gallery <https://sphinx-gallery.github.io>`_
