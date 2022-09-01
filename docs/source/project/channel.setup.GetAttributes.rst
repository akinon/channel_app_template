:orphan:

=======================
GetAttributes
=======================

.. autoclass:: channel.commands.setup.GetAttributes

   Satış kanalında bulunan özellikleri ve değerlerini alıp.
   *AttributeDto* dataclass'ı oluşturulur.

   Oluşturulan attributelar ürün gönderimi sırasında mapping gerektirir.

   Mapping yapıldıktan sonra ürün datasına ek olarak mapped_attributes eklenir. Detaylı bilgi için :ref:`Üründe Mapping Verisi`

   `GetAttributes <channel.setup.GetAttributes>`

   .. code-block:: python

      class AttributeDto
       remote_id: str -> "Ozelligin varsa satış kanalındaki kodu yoksa ismi remote id olarak belirlenebilir"
       name: str -> "Özelliğin adı, örneğin renk, beden içerik gibi"

       values: List[AttributeValueDto]
      ---
      class AttributeValueDto:
       remote_id: str -> "özelliğin satış kanalındaki kodu"
       name: str -> "Özelliğin değeri"


   .. py:method:: send_request(transformed_data) -> HttpResponse

      Channel'ın özelliklerine ulaşmak için gerekli request isteği atılır.

      >>> response = self.session.get("url")
      >>> return response

   .. py:method:: normalize_response(data, validated_data, transformed_data, response)

      Tuple[List[AttributeDto], ErrorReportDto, Any]
