:orphan:

Ürün Servisi
============================================
Ürün servisi üzerinde ürünlerin oluşturma, güncelleme ve silme aksiyonlarını
üzerinde barındırır. Bu aksiyonları gerçekleştirmek için OmnitronIntegration ve
ChannelIntegration entegrasyolanrından yardım alır.

.. class:: ProductService(object)

  .. method:: insert_products(self, add_mapped=True, add_stock=True, add_price=True,add_categories=True, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına eklenebilecek
    ürünleri çeker. Girilen parametrelere göre, *add_mapped* için ürün mapping bilgilerini,
    *add_stock* için ürünlerin stoklarını, *add_price* için ürün fiyat bilgilerini,
    *add_categories* için ürün kategori bilgilerini satış kanalına iletmek için
    Akinon üzerinden çeker. Sonrasında Satış Kanalına *send_inserted_products*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: update_products(self, add_mapped=True, add_stock=True, add_price=True, add_categories=True, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına güncellemesi iletilebilecek
    ürünleri çeker. Girilen parametrelere göre, *add_mapped* için ürün mapping bilgilerini,
    *add_stock* için ürünlerin stoklarını, *add_price* için ürün fiyat bilgilerini,
    *add_categories* için ürün kategori bilgilerini satış kanalına iletmek için
    Akinon üzerinden çeker. Sonrasında Satış Kanalına *send_updated_products*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: delete_products(self, is_sync=True, is_content_object=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalından çıkartılabilecek
    ürünleri çeker. Sonrasında Satış Kanalına *send_deleted_products*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: get_delete_product_batch_requests(self, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına ürün silmek
    için iletilmiş ve işlemi devam eden **batch_request** 'leri çeker.
    Sonrasında Satış Kanalından *check_deleted_products* komutu aracılığıyla sorgular.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.
    Son olarak satış kanalından gelen cevabı Akinon Omnitrona ileterek akışı tamamlar.

  .. method:: get_product_batch_requests(self, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına ürün yaratmak/güncellemek
    için iletilmiş ve işlemi devam eden **batch_request** 'leri çeker.
    Sonrasında Satış Kanalından *check_products* komutu aracılığıyla sorgular.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.
    Son olarak satış kanalından gelen cevabı Akinon Omnitrona ileterek akışı tamamlar.



