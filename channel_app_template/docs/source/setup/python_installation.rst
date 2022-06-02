
Python Kurulumu
===============

*   python sürümü 3.8 ve üzerinde ise Channel App Template projesi için yeterlidir.

.. code-block:: bash

    python --version
    python3 --version

    $: Python 3.8.10

* Eğer Python yüklü değilse ya da sürümünüz eskiyse Python kurulumunu apt komutlarıyla tamamlayabilirsiniz.
  Öncelikle `apt install` komutunu denemeniz tavsiye edilir.
  Versiyonu bulamaması durumunda add-apt-repository ile ilerleyip sonrasında tekrar `apt install` ile kurulumu yapabilirsiniz.
  Bu şekilde sisteminizdeki `apt` aradığınız pakete ulaşabiliyorsa yeni bir `ppa` eklemenize gerek kalmaz.

.. code-block:: bash

    sudo add-apt-repository ppa:deadsnakes/ppa
    sudo apt update -y
    sudo apt install python3.10

* `apt` komutlarıyla gerekli paketleri sisteme yüklüyoruz.
  Bunlar Python paket yönetici pip, versiyon kontrol aracı Git, task sunucusu Celery ve Celery'nin
  broker ihtiyacı için Redis'ten oluşuyor.

.. code-block:: bash

    sudo apt install python3-pip git redis-server python-celery-common
    pip3 install --upgrade pip

* Farklı projelerin bağımlıkları arasında çakışma olmaması adına virtual environment kullanmanız önerilir.
  Virtual environment kurulumu için aşağıdaki linki takip edebilirsiniz.

  `Virtual environment kurulumu <https://virtualenv.pypa.io/en/latest/installation.html>`_