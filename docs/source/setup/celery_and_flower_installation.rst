Celery ve Flower Kurulumu
=========================

Celery, dağıtık mesaj geçişine dayanan açık kaynaklı, bir asenkron görev
kuyruğu veya iş kuyruğudur. Genellikle gerçek zamanlı görev işleme üzerine
yoğunlaşsa ve kullanılsa dahi zamanlanmış görevleri de yönetebilir. Detaylı
bilgi için (`Celery <https://docs.celeryq.dev/en/master/>`_)


* Celery işçi processleri de çalıştıralım.
  Kullanıcı bilgileri ve bazı ortam değişkenleri sizin ortamınız için farklı değerlerde olacaktır.
  MAIN_APP_URL: Protokol bilgisi hariç Omnitron url'i
  OMNITRON_CHANNEL_ID: Uygulamanın bağlanacağı satış kanalı id değeri.
  OMNITRON_CATALOG_ID: Bağlı satış kanalının katalog id değeri.

.. code-block:: bash

    # Topluca export (öncesinde .env dosyasını oluşturmak gerekiyor)
    export $(grep -v '^#' .env | xargs)

    # Tek tek export
    export MAIN_APP_URL=localhost:8000
    export OMNITRON_USERNAME=admin
    export OMNITRON_PASSWORD=password
    export OMNITRON_CHANNEL_ID=1
    export OMNITRON_CATALOG_ID=1
    export BROKER_HOST=127.0.0.1
    export BROKER_PORT=6379
    export BROKER_DATABASE_INDEX=4
    export CACHE_HOST=127.0.0.1
    export CACHE_PORT=6379
    export CACHE_DATABASE_INDEX=3

    celery -A channel_app.celery_app worker -l info

* Redis sunucusu varsayılan olarak kurulum sonrası özellikle kapatılmadıkça ayakta oluyor.
  Ping komutuyla test edip `redis-server` ile kaldırabilirsiniz.

.. code-block:: bash

    redis-cli ping
    redis-server

Flower celery ile ilgili yapılan işlemleri görüntülemek ve yönetmek için kullanılan
web tabanlı bir araçtır. Eğer yönetilecek düzenli çalışan joblarınız yoksa veya
alternatif bir araç kullanıyorsanız kurulumu zorunlu değildir.

* Flower kurmak için bazı ortam değişkenlerini `export` etmemiz gerekiyor.
  Her seferinde tek tek export yapmak yerine, bu değerleri `.env` dosyasına KEY=VALUE şeklinde kaydedip topluca
  export edecek komutu da çağırabilirsiniz.


.. code-block:: bash

    # Topluca export (öncesinde .env dosyasını oluşturmak gerekiyor)
    export $(grep -v '^#' .env | xargs)

    # Tek tek export
    export BROKER_HOST=127.0.0.1
    export BROKER_DATABASE_INDEX=4
    export BROKER_PORT=6379

    celery -A channel_app_template.celery_app flower --address=127.0.0.1 --port=8008

Flower Üzerinden Task Tetiklemek
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Flower ayni zamanda ön tanımlı olan taskları tetiklemeyi sağlar.
Taskları tetiklemek için aşağıdaki örnek **curl** isteği aşağıdaki gibidir.

.. code-block:: bash

  curl --request POST \
    --url https://<flower-url>.lb.akinoncloud.com/api/task/apply/channel_app_template.app.tasks.<task_name> \
    --header 'authorization: Basic <auth token>' \
    --header 'content-type: application/json' \
    --data '{\n"args":[]\n}'

İstek başarılı olur ise 200 status kodu ile aşağıdaki cevabı döner.

.. code-block::

  HTTP/1.1 200 OK
  Content-Length: 71
  Content-Type: application/json; charset=UTF-8
  {
    "state": "SUCCESS",
    "task-id": "c60be250-fe52-48df-befb-ac66174076e6",
    "result": 3
  }

Dönen cevap içerisindeki **task-id** parametresi ile flower paneli üzerinden
tetiklenen taskın durumu sorgulanabilir.