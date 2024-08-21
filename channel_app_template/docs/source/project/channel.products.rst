:orphan:

======================
Products
======================

Ürün entegrasyonu ile ilgili channel_app_template.app.tasks altında çalışan tasklar

1. insert_products

  Akinon'da satış tarafına ilk defa insert edilmesi gereken ürünleri alır ve bu ürünleri
  :class:`.channel.commands.products.SendInsertedProducts`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına ürün bilgileri oluşturulur.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Ürün Verisi zenginleştirilebilir.

  ProductService içerisinde yer alan insert_products servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Ürün Servisi` içerisinde yer alan insert_products servisine ait parametreler


     | **add_mapped**     : Mapping bilgileri ürün verisine eklenir. :ref:`Üründe Mapping Verisi`

     | **add_stock**      : Ürün stok bilgileri ürün verisine eklenir. :ref:`Üründe Stok Verisi`

     | **add_price**      : Ürün fiyat bilgileri ürün verisine eklenir. :ref:`Üründe Fiyat Verisi`
     | **add_categories** : Ürün kategori bilgileri ürün verisine eklenir. :ref:`Üründe Kategori Verisi`
     | **is_sync**        : Ürün satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.products.SendInsertedProducts

    .. method:: get_data()

      Bu fonksiyon productları omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde productlar döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek productlar üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

        ..  code-block:: python

            valid_data = defaultdict(list)
            for product_id, products in data.items():
                images = self.get_images(products)
                if len(images) < 3:
                    for product in products:
                        product.failed_reason_type = FailedReasonType.remote.value
                        self.failed_object_list.append(
                            (product, ContentType.product.value,
                             "Product images counts are less than three"))
                else:
                    valid_data[product_id].extend(products)
            return valid_data

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon insert_product adımında productlarımızı satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceğ cevap doğrudan insert_products fonksiyonunda kullanılacaktır.

      Bu methoda süreç asenkron ise satış kanalından dönen remote_batch_id batch_request'e işlenmelidir.

      >>> remote_batch_id = response.get("remote_batch_request_id")
      >>> self.batch_request.remote_batch_id = remote_batch_id
      >>> return "", report, data

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi ProductBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data

2. update_products

  Akinon'da satış tarafına daha önce insert edilmiş fakat güncellenmesi  gereken ürünleri alır ve bu ürünleri
  :class:`.channel.commands.products.SendUpdatedProducts`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına mevcut olan ürün bilgileri güncellenir.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Ürün Verisi zenginleştirilebilir.

  ProductService içerisinde yer alan update_products servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Ürün Servisi` içerisinde yer alan update_products servisine ait parametreler


     | **add_mapped**     : Mapping bilgileri ürün verisine eklenir. :ref:`Üründe Mapping Verisi`

     | **add_stock**      : Ürün stok bilgileri ürün verisine eklenir. :ref:`Üründe Stok Verisi`

     | **add_price**      : Ürün fiyat bilgileri ürün verisine eklenir. :ref:`Üründe Fiyat Verisi`
     | **add_categories** : Ürün kategori bilgileri ürün verisine eklenir. :ref:`Üründe Kategori Verisi`
     | **is_sync**        : Ürün satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.products.SendUpdatedProducts

    .. method:: get_data()

      Bu fonksiyon satış kanalına iletilmiş productlara ait omnitron'da yapılan güncellemeleri satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlar. Response olarak liste içerinde productlar döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalında güncellenecek productlar üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon update_product adımında productlarımızı satış kanalına güncellemek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceğ cevap doğrudan update_products fonksiyonunda kullanılacaktır.

      Bu methoda süreç asenkron ise satış kanalından dönen remote_batch_id batch_request'e işlenmelidir.

      >>> remote_batch_id = response.get("remote_batch_request_id")
      >>> self.batch_request.remote_batch_id = remote_batch_id
      >>> return "", report, data

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi ProductBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data

3. delete_products

  Akinon'da satış tarafına daha önce insert edilmiş fakat silinmesi istenen ürünleri alır ve bu ürünleri
  :class:`.channel.commands.products.SendDeletedProducts`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına mevcut olan ürünler silinir.

  İstenildiği durumda
  aşağıda verilen parametre değeri ile Komutun çalışması zenginleştirilebilir.

  | **is_sync**        : Ürünün silinme bilgisi satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.products.SendDeletedProducts

    .. method:: get_data()

      Bu fonksiyon satış kanalına iletilmiş productlara ait omnitron'da yapılan silinecek ürünleri satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlar. Response olarak liste içerinde productlar döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalında silinecek productlar üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon delete_product adımında productların silindiği bilgisinin satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceğ cevap doğrudan delete_products fonksiyonunda kullanılacaktır.

      Bu methoda süreç asenkron ise satış kanalından dönen remote_batch_id batch_request'e işlenmelidir.

      >>> remote_batch_id = response.get("remote_batch_request_id")
      >>> self.batch_request.remote_batch_id = remote_batch_id
      >>> return "", report, data

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi ProductBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data

4. check_delete_products

  Akinon'da satış tarafına daha önce silinme isteği gönderilmiş fakat silinme işlemi asenkron olduğu için işlemin sonucu bilinmeyen ürünleri
  :class:`.channel.commands.products.CheckDeletedProducts`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına iletilmiş silme isteklerinin durumu öğrenilir.

  .. autoclass:: channel.commands.products.CheckDeletedProducts

    .. method:: get_data()

      Bu fonksiyon satış kanalına iletilmiş silinme isteklerinin durumunun öğrenilmesi için gerekli olan verileri hazırlar. Response olarak BatchRequest döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalında silinmiş durumu sorgulanacak productlar üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon check_delete_products adımında productların silinip silinmediği bilgisinin satış kanalından okumak için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceğ cevap doğrudan delete_products fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi ProductBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data

5. check_products

  Akinon'da satış tarafına daha önce oluşturma veya güncelleme isteği gönderilmiş fakat bu işlem asenkron olduğu için işlemin sonucu bilinmeyen ürünleri
  :class:`.channel.commands.products.CheckProducts`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına iletilmiş oluşturma veya güncelleme isteklerinin durumu öğrenilir.

  .. autoclass:: channel.commands.products.CheckProducts

    .. method:: get_data()

      Bu fonksiyon satış kanalına iletilmiş oluşturma veya güncelleme isteklerinin durumunun öğrenilmesi için gerekli olan verileri hazırlar. Response olarak BatchRequest döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalında oluşturma veya güncelleme durumu sorgulanacak BatchRequest üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon check_products adımında productların yaratılma veya güncellenme bilgisinin satış kanalından okumak için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceğ cevap doğrudan get_product_batch_requests fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi ProductBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data
