:orphan:

Resim Servisi
============================================
Resim servisi üzerinde ürünlerin resimlerini oluşturma, güncelleme ve silme aksiyonlarını
üzerinde barındırır. Bu aksiyonları gerçekleştirmek için OmnitronIntegration ve
ChannelIntegration entegrasyolanrından yardım alır.

.. class:: ImageService(object)

  .. method:: update_product_images(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına güncellemesi iletilebilecek
    ürünlerin resim bilgisini çeker. Sonrasında Satış Kanalına *send_updated_images*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: insert_product_images(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına eklenebilecek
    ürünlerin resim bilgisini çeker. Sonrasında Satış Kanalına *send_inserted_images*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: get_image_batch_requests(self, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına ürün yaratmak/güncellemek
    için iletilmiş ve işlemi devam eden **batch_request** 'leri çeker.
    Sonrasında Satış Kanalından *check_products* komutu aracılığıyla sorgular.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.
    Son olarak satış kanalından gelen cevabı Akinon Omnitrona ileterek akışı tamamlar.



