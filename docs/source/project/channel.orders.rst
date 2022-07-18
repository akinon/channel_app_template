:orphan:

======================
Orders
======================

Sipariş entegrasyonu ile ilgili channel_app_template.app.tasks altında çalışan tasklar

1. fetch_orders

  Satış kanalı tarafından yeni oluşmuş siparişleri almak ve akinonda işlemek için
  :class:`.channel.commands.orders.orders.GetOrders` yer alan
  komut çalıştırılır ve Akinon'a istenilen formatta veri sağlar.
  Bu komut ile satış kanalına oluşmuş siparişler okunup Akinon uzerinde oluşturulması sağlanır.

  OrderService içerisinde yer alan fetch_and_create_order fonksiyonu ile süreç işletilir.

  Siparişleri satış kanalından almak ve istenlen formata çevirmek için aşağıda listesi verilen açıklamalara göre bu command hazırlanmalıdır.

  .. autoclass:: channel.commands.orders.orders.GetOrders

    .. method:: get_data()

      Bu fonksiyonda satış kanalı üzerinde oluşmuş siparişlere ulaşmak için verilerin hazırladığı yerdir. Herhangi bir parametre almaz.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalından siparişleri okumak için hazırlanan veri üzerinde bir doğrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalından sipariş okumadan önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon fetch_orders taskında satış kanalında oluşmuş siparişlerimizi okumak için hazırladığımız verileri ve satış kanalından gelen cevabı toplayıp Akinında siparişleri yaratmak için son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan fetch_and_create_order fonksiyonundaki süreç ile işlenir.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır. BU METHOD GENERATOR tipinde donmelidir.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi ChannelCreateOrderDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: None

        ..  code-block:: python

          # örnek generator
          yield response_data, report, None


2. update_orders

  Akinon'dan satış kanalı tarafına güncellenmesi gereken **siparişleri** alır ve bu verileri
  :class:`.channel.commands.orders.orders.SendUpdatedOrders`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalına güncellenmiş sipariş bilgilerini iletir.

  OrderService içerisinde yer alan update_orders fonksiyonuna ait süreçte kullanılacak olan bu command ile
  Akinon'da durumu güncellenmiş sipariş bilgileri bu command ile satış kanalına gönderilebillir.

  .. attention::

     Sipariş Servisi içerisinde yer alan update_orders fonksiyonuna ait parametreler

     | **is_sync**        : Sipariş üzerindeki güncelleme satış kanalına yollandığında durumu hemen mi ediniliyor :ref:`Senkron veya Asenkron Satış Kanalı Süreç`
                        yoksa asenkron bir şekilde mi ediniliyor olduğudur.

  .. autoclass:: channel.commands.orders.orders.SendUpdatedOrders

    .. method:: get_data()

      Bu fonksiyon siparişlerin güncellenme bilgisini omnitron'dan satış kanalına iletmek için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde Order döndürülmesi gerekir.
      objects datası içinde sipariş listesi mevcuttur.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalına gönderilecek güncellenmiş siparişler verisi üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon update_orders taskında güncellenmiş siparişlerimizi satış kanalına iletmek için kullanmış olduğumuz verileri ve satış kanalından aldığımız cevabı toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan update_orders fonksiyonunda kullanılacaktır.

      Bu methoda süreç asenkron ise satış kanalından dönen remote_batch_id batch_request'e işlenmelidir.

      >>> remote_batch_id = response.get("remote_batch_request_id")
      >>> self.batch_request.remote_batch_id = remote_batch_id
      >>> return "", report, data

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi OrderBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data


3. check_orders

  Akinon'da satış kanalı tarafına asenkron olarak iletilen Order güncellemelerinin BatchRequestlerini alır ve bu verileri
  :class:`.channel.commands.orders.orders.CheckOrders`'da yer alan
  komut'a gönderir. Bu komut ile satış kanalından güncelleme isteği atılmuş order'in güncel durum bilgisi satış kanalından okunur.

  .. autoclass:: channel.commands.orders.orders.CheckOrders

    .. method:: get_data()

      Bu fonksiyon güncelleme isteği satış kanalına iletilmiş orderların bilgisini Akinon'dan satış kanalı üzerinden durumunu sorgulamak için atılacak istekte gönderilecek veri hazırlanır. Response olarak liste içerinde BatchRequest döndürülmesi gerekir.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalından sorgulanacak order güncellemesi isteği verisi üzerinde bir değrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalına veri göndermeden önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon check_orders taskında daha önce güncellenmiş orderlarımızın durum sorgularını satış kanalına iletmek için kullanmış olduğumuz verileri ve satış kanalından dönen cevabı toplayıp son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan get_order_batch_requests fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Tipi string veya liste olabilir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen veri liste tipinde ve içerisindeki elemanların tipi OrderBatchRequestResponseDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: Fonksiyonumuzun aldığı ilk parametre, get_data fonksiyonundan aldığımız cevap.

        ..  code-block:: python

          # örnek return
          return response_data, report, data

4. fetch_and_create_cancel

  Satış kanalı tarafında yeni oluşmuş iptal sipariş kayıtları :class:`.channel.commands.orders.orders.GetCancelledOrders` komutu aracılığı ile alınır ve akinon'da gönderilir. OrderService içerisinde yer alan fetch_and_create_cancel fonksiyonu ile kullanılır.

  Aşağıda listesi verilen parametre değerleri ile Sipariş İptal Verisi çekilip istenilen formata getirilir.

  .. autoclass:: channel.commands.orders.orders.GetCancelledOrders

    .. method:: get_data()

      Bu fonksiyonda satış kanalı üzerinde oluşmuş siparişleri Akinona yazmak için satış kanalına atılacak istekte gönderilecek veri hazırlanır.
      Parametre almaz.

    .. method:: validated_data(data)

      Parametre olarak get_data fonksiyonunun döndüğü cevabı alır. Eğer satış kanalından iptal siparişleri okumak için hazırlanan veri üzerinde bir doğrulama yapılması gerekiyor ise kullanılır. Doğrulama yapılmayacak ise parametre olarak verilen data'nın döndürülmesi gerekir.

    .. method:: transform_data(data)

      Parametre olarak validated_data fonksiyonunun döndürdüğü cevabı alır. Eğer satış kanalından iptal sipariş kayıtları okumadan önce veri üzerinde değişiklik yapılması gerekiyor ise kullanılır. Cevap olarak iletilmek istenen verinin son halini döndürür.

    .. method:: send_request(transformed_data)

      Parametre olarak transform_data fonksiyonunun döndürdüğü cevabı alır. Bu fonksiyon aldığı veriyi satış kanalının ilgili uç noktasına isteğin atılacağı yerdir. Cevap olarak response veya response ile gelen veriyi dönmesi gerekir.

      .. attention::

        Bu kısımda dönülecek cevap normalize_response fonksiyonuna iletileceği için veri döndürürken veri tipleri konusunda dikkat etmek gerekmektedir.

    .. method:: normalize_response(data, validated_data, transformed_data, response)

      Bu fonksiyon fetch_and_create_cancel taskında satış kanalında oluşmuş iptal siparişlerimizi okumak için hazırladığımız verileri ve satış kanalından gelen cevabı toplayıp Akinında siparişleri iptal etmek için son haline getirdiğimiz yerdir. Bu fonksiyonun döneceği cevap doğrudan fetch_and_create_cancel fonksiyonunda kullanılacaktır.

      .. attention::

        Bu kısımda dönülecek cevap 3 parçadan oluşmalıdır. BU METHOD GENERATOR tipinde donmelidir.

        | **response_data**: Satış kanalından dönen verinin işlenmiş halidir. Dönen cevapda kullanılacak bir veri yok ise boş string dönülmesi yeterlidir. Dönen response kullanılacak ise dönen verinin tipi CancelOrderDto olmak zorundadır.
        | **report**: Satış kanalından dönen cevabı işlerken oluşturduğumuz hata raporlarıdır.
        | **data**: None

        ..  code-block:: python

          # örnek generator dönüş tipi
          yield response_data, report, None
