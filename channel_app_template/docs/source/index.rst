
Channel App Template Proje Dokümantasyonu
===========================================

Channel App Template projesi, Akinon Commerce Cloud (ACC) üzerinde farklı
pazaralanlarına yapılacak entegrasyonlar için taslak oluşturmak amacıyla
hazırlanmıştır.

Channel App Template projesi ile birlikte yeterli teknik uzmanlığa sahip
şirketler, istedikleri pazaralanlarına entegrasyon yapabilirler.

Bunun için projeyi klonlayıp, gerekli bağlantı kodlarını yazarak, ürün, stok,
fiyat gibi akışlarda hedef pazaralanına özgü özelleştirmeleri de yapmaları
yeterlidir. Bu adımlardan sonra, yeni bir uygulama olarak ACC üzerinde
kurulabilir.

Yerel ortamda testler tamamlanıp gerekli joblar hazır olduğu düşünüldüğünde,
geliştirmeleri yayına alma veya sunucularda test etmek gerekecektir.

`developers.akinon.com <https://developers.akinon.com/docs/tutorial/cloud/introduction>`_

dokümanındaki adımları izleyerek ACC üzerinde `project` ve `application`
tanımlamanız gerekmektedir. Bu adımları aynı uygulama için daha önce takip
ettiyseniz kodun ve etiketlerin gönderildiği noktaya geçebilirsiniz.


--------------------------------
Teknolojiler ve Kütüphaneler
--------------------------------

1. Python 3.8
2. Celery 5
3. Flower [Opsiyonel]
4. Sentry [Opsiyonel]

İçerik
======

.. toctree::
   :maxdepth: 2

   setup/index
   project/index
   architecture/index
   terminology
   flows
   logs
