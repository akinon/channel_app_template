Fiyat Servisi
============================================
Fiyat servisi üzerinde ürünlerin fiyatlarını oluşturma, güncelleme ve silme aksiyonlarını
üzerinde barındırır. Bu aksiyonları gerçekleştirmek için OmnitronIntegration ve
ChannelIntegration entegrasyolanrından yardım alır.

.. class:: PriceService(object)

  .. method:: update_product_prices(self, is_sync=True, is_success_log=True, add_product_objects=False, add_stock=False)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına güncellemesi iletilebilecek
    ürünlerin fiyat bilgisini çeker. Sonrasında Satış Kanalına *send_updated_prices*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: insert_product_prices(self, is_sync=True, is_success_log=True, add_product_objects=False, add_stock=False)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına eklenebilecek
    ürünlerin fiyat bilgisini çeker. Sonrasında Satış Kanalına *send_inserted_prices*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: insert_product_prices_from_extra_price_list(self, is_sync=True, is_success_log=True, add_product_objects=False, add_stock=False)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına eklenebilecek
    ürünlerin ekstra fiyat bilgisini çeker. Sonrasında Satış Kanalına *send_inserted_prices*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: update_product_prices_from_extra_price_list(self, is_sync=True, is_success_log=True, add_product_objects=False, add_stock=False)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına güncellemesi iletilebilecek
    ürünlerin ekstra fiyat bilgisini çeker. Sonrasında Satış Kanalına *send_updated_prices*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur.

  .. method:: get_currency_mappings(self)

    Bu fonksiyon yardımcı görevi görür. OmnitronIntegration üzerinde bulunan
    konfigrasyon üzerinden *CURRENCY_MAPPINGS* okur ve formatlayıp döndürür.

  .. method:: get_price_batch_requests(self, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına ürün yaratmak/güncellemek
    için iletilmiş ve işlemi devam eden **batch_request** 'leri çeker.
    Sonrasında Satış Kanalından *check_products* komutu aracılığıyla sorgular.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur. Son olarak
    satış kanalından gelen cevabı Akinon Omnitrona ileterek akışı tamamlar.



