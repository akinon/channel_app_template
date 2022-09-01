:orphan:

=======================
GetCategoryAttributes
=======================

.. autoclass:: channel.commands.setup.GetCategoryAttributes

   Satış kanalında bulunan kategori ağacında kullanılan özellikleri ve
   değerlerini Omnitron üzerinde oluşturur. Özellikler oluşturulurken
   kullanılan `DataClass <https://docs.python.org/3/library/dataclasses.html>`_
   *CategoryAttributeDto* 'dur.

   Oluşturulan attributelar ürün gönderimi sırasında mapping gerektirir.

   Mapping yapıldıktan sonra ürün datasına ek olarak mapped_attributes eklenir. Detaylı bilgi için :ref:`Üründe Mapping Verisi`

   `GetCategoryAttributes <channel.setup.GetCategoryAttributes>`

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
