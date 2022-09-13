.. only:: html

    .. note::
        :class: sphx-glr-download-link-note

        Click :ref:`here <sphx_glr_download_auto_examples_segmentation_plot_euler_number.py>`     to download the full example code or to run this example in your browser via Binder
    .. rst-class:: sphx-glr-example-title

    .. _sphx_glr_auto_examples_segmentation_plot_euler_number.py:


=========================
Euler number
=========================

This example shows an illustration of the computation of the Euler number [1]_
in 2D and 3D objects.

For 2D objects, the Euler number is the number of objects minus the number of
holes. Notice that if a neighbourhood of 8 connected pixels (2-connectivity)
is considered for objects, then this amounts to considering a neighborhood
of 4 connected pixels (1-connectivity) for the complementary set (holes,
background) , and conversely. It is also possible to compute the number of
objects using :func:`skimage.measure.label`, and to deduce the number of holes
from the difference between the two numbers.

For 3D objects, the Euler number is obtained as the number of objects plus the
number of holes, minus the number of tunnels, or loops. If one uses
3-connectivity for an object (considering the 26 surrounding voxels as its
neighbourhood), this corresponds to using 1-connectivity for the complementary
set (holes, background), that is considering only 6 neighbours for a given
voxel. The voxels are represented here with blue transparent surfaces.
Inner porosities are represented in red.

.. [1] https://en.wikipedia.org/wiki/Euler_characteristic


.. code-block:: default

    from mpl_toolkits.mplot3d import Axes3D
    from skimage.measure import euler_number, label
    import matplotlib.pyplot as plt
    import numpy as np


    # Sample image.
    SAMPLE = np.array(
        [[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
         [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
         [1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0],
         [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],
         [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]]
    )
    SAMPLE = np.pad(SAMPLE, 1, mode='constant')

    fig, ax = plt.subplots()
    ax.imshow(SAMPLE, cmap=plt.cm.gray)
    ax.axis('off')
    e4 = euler_number(SAMPLE, connectivity=1)
    object_nb_4 = label(SAMPLE, connectivity=1).max()
    holes_nb_4 = object_nb_4 - e4
    e8 = euler_number(SAMPLE, connectivity=2)
    object_nb_8 = label(SAMPLE, connectivity=2).max()
    holes_nb_8 = object_nb_8 - e8
    ax.set_title('Euler number for N4: {} ({} objects, {} holes), \n for N8: {} ({} objects, {} holes)'.format(e4, object_nb_4, holes_nb_4, e8, object_nb_8, holes_nb_8))
    plt.show()




.. image:: /auto_examples/segmentation/images/sphx_glr_plot_euler_number_001.png
    :alt: Euler number for N4: 2 (2 objects, 0 holes),   for N8: 0 (1 objects, 1 holes)
    :class: sphx-glr-single-img





3-D objects
===========

In this example, a 3-D cube is generated, then holes and
tunnels are added. Euler number is evaluated with 6 and 26 neighborhood
configuration. This code is inpired by
https://matplotlib.org/devdocs/gallery/mplot3d/voxels_numpy_logo.html


.. code-block:: default



    def make_ax(grid=False):
        fig = plt.figure()
        ax = fig.gca(projection='3d')
        ax.grid(grid)
        ax.set_axis_off()
        return ax


    def explode(data):
        """visualization to separate voxels

        Data voxels are separated by 0-valued ones so that they appear
        separated in the matplotlib figure.
        """
        size = np.array(data.shape) * 2
        data_e = np.zeros(size - 1, dtype=data.dtype)
        data_e[::2, ::2, ::2] = data
        return data_e

    # shrink the gaps between voxels


    def expand_coordinates(indices):
        """
        This collapses together pairs of indices, so that
        the gaps in the volume array will have a zero width.
        """
        x, y, z = indices
        x[1::2, :, :] += 1
        y[:, 1::2, :] += 1
        z[:, :, 1::2] += 1
        return x, y, z


    def display_voxels(volume):
        """
        volume: (N,M,P) array
                Represents a binary set of pixels: objects are marked with 1,
                complementary (porosities) with 0.

        The voxels are actually represented with blue transparent surfaces.
        Inner porosities are represented in red.
        """

        # define colors
        red = '#ff0000ff'
        blue = '#1f77b410'

        # upscale the above voxel image, leaving gaps
        filled = explode(np.ones(volume.shape))

        fcolors = explode(np.where(volume, blue, red))

        # Shrink the gaps
        x, y, z = expand_coordinates(np.indices(np.array(filled.shape) + 1))

        # Define 3D figure and place voxels
        ax = make_ax()
        ax.voxels(x, y, z, filled, facecolors=fcolors)
        # Compute Euler number in 6 and 26 neighbourhood configuration, that
        # correspond to 1 and 3 connectivity, respectively
        e26 = euler_number(volume, connectivity=3)
        e6 = euler_number(volume, connectivity=1)
        plt.title('Euler number for N26: {}, for N6: {}'.format(e26, e6))
        plt.show()


    # Define a volume of 7x7x7 voxels
    n = 7
    cube = np.ones((n, n, n), dtype=bool)
    # Add a tunnel
    c = int(n/2)
    cube[c, :, c] = False
    # Add a new hole
    cube[int(3*n/4), c-1, c-1] = False
    # Add a hole in neighbourhood of previous one
    cube[int(3*n/4), c, c] = False
    # Add a second tunnel
    cube[:, c, int(3*n/4)] = False
    display_voxels(cube)



.. image:: /auto_examples/segmentation/images/sphx_glr_plot_euler_number_002.png
    :alt: Euler number for N26: 1, for N6: 0
    :class: sphx-glr-single-img






.. rst-class:: sphx-glr-timing

   **Total running time of the script:** ( 0 minutes  0.601 seconds)


.. _sphx_glr_download_auto_examples_segmentation_plot_euler_number.py:


.. only :: html

 .. container:: sphx-glr-footer
    :class: sphx-glr-footer-example


  .. container:: binder-badge

    .. image:: images/binder_badge_logo.svg
      :target: https://mybinder.org/v2/gh/scikit-image/scikit-image/v0.18.x?filepath=notebooks/auto_examples/segmentation/plot_euler_number.ipynb
      :alt: Launch binder
      :width: 150 px


  .. container:: sphx-glr-download sphx-glr-download-python

     :download:`Download Python source code: plot_euler_number.py <plot_euler_number.py>`



  .. container:: sphx-glr-download sphx-glr-download-jupyter

     :download:`Download Jupyter notebook: plot_euler_number.ipynb <plot_euler_number.ipynb>`


.. only:: html

 .. rst-class:: sphx-glr-signature

    `Gallery generated by Sphinx-Gallery <https://sphinx-gallery.github.io>`_
