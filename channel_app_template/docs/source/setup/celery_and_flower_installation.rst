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


Reverse Proxy Teknik Dokümanı
=============================

Genel Bakış
-----------

Bu doküman, Flower servisine erişim sağlamak için FastAPI kullanarak bir reverse proxy kurulumunun nasıl yapılacağını açıklamaktadır. Bu yapılandırmanın amacı, Kubernetes kümesinde çalışan Flower servisine istekleri yönlendiren bir HTTP sunucusu oluşturmaktır.

Kullanılan Kütüphaneler
-----------------------

- `fastapi`: Python 3.6+ için modern, hızlı (yüksek performanslı) bir web çerçevesidir.
- `uvicorn`: uvloop ve httptools kullanarak hızlı bir ASGI sunucusu uygulamasıdır.
- `httpx`: Python 3 için yeni nesil bir HTTP istemcisidir.

Bağımlılıklar
-------------

Ortamınızda aşağıdaki bağımlılıkların kurulu olduğundan emin olun:

.. code-block:: shell

    pip install fastapi~=0.111.0 uvicorn~=0.30.1 httpx==0.27.0

Kod Açıklaması
--------------

.. code-block:: python

    from os import environ
    import httpx
    from fastapi import FastAPI, Request
    from starlette.background import BackgroundTask
    from starlette.responses import StreamingResponse

    app = FastAPI()
    FLOWER_URL = f"http://flower-service.{environ.get('ACC_PROJECT_APP_UUID')}.svc.cluster.local"
    client = httpx.AsyncClient(base_url=FLOWER_URL)

    async def _reverse_proxy(request: Request):
        url = httpx.URL(path=request.url.path, query=request.url.query.encode("utf-8"))
        rp_req = client.build_request(
            request.method, url, headers=request.headers.raw, content=await request.body()
        )
        rp_resp = await client.send(rp_req, stream=True)
        return StreamingResponse(
            rp_resp.aiter_raw(),
            status_code=rp_resp.status_code,
            headers=rp_resp.headers,
            background=BackgroundTask(rp_resp.aclose),
        )

    app.add_route("/flower/{path:path}", _reverse_proxy, ["GET", "POST"])

Açıklama
~~~~~~~~

- **Environment Variable**: `FLOWER_URL`, küme içindeki belirli uygulamayı tanımlayan `ACC_PROJECT_APP_UUID` ortam değişkeni kullanılarak oluşturulur.
- **HTTP Client**: Flower servisi ile iletişim kurmak için bir `httpx.AsyncClient` oluşturulur.
- **Reverse Proxy Fonksiyonu**: `_reverse_proxy` fonksiyonu gelen istekleri alır, yeniden oluşturur ve Flower servisine yönlendirir. Yanıtı istemciye aktarır.
- **Routing**: `/flower` eki ile tüm istekleri işlemek için bir route eklenir.

Procfile
--------

Procfile, uygulama tarafından yürütülecek farklı işlem türlerini ve ilgili komutlarını tanımlar:

.. code-block:: text

    worker: celery -A channel_app_template.celery_app worker --loglevel INFO
    beat: celery -A channel_app_template.celery_app beat --loglevel INFO
    web: uvicorn channel_app_template.api.main:app --host 0.0.0.0 --port 8008
    flower: celery -A channel_app_template.celery_app flower --address=0.0.0.0 --port=8008 --url_prefix=flower

Açıklama
~~~~~~~~

- **worker**: Celery worker sürecini çalıştırır.
- **beat**: Celery beat zamanlayıcısını çalıştırır.
- **web**: `uvicorn` kullanarak FastAPI uygulamasını başlatır.
- **flower**: Belirtilen URL önekiyle Flower izleme aracını başlatır.

Ek Konfigürasyon
----------------

Doküman içerisindeki tüm adımlar tamamlandıktan sonra, `akinon-json.dist` dosyasının aşağıdaki şekilde düzenlenmesi gerekmektedir:

.. code-block:: json

    {
      "name": "Sales Channel",
      "description": "Sales Channel",
      "scripts": {
        "release": "sleep 3",
        "build": "./build.sh"
      },
      "env": {},
      "formation": {
        "beat": {
          "min": 1,
          "max": 1
        },
        "worker": {
          "min": 1,
          "max": "1"
        },
        "web": {
          "min": 1,
          "max": "1"
        },
        "flower": {
          "min": 1,
          "max": 1
        }
      },
      "runtime": "python:3.11-alpine",
      "addons": [
        {
          "plan": "redis",
          "as": "BROKER"
        },
        {
          "plan": "redis",
          "as": "cache"
        },
        {
          "plan": "sentry"
        }
      ]
    }

Açıklama
~~~~~~~~

- **name ve description**: Uygulama hakkında meta veriler.
- **scripts**: Yayınlama ve derleme aşamalarında çalıştırılacak özel betikleri tanımlar.
- **env**: Ortam değişkenleri (şu an boş).
- **formation**: Her işlem türünün minimum ve maksimum sayısını belirtir.
- **runtime**: Çalışma ortamını belirtir.
- **addons**: Uygulama tarafından kullanılan Redis ve Sentry gibi eklentileri listeler.