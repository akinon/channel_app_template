:orphan:

======================
Product Image
======================

.. contents::
    :local:
    :depth: 2

Ürün entegrasyonu ile ilgili channel_app_template.app.tasks altında çalışan tasklar

1. insert_images

  Akinon'da satış tarafına ilk defa insert edilmesi gereken ProductImage'ları alır ve bu verileri

  :class:`.channel.commands.product_images.SendInsertedImages`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına ürünün resim bilgisi oluşturulur.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Resim Verisi zenginleştirilebilir.

  ImageService içerisinde yer alan insert_product_images servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Resim Servisi` içerisinde yer alan insert_product_images servisine ait parametreler

     | **is_sync**        : Ürün satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.product_images.SendInsertedImages

    .. method:: get_data()

      Bu fonksiyon ürünlerin resim bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde ProductImage döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek ürün resimleri üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon insert_images adımında ürünlerimizin resmini satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan insert_product_images fonksiyonunda kullanılacaktır.

      Bu methoda süreç asenkron ise satış kanalından dönen remote_batch_id batch_request'e işlenmelidir.

      >>> remote_batch_id = response.get("remote_batch_request_id")
      >>> self.batch_request.remote_batch_id = remote_batch_id
      >>> return "", report, data

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi BatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data


2. update_images

  Akinon'da satış tarafına güncellenmesi gereken ProductImage'ları alır ve bu verileri

  :class:`.channel.commands.product_images.SendUpdatedImages`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalında bulunan ürünün resim bilgisi güncellenir.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Resim Verisi zenginleştirilebilir.

  ImageService içerisinde yer alan update_product_images servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Resim Servisi` içerisinde yer alan insert_product_images servisine ait parametreler

     | **is_sync**        : Ürün satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.product_images.SendUpdatedImages

    .. method:: get_data()

      Bu fonksiyonda ürünlerin güncellenmiş resim bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde ProductImage döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek ürün resimleri üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon update_images adımında ürünlerimizin resmini satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan insert_product_images fonksiyonunda kullanılacaktır.

      Bu methoda süreç asenkron ise satış kanalından dönen remote_batch_id batch_request'e işlenmelidir.

      >>> remote_batch_id = response.get("remote_batch_request_id")
      >>> self.batch_request.remote_batch_id = remote_batch_id
      >>> return "", report, data

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi BatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data



3. check_images

  Akinon'da satış tarafına asenkron olarak güncellenmiş veya yaratılmış fakat durumu bilinmeyen BatchRequesti alır ve bu verileri

  :class:`.channel.commands.product_images.CheckImages`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalında bulunan ürünün resim bilgisinin yaratılma veya güncellenme durumunun öğrenilmesini sağlar.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Resim Verisi zenginleştirilebilir.

  ImageService içerisinde yer alan get_image_batch_requests fonksiyonu kullanılır.

  .. autoclass:: channel.commands.product_images.CheckImages

    .. method:: get_data()

      Bu fonksiyonda ürünlerin satış kanalına iletilmiş resim bilgisinin durumunu öğrenmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde BatchRequest döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilmiş ürün resimleri verisi üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon get_image_batch_requests adımında ürünlerimizin resminin işlenme durumunu kontrol etmek için satış kanalına sorgu atarken kullanmış olduğumuz verileri ve dönen cevabı toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan get_image_batch_requests fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi BatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data
