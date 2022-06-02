======================
Setup
======================

Kurulum adımlarında
Sistem genelinde çalışan düzenli job'lara ait kodlar `channel_app_template.app.tasks`
dosyasında yer almaktadır.
Setup adımları ile ilgili 3 adet düzenli çalışabilecek durumda olan job vardır.

#.  **update_channel_conf_schema**:

    **Düzenlenmesi gereken class** :class:`.channel.commands.setup.GetChannelConfSchema`

    İş sürecinde oluşturulacak olan satış kanalı için
    ihtiyaç duyulan ayarları oluşturur. İşlem sırası olarak öncelikle satış
    kanalı entegrasyonunda yapılan gelişltirme aracılığıyla ayarları okur,
    sonrasında Akinon'a iletir.

    Setup Servisi içerisinde yer alan update_channel_conf_schema fonksiyonu ile süreç işletilir.

    Satış kanalının içerisinde erişmek istediğiniz ayarlarınızı key, value
    ikilisi koyabilir ve buna göre geliştirmenizi yapabilirsiniz.


#.  **create_or_update_category_tree_and_nodes**

    **Düzenlenmesi gereken class** :class:`.channel.commands.setup.GetCategoryTreeAndNodes`

    Satış kanalına ait kategori ağacını akinon tarafında oluşturur.

#.  **create_or_update_category_attributes**

    **Düzenlenmesi gereken class** :class:`.channel.commands.setup.GetCategoryAttributes`


.. autoclass:: channel.commands.setup.GetChannelConfSchema

    .. py:method:: normalize_response(data, validated_data, transformed_data, response) -> Tuple[dict, Any, Any]

       Açılacak satış kanalı için dinamik satış kanalı configurasyon ayarı
       burada tanımlanır. Aşağıdaki formatta satış kanalının ayarı olarak
       girilmesini istediğiniz bilgileri tanımlayabilirsiniz. Yapacağınız
       geliştirmede bu girilen ayarları kullanabilirsiniz.

       >>> self.integration.channel.conf.get("main_url")

       Örnek Kod:

       .. code-block:: python

          schema = {
              "main_url": ChannelConfSchemaField(
                  required=True,
                  data_type=ChannelConfSchemaDataTypes.text,
                  key="main_url",
                  label="Api Url"),
              "marchant_id": ChannelConfSchemaField(
                  required=True,
                  data_type=ChannelConfSchemaDataTypes.text,
                  key="marchant_id",
                  label="Satıcı Kodu"),
          }


.. autoclass:: channel.commands.setup.GetCategoryTreeAndNodes

   Satış kanalında yer alan kategori ağacı akinon tarafında da oluşturturulabilmesi
   için gerekli veriyi sağlar. Komut parametre almadan çalışmaktadır.

   :doc:`GetCategoryAttributes <channel.setup.GetCategoryTreeAndNodes>`


   .. py:method:: send_request(transformed_data) -> HttpResponse

      Kategori ağacına ulaşmak için gerekli request isteği atılır.

      >>> response = self.session.get("url")
      >>> return response

   .. py:method:: normalize_response(data, validated_data, transformed_data, response)

      Tuple[CategoryTreeDto, ErrorReportDto, Any]

      İç içe geçmiş bir ağaç yapısı mevcuttur kategori ağaçlarında. Burada
      dönülmesi istenilen `DataClass <https://docs.python.org/3/library/dataclasses.html>`_
      objesi CategoryTreeDto'dur. Örnek CategoryTreeDto oluşturmak için.

      Satış kanalında yer alan ağacın aşağıdaki şekilde olduğunu varsayalım.

      | sales channel
      | ├── Giyim
      |     └── Kadın
      |         └── Elbise
      |     └── Erkek
      |         └── Pantalon

      Örnek Kod:

      .. code-block:: python

         node_elbise = CategoryNodeDto(name="Elbise", children=[], remote_id="Elbise", parent)
         node_pantalon = CategoryNodeDto(name="Pantalon", children=[], remote_id="Pantalon", parent)
         node_kadin = CategoryNodeDto(name="Kadın", children=[node_elbise], remote_id="Kadın", parent)
         node_erkek = CategoryNodeDto(name="Erkek", children=[node_pantalon], remote_id="Erkek", parent)
         node_giyim = CategoryNodeDto(name="Giyim", children=[node_kadin, node_Erkek], remote_id="Giyim", parent)
         node_root = CategoryNodeDto(name="sales channel", children=[node_giyim], remote_id="sales channel", parent)

         report = self.create_report(response)
         return node_root, report, []


.. autoclass:: channel.commands.setup.GetCategoryAttributes

   Satış kanalında bulunan kategori ağacında kullanılan özellikleri ve
   değerlerini Omnitron üzerinde oluşturur. Özellikler oluşturulurken
   kullanılan `DataClass <https://docs.python.org/3/library/dataclasses.html>`_
   *CategoryAttributeDto* 'dur.

   :doc:`GetCategoryAttributes <channel.setup.GetCategoryAttributes>`

   .. code-block:: python

      CategoryAttributeDto
       remote_id: str -> "Ozelligin varsa remote_id'si yoksa ismi remote id olarak belirlenebilir"
       name: str -> "Özelliğin adı, örneğin renk, beden içerik gibi"
       required: bool -> "Zorunlu bir özellik olup olmadığı"
       variant: bool -> "varyant kırılımı olarak kullanılıp kullanılmadığı"
       allow_custom_value: bool -> "satış kanalında tanımlı değerler dışında değer kabul edip etmediği"
                                   "örneğin renk için tanımlı değerler dışında kabul etmeyebilir"
                                   "Ölçü için satış kanalında tanımlı olmayan değerleride kabul edebilir"
                                   "Açıklama ise tanımlı değer olamayacağı için her zaman custom değer alabilir anlamındadır"
       values: List[CategoryAttributeValueDto]
      ---
      class CategoryAttributeValueDto:
       remote_id: str -> "özelliğin satış kanalındaki kodu"
       name: str -> "Özelliğin değeri"


   .. py:method:: send_request(transformed_data) -> HttpResponse

      Kategori ağacının özelliklerine ulaşmak için gerekli request isteği atılır.

      >>> response = self.session.get("url")
      >>> return response

   .. py:method:: normalize_response(data, validated_data, transformed_data, response)

      Tuple[CategoryDto, ErrorReportDto, Any]
