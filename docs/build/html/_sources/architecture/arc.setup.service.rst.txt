:orphan:

Kurulum Servisi
============================================
Kurulum servisi üzerinde satış kanalının barındırdığı konfigrasyonlar ve
iletilmesi gereken kategori gibi ürünlerin satışa hazır hale gelmesini sağlayan
fonksiyonları üzerinde barındırır. Bu aksiyonları gerçekleştirmek için
OmnitronIntegration ve ChannelIntegration entegrasyolanrından yardım alır.

.. class:: SetupService(object)

  .. method:: create_or_update_category_tree_and_nodes(self, is_success_log=False)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve satış kanalında mevcut olan
    kategorileri çeker. Bu işlem sırasında bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.
    Son olarak çektiği kategorileri *create_or_update_category_tree_and_nodes*
    komutu ile Akinon'a iletir.

  .. method:: create_or_update_category_attributes(self, is_success_log=True)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve satış kanalında mevcut olan
    kategorileri ID'lerini çeker. Gelen kategori IDleri üzerinden döngü ile
    kategori özelliklerini çekip *create_or_update_category_attributes* komutu ile
    Akinon'a iletir. Bu işlem sırasında bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: update_channel_conf_schema(self)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve şema bilgisini çeker.
    Sonrasında Akinon'a *update_channel_conf_schema*  komutu aracılığıyla iletilir.
