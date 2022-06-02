Stok Servisi
============================================
Stok servisi üzerinde ürünlerin stoklarını oluşturma, güncelleme ve silme aksiyonlarını
üzerinde barındırır. Bu aksiyonları gerçekleştirmek için OmnitronIntegration ve
ChannelIntegration entegrasyolanrından yardım alır.

.. class:: StokService(object)

  .. method:: update_product_stocks(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına güncellemesi iletilebilecek
    ürünlerin stok bilgisini çeker. Sonrasında Satış Kanalına *send_updated_stocks*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: insert_product_stocks(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına eklenebilecek
    ürünlerin stok bilgisini çeker. Sonrasında Satış Kanalına *send_inserted_stocks*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: insert_product_stocks_from_extra_stock_list(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına eklenebilecek
    ürünlerin ekstra stok bilgisini çeker. Sonrasında Satış Kanalına *send_insert_stocks*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: update_product_stocks_from_extra_stock_list(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına güncellemesi iletilebilecek
    ürünlerin ekstra stok bilgisini çeker. Sonrasında Satış Kanalına *send_updated_stocks*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: get_warehouse_mappings(self)

    Bu fonksiyon yardımcı görevi görür. OmnitronIntegration üzerinde bulunan
    konfigrasyon üzerinden *WAREHOUSE_CODES* okur ve formatlayıp döndürür.

  .. method:: get_stock_batch_requests(self, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına ürün yaratmak/güncellemek
    için iletilmiş ve işlemi devam eden **batch_request** 'leri çeker.
    Sonrasında Satış Kanalından *check_products* komutu aracılığıyla sorgular.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur. Son olarak
    satış kanalından gelen cevabı Akinon Omnitrona ileterek akışı tamamlar.



