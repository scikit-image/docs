.. only:: html

    .. note::
        :class: sphx-glr-download-link-note

        Click :ref:`here <sphx_glr_download_auto_examples_segmentation_plot_regionprops.py>`     to download the full example code or to run this example in your browser via Binder
    .. rst-class:: sphx-glr-example-title

    .. _sphx_glr_auto_examples_segmentation_plot_regionprops.py:


=========================
Measure region properties
=========================

This example shows how to measure properties of labelled image regions. We
analyze an image with two ellipses.


.. code-block:: default

    import math
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd

    from skimage.draw import ellipse
    from skimage.measure import label, regionprops, regionprops_table
    from skimage.transform import rotate


    image = np.zeros((600, 600))

    rr, cc = ellipse(300, 350, 100, 220)
    image[rr, cc] = 1

    image = rotate(image, angle=15, order=0)

    rr, cc = ellipse(100, 100, 60, 50)
    image[rr, cc] = 1

    label_img = label(image)
    regions = regionprops(label_img)








We use the :py:func:`skimage.measure.regionprops` result to draw certain
properties on each region. For example, in red, we plot the major and minor
axes of each ellipse.


.. code-block:: default


    fig, ax = plt.subplots()
    ax.imshow(image, cmap=plt.cm.gray)

    for props in regions:
        y0, x0 = props.centroid
        orientation = props.orientation
        x1 = x0 + math.cos(orientation) * 0.5 * props.minor_axis_length
        y1 = y0 - math.sin(orientation) * 0.5 * props.minor_axis_length
        x2 = x0 - math.sin(orientation) * 0.5 * props.major_axis_length
        y2 = y0 - math.cos(orientation) * 0.5 * props.major_axis_length

        ax.plot((x0, x1), (y0, y1), '-r', linewidth=2.5)
        ax.plot((x0, x2), (y0, y2), '-r', linewidth=2.5)
        ax.plot(x0, y0, '.g', markersize=15)

        minr, minc, maxr, maxc = props.bbox
        bx = (minc, maxc, maxc, minc, minc)
        by = (minr, minr, maxr, maxr, minr)
        ax.plot(bx, by, '-b', linewidth=2.5)

    ax.axis((0, 600, 600, 0))
    plt.show()




.. image:: /auto_examples/segmentation/images/sphx_glr_plot_regionprops_001.png
    :class: sphx-glr-single-img





We use the :py:func:`skimage.measure.regionprops_table` to compute
(selected) properties for each region. Note that
``skimage.measure.regionprops_table`` actually computes the properties,
whereas ``skimage.measure.regionprops`` computes them when they come in use
(lazy evaluation).


.. code-block:: default


    props = regionprops_table(label_img, properties=('centroid',
                                                     'orientation',
                                                     'major_axis_length',
                                                     'minor_axis_length'))








We now display a table of these selected properties (one region per row),
the ``skimage.measure.regionprops_table`` result being a pandas-compatible
dict.


.. code-block:: default


    pd.DataFrame(props)





.. only:: builder_html

    .. raw:: html

        <div>
        <style scoped>
            .dataframe tbody tr th:only-of-type {
                vertical-align: middle;
            }

            .dataframe tbody tr th {
                vertical-align: top;
            }

            .dataframe thead th {
                text-align: right;
            }
        </style>
        <table border="1" class="dataframe">
          <thead>
            <tr style="text-align: right;">
              <th></th>
              <th>centroid-0</th>
              <th>centroid-1</th>
              <th>orientation</th>
              <th>major_axis_length</th>
              <th>minor_axis_length</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>0</th>
              <td>100.000000</td>
              <td>100.000000</td>
              <td>0.000000</td>
              <td>119.807049</td>
              <td>99.823995</td>
            </tr>
            <tr>
              <th>1</th>
              <td>286.914167</td>
              <td>348.412995</td>
              <td>-1.308966</td>
              <td>440.015503</td>
              <td>199.918850</td>
            </tr>
          </tbody>
        </table>
        </div>
        <br />
        <br />


.. rst-class:: sphx-glr-timing

   **Total running time of the script:** ( 0 minutes  0.400 seconds)


.. _sphx_glr_download_auto_examples_segmentation_plot_regionprops.py:


.. only :: html

 .. container:: sphx-glr-footer
    :class: sphx-glr-footer-example


  .. container:: binder-badge

    .. image:: https://mybinder.org/badge_logo.svg
      :target: https://mybinder.org/v2/gh/scikit-image/scikit-image/v0.17.x?filepath=notebooks/auto_examples/segmentation/plot_regionprops.ipynb
      :width: 150 px


  .. container:: sphx-glr-download sphx-glr-download-python

     :download:`Download Python source code: plot_regionprops.py <plot_regionprops.py>`



  .. container:: sphx-glr-download sphx-glr-download-jupyter

     :download:`Download Jupyter notebook: plot_regionprops.ipynb <plot_regionprops.ipynb>`


.. only:: html

 .. rst-class:: sphx-glr-signature

    `Gallery generated by Sphinx-Gallery <https://sphinx-gallery.github.io>`_
