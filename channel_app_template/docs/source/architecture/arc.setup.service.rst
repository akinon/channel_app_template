:orphan:

Kurulum Servisi
============================================

.. autoclass::  channel_app.app.setup.service.SetupService

    Kurulum servisi üzerinde satış kanalının barındırdığı konfigrasyonlar ve
    iletilmesi gereken kategori gibi ürünlerin satışa hazır hale gelmesini sağlayan
    fonksiyonları üzerinde barındırır. Bu aksiyonları gerçekleştirmek için
    OmnitronIntegration ve ChannelIntegration entegrasyolanrından yardım alır.

  .. method:: create_or_update_category_tree_and_nodes(self, is_success_log=False)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve satış kanalında mevcut olan
    kategorileri çeker. Detaylı bilgi: :ref:`CreateOrUpdateCategoryTreeAndNodes`

    Bu işlem sırasında bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

    Son olarak çektiği kategorileri *create_or_update_category_tree_and_nodes*
    komutu ile Akinon'a iletir. :ref:`CreateOrUpdateCategoryTreeAndNodes`.


  .. method:: create_or_update_category_attributes(self, is_success_log=True)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve satış kanalında mevcut olan
    kategorileri ID'lerini çeker.

    Gelen kategori IDleri üzerinden döngü ile kategori özelliklerini *get_category_attributes* komutu :ref:`GetCategoryAttributes` ile çekip ,

    *create_or_update_category_attributes* komutu ile Akinon'a iletir.

    Bu işlem sırasında bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: create_or_update_attributes(self, is_success_log=True)

    Bu fonksiyon channel'da bulunan attribute ve attribute valueları *get_attributes* komutu ile çekilir.

    Gelen attributelar üzerinden döngü ile  *create_or_update_channel_attribute* komutu ve

    *create_or_update_channel_attribute_value* komutu ile Akinon'a iletir.

    Oluşan her attribute için mapping yapılabilmesi için schema *get_or_create_channel_attribute_schema* komutu ile oluşturulur.

    Bu işlem sırasında bir hata ile karşılaşılır ise *error_report* oluşturulur :ref:`Sales Channel Logları`.

  .. method:: update_channel_conf_schema(self)

    Bu fonksiyon öncelikle Satış Kanalına bağlanır ve şema bilgisini çeker.

    Sonrasında Akinon'a *update_channel_conf_schema*  komutu aracılığıyla iletilir.
