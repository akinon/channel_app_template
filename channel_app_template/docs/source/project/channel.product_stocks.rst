======================
Product Stock
======================

Ürün entegrasyonu ile ilgili channel_app_template.app.tasks altında çalışan tasklar

1. insert_stocks

  Akinon'da satış tarafına ilk defa insert edilmesi gereken ProductStockları alır ve bu verileri

  :class:`.channel.commands.product_stocks.SendInsertedStocks`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına ürünün stok bilgisi oluşturulur.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Stok Verisi zenginleştirilebilir.

  StockService içerisinde yer alan insert_product_stocks servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Stok Servisi` içerisinde yer alan insert_product_stocks servisine ait parametreler

     | **is_sync**        : Stok satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.product_stocks.SendInsertedStocks

    .. method:: get_data()

      Bu fonksiyon ürünlerin stok bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde ProductStock döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek ürün stokları üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon insert_stocks taskında ürünlerimizin stoklarını satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan insert_product_stocks fonksiyonunda kullanılacaktır.

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


2. update_stocks

  Akinon'da satış tarafına güncellenmesi gereken ProductStockları alır ve bu verileri

  :class:`.channel.commands.product_stocks.SendUpdatedStocks`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalında bulunan ürünün stok bilgisi güncellenir.

  İstenildiği durumda
  aşağıda listesi verilen parametre değerleri ile Stok Verisi zenginleştirilebilir.

  StockService içerisinde yer alan update_product_stocks servisine ait parametreler ve açıklamaları aşağıdaki gibidir.

  .. attention::

     :ref:`Stok Servisi` içerisinde yer alan insert_product_stocks servisine ait parametreler

     | **is_sync**        : Stok satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.product_stocks.SendUpdatedStocks

    .. method:: get_data()

      Bu fonksiyonda ürünlerin güncellenmiş stok bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde ProductStock döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek ürün stokları üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon update_prices adımında ürünlerimizin stoklarını satış kanalına iletmek için kullanmış olduğumuz verileri toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan update_product_stocks fonksiyonunda kullanılacaktır.

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



3. check_stocks

  Akinon'da satış tarafına asenkron olarak güncellenmiş veya yaratılmış fakat durumu bilinmeyen BatchRequesti alır ve bu verileri

  :class:`.channel.commands.product_stocks.CheckStocks`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalında bulunan ürünün stok bilgisinin yaratılma veya güncellenme durumunun öğrenilmesini sağlar.

  StockService içerisinde yer alan get_stock_batch_requests fonksiyonu kullanılır.

  .. autoclass:: channel.commands.product_stocks.CheckStocks

    .. method:: get_data()

      Bu fonksiyonda ürünlerin satış kanalına iletilmiş stok bilgisinin durumunu öğrenmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde BatchRequest döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilmiş ürün stokları verisi üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon check_stocks taskında ürünlerimizin stoklarının işlenme durumunu kontrol etmek için satış kanalına sorgu atarken kullanmış olduğumuz verileri ve dönen cevabı toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan get_stock_batch_requests fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi BatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data

