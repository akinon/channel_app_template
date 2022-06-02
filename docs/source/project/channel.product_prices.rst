======================
Product Price
======================

.. contents::
    :local:
    :depth: 2

Ürün entegrasyonu ile ilgili channel_app_template.app.tasks altında çalışan tasklar

1. insert_prices

  Akinon'da satış tarafına ilk defa insert edilmesi gereken ProductPriceları alır ve bu verileri

  :class:`.channel.commands.product_prices.SendInsertedPrices`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına ürünün fiyat bilgisi oluşturulur.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Fiyat Verisi zenginleştirilebilir.

  PriceService içerisinde yer alan insert_product_prices servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Fiyat Servisi` içerisinde yer alan insert_product_prices servisine ait parametreler

     | **is_sync**        : Ürün satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.product_prices.SendInsertedPrices

    .. method:: get_data()

      Bu fonksiyon ürünlerin fiyat bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde ProductPrice döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek ürün fiyatları üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon insert_prices adımında ürünlerimizin fiyatını satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan insert_product_prices fonksiyonunda kullanılacaktır.

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


2. update_prices

  Akinon'da satış tarafına güncellenmesi gereken ProductPriceları alır ve bu verileri

  :class:`.channel.commands.product_prices.SendUpdatedPrices`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalında bulunan ürünün fiyat bilgisi güncellenir.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Fiyat Verisi zenginleştirilebilir.

  PriceService içerisinde yer alan update_product_prices servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Fiyat Servisi` içerisinde yer alan insert_product_prices servisine ait parametreler

     | **is_sync**        : Ürün satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.product_prices.SendUpdatedPrices

    .. method:: get_data()

      Bu fonksiyonda ürünlerin güncellenmiş fiyat bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde ProductPrice döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek ürün fiyatları üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon update_prices adımında ürünlerimizin fiyatını satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan insert_product_prices fonksiyonunda kullanılacaktır.

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



3. check_prices

  Akinon'da satış tarafına asenkron olarak güncellenmiş veya yaratılmış fakat durumu bilinmeyen BatchRequesti alır ve bu verileri

  :class:`.channel.commands.product_prices.CheckPrices`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalında bulunan ürünün fiyat bilgisinin yaratılma veya güncellenme durumunun öğrenilmesini sağlar.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Fiyat Verisi zenginleştirilebilir.

  PriceService içerisinde yer alan get_price_batch_requests fonksiyonu kullanılır.

  .. autoclass:: channel.commands.product_prices.CheckPrices

    .. method:: get_data()

      Bu fonksiyonda ürünlerin satış kanalına iletilmiş fiyat bilgisinin durumunu öğrenmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde BatchRequest döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilmiş ürün fiyatları verisi üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon get_price_batch_requests adımında ürünlerimizin fiyatının işlenme durumunu kontrol etmek için satış kanalına sorgu atarken kullanmış olduğumuz verileri ve dönen cevabı toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan get_price_batch_requests fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi BatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data
