:orphan:

======================
Setup
======================

Kurulum adımlarında
Sistem genelinde çalışan düzenli job'lara ait kodlar `channel_app_template.app.tasks`
dosyasında yer almaktadır.
Setup adımları ile ilgili 3 adet düzenli çalışabilecek durumda olan job vardır.

#.  **update_channel_conf_schema**

    **Düzenlenmesi gereken class** :ref:`GetChannelConfSchema`

    İş sürecinde oluşturulacak olan satış kanalı için
    ihtiyaç duyulan ayarları oluşturur. İşlem sırası olarak öncelikle satış
    kanalı entegrasyonunda yapılan gelişltirme aracılığıyla ayarları okur,
    sonrasında Akinon'a iletir.

    Setup Servisi içerisinde yer alan update_channel_conf_schema fonksiyonu ile süreç işletilir.

    Satış kanalının içerisinde erişmek istediğiniz ayarlarınızı key, value
    ikilisi koyabilir ve buna göre geliştirmenizi yapabilirsiniz.

#.  **create_or_update_category_tree_and_nodes**

    **Düzenlenmesi gereken class** :ref:`GetCategoryTreeAndNodes`

    Satış kanalına ait kategori ağacını akinon tarafında oluşturur.

#.  **create_or_update_category_attributes**

    **Düzenlenmesi gereken class** :ref:`GetCategoryAttributes`

    Satış kanalının kategorilerine göre attribute, attribute value değerlerini omnitronda oluştururan servistir.

#.  **create_or_update_attributes**

    **Düzenlenmesi gereken class** :ref:`GetAttributes`

    Satış kanalında bulunan attribute, attribute value değerlerini omnitronda oluştururan servistir.

    Bu servis kategoriye bağlı attributeların olmadığı senaryolarda kullanılabilir.