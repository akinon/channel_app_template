:orphan:

=======================
GetCategoryTreeAndNodes
=======================

.. autoclass:: channel.commands.setup.GetCategoryTreeAndNodes

   Satış kanalında yer alan kategori ağacı akinon tarafında da oluşturturulabilmesi
   için gerekli veriyi sağlar. Komut parametre almadan çalışmaktadır.

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

