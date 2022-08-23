:orphan:

Sipariş Servisi
============================================

Sipariş servisi üzerinde siparişleri oluşturma, güncelleme ve iptal aksiyonlarını
üzerinde barındırır. Bu aksiyonları gerçekleştirmek için OmnitronIntegration ve
ChannelIntegration entegrasyolanrından yardım alır.

.. class:: OrderService(object)

  .. method:: fetch_and_create_order(self, is_success_log=True)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve oluşmuş siparişleri çeker.
    Sonrasında Akinon'a üzerinde bulunan **create_order**
    fonksiyonu aracılığıyla iletilir. Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: create_order(self, omnitron_integration: OmnitronIntegration, channel_order: ChannelCreateOrderDto) -> Union[Order, None]

    Bu fonksiyon satış kanalından gelen siparişleri Akinon'a aktarmayı sağlar.
    Satış kanalından gelen veriler üzerinden sırasıyla müşteri ve adres bilgilerini
    Akinon'a yazar ve dönen cevabı tutar. Sipariş üzerindeki kargo firmasının da
    Akinondaki karşılığını okuyarak sipariş yaratmak için gerekli olan tüm bilgileri
    toplamış olur. Son olarak Akinon'a sipariş bilgileri iletilir.

  .. method:: update_orders(self, is_sync=True, is_success_log=True)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına iletilebilecek
    güncellenmiş siparişleri çeker. Sonrasında Satış Kanalına *send_updated_orders*
    komutu aracılığıyla iletilir. *is_sync* parametresinin aldığı değere göre
    satış kanalı ile kurulacak iletişimin senkron mu asenkron mu olacağına karar verir.
    Asenkron olacak ise **batch_service** üzerinden gerkli kayıtlar oluşturulur.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: get_order_batch_requests(self, is_success_log=False)

    Bu fonksiyon öncelikle Akinon Omnitron'a bağlanır ve satış kanalına sipariş yaratmak/güncellemek
    için iletilmiş ve işlemi devam eden **batch_request** 'leri çeker.
    Sonrasında Satış Kanalından *check_orders* komutu aracılığıyla sorgular.
    Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.
    Son olarak satış kanalından gelen cevabı Akinon Omnitrona ileterek akışı tamamlar.

  .. method:: fetch_and_create_cancel(self, is_success_log=True)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve oluşmuş sipariş iptallerini çeker.
    Sonrasında Akinon'a üzerinde bulunan **create_cancel**
    fonksiyonu aracılığıyla iletilir. Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: create_cancel(self, omnitron_integration: OmnitronIntegration, cancel_order_dto: CancelOrderDto)

    Bu fonksiyon satış kanalından gelen sipariş iptallerini Akinon'a aktarmayı sağlar.
    Akinon'a *create_order_cancel* komutu aracılığıyla parametre olarak verilen
    sipariş iptallerini iletir.

    .. method:: fetch_and_update_order_items(self, is_success_log=True)

     Bu fonksiyon öncelikle Satış Kanalına bağlanır ve güncellenmiş siparişleri çeker.
     Sonrasında Omnitron'a *update_order_items* komutu aracılığıyla güncellemeleri OrderItem bazında iletilir.
     Bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

