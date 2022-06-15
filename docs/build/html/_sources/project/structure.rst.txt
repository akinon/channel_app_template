
Klasör Yapısı
======================


Kopyalacağınız proje ile ilgili klasör ve dosya yapısı aşağıdaki gibidir.
ChannelTemplateApp projesini kullanan firmaların yeni satış kanalı geliştirmek için
`channel` klasörü altındaki ilgili sınıfları geliştirmeleri beklenmektedir.

    | channel_app_template
    | ├── akinon
    |     └── integration.py
    | ├── channel
    |     └── integration.py
    |     └── commands.py
    |       └── setup.py
    |       └── products.py
    |       └── product_prices.py
    |       └── product_stocks.py
    |       └── product_images.py
    |       └── orders
    |           └── orders.py
    | ├── app
    |     └── tasks.py
    | └── celery_app
    |     └── celery.py
    |     └── celery_schedule_conf.py
    |     └── celeryconfig.py
    |

.. attention:: Geliştirmeye başlamadan önce aşağıdaki ayarları yapmak gerekiyor.

   1. **setup.py** dosyasına yer alan  proje adı, versiyon bilgisi, uygulamanın
      depolandığı (bitbucket, github vb...) reponun url'i, uygulamanın tanımı,
      uygulamanın yazar veya yazarları, python versiyon zorunluluğu ve kurulu
      olması gereken paketlerin listesi gibi bilgilerin girilmesi gerekiyor.

   2. **channel_app_template/celery_app/celery_schedule_conf.py** içerisinde yer alan
      **CELERYBEAT_SCHEDULE** objesi içerisinde çalışmasını istediğiniz süreçler bulunmaktadır.
      Akinon ile yapılacak satış kanalı entegrasyonunda kullanılacak süreçler ön tanımlı
      olarak yazılmış ve yorum satırına alınmıştır. Düzenli aralıklar ile çalışmasını
      gereken süreçleri yorum satırından kaldırıp, ne sıklık ile çalışması gerektiğini
      yazabilirsiniz.


.. py:class:: channel_app.channel.integration.ChannelIntegration

   Actions özelliğinde yer alan komutlar aracılığı ile Satış Kanalının
   servisleri haberleşir. Her komut üzerinde *get_data*, *validated_data*,
  *transform_data*, *send_request* ve *normalize_response* fonksiyonlarını
  barındırmak zorundadır

   .. py:attribute:: channel

      Satış kanalı objesidir. `Detaylı Bilgi <https://developers.akinon.com/docs/guide/omni/channels/introduction>`_
      Örnek channel objesi.

      .. code-block:: python

         {
                "pk": 1,
                "name": "test1:1_Channel",
                "channel_type": "sales_channel",
                "catalog": 1,
                "modified_date": "2022-04-01T11:35:56.485644Z",
                "created_date": "2022-02-18T14:17:35.169367Z",
                "category_tree": 24,
                "is_active": True,
                "conf":
                {
                    "FAILED_INTEGRATION":
                    {
                        "DEFAULT":
                        {
                            "EXPIRATION_DATE": 213,
                            "RETRY_INTERVAL": 0,
                            "MAX_RETRY_COUNT": 3
                        }
                    },
                    "base_url": "https://vendor-api-staging.saleschannel.com/",
                    "client_id": "69b5c9c1-20e1-4c62-89f9-7186bde1b13f",
                    "ATTRIBUTE_SET_STRATEGY": "CategoryNode"
                },
                "schema": None
         }

         >>> self.channel.pk
         1
         >>> self.name
         test1:1_Channel
         >>> self.conf.get("base_url")
         https://vendor-api-staging.saleschannel.com/

   .. py:attribute:: catalog

      Katalog objesidir. `Detaylı Bilgi <https://developers.akinon.com/docs/guide/omni/catalogue/introduction>`_.
      Örnek katalog objesi

      .. code-block:: python

        {
            "pk": 1,
            "name": "test1:1_Catalog",
            "stock_list": None,
            "price_list": None,
            "category_tree": None,
            "modified_date": "2022-02-18T14:17:35.159703Z",
            "created_date": "2022-02-18T14:17:35.159683Z",
            "priority_list": None,
            "extra_stock_lists": [],
            "extra_price_lists": []
        }

        >>> self.catalog.pk
        1
   .. py:method:: create_session()

      Session nesnesi, belirli parametreleri istekler arasında kalıcı hale
      getirmenize olanak tanır. Ayrıca, Session ile yapılan tüm isteklerde
      tanımlama bilgilerini(Çerezleri) taşır. Bu nedenle, aynı ana bilgisayara
      birden fazla istekte bulunuyorsanız, temeldeki TCP bağlantısı yeniden
      kullanılacak ve bu da önemli bir performans artışına neden olacaktır.
      Daha detaylı bilgi için `Session Objects <https://docs.python-requests.org/en/latest/user/advanced/#session-objects>`_

   .. py:attribute:: session

      Satış kanalının servislerine istek atılırken kullanılacak objedir.
      Session objesi komutlar içerisinde ki *send_request* fonksiyonu içerisinde
      kullanılabilir.

      >>> session.get("google.com")

   .. py:method:: do_action(key:str, **kwargs) -> Any

      Servisler aracılığı ile tetiklenir.
      Çağırabilmek için öncesinde bir entegrasyon nesnesi yaratılmış olmalıdır.
      Parametre olarak verilen key çalışacak olan komutu temsil eder. Bu komut
      ilgili entegrasyonun *actions* özelliği içerisinde olmalıdır. *kwargs* olarak
      verilen parametreler doğrudan Komut nesnesi oluşturmak için kullanılır.
      Son olarak ilgili komutun *run* fonksiyonunu çağırarak komutun çalışmasını
      sağlar.

      .. code-block:: python

         with OmnitronIntegration(content_type=ContentType.category_tree.value) as omnitron_integration:
            channel_integration = ChannelIntegration()
            category_tree, report, _ = channel_integration.do_action(
                key='get_category_tree_and_nodes',
                batch_request=omnitron_integration.batch_request)


Satış Kanalının Kodlanması
==========================

Bu klasör içerisinde uygulamanın yazılma amacı olan satış kanalının kodlamasının
yapılacağı yerdir.

Entegre olunacak satış kanalı için kodlanlamasını istediğimiz commandların listesi
aşağıdaki gibidir.

============================== ================================
Module                           Açıklama
============================== ================================
:doc:`channel.setup`             Kurulum aşamasına ait komutlar
:doc:`channel.products`          Ürün ile ilgili komutlar
:doc:`channel.product_prices`    Fiyat ile ilgili komutlar
:doc:`channel.product_stocks`    Stok ile ilgili komutlar
:doc:`channel.product_images`    Resim ile ilgili komutlar
:doc:`channel.orders`            Sipariş ile ilgili komutlar
============================== ================================



Akinon'a Yeni Komut Eklemek
---------------------------

Uygulama içerisindeki akinon klasör içerisinde Akinon'nun omnitron ürününe ait ihtiyaç duyduğu
servisler ile haberleşen süreçler kodlanmıştır. Geliştirmenin yapılacağı satış
kanalı için omnitron servislerinde veya süreçlerinde bir eksiklik duyulması halinde
buradaki geliştirmeye hazır yapıdan faydalanılır.

Mevcut süreçlerin ve servislerin ihtiyacı karşılamaması durumunda
:py:class:`channel_app_template.akinon.integration.OmnitronIntegration`
kısmına yeni yazmış olduğunuz command'larınızı aşağıdaki adımları takip ederek
ekleyebilirsiniz.

1. Komut oluşturmak

  #. Komut oluşturmak için yaratacağınız *class* *OmnitronCommandInterface* i miras almalıdır.
  #. Komutun istek atacağı uç nokta için *OmnitronApiEndpoint* i miras alan bir *class* oluşturmak ve yaratılan komutun *endpoint* özelliğine atamak gerekmektedir.
  #. Opsiyonel olarak yarattığınız *OmnitronApiEndpoint* üzerinden birden farklı istek atmak isterseniz yaratılan komuta *path* özelliğini girip gerekli özelleştirme yapılabilir.
  #. Opsiyonel olarak komutun bir seferde işleyeceği veri sayısını belirtmek için *BATCH_SIZE* isminde bir özellik tanımlayıp gerekli özelleştirme yapılabilir.
  #. Komutun işleyeceği veri tipini tutmak ve olası bir hata durumunda daha detaylı log oluşturmak için *content_type* özelliği kullanılır. Atanabilecek content_type lara bakmak için *channel_app.omnitron.constants.ContentType* kontrol edebilirsiniz.

2. Oluşturduğumuz komutu *OmnitronIntegration* içerisinde ki *new_actions* özelliğine atayacağımız bir key(isim) ile birlikte eklenmeli.

3. Komutu çağırmak için :class:`channel_app.channel.integration.ChannelIntegration.do_action` örneğinden faydalanılabilir.
