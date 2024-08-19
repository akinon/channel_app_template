:orphan:

=======================
GetChannelConfSchema
=======================

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

