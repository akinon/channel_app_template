
Kurulum ve Kullanım
================================================

Yazılacak uygulama Omnitron'a bir `Akinon Commerce Cloud (ACC) <https://developers.akinon.com/docs/tutorial/cloud/moving-apps-to-acc#creating-an-application>`_ uygulaması olarak bağlanacak ve o uygulamaya
tanımlı kullanıcı bilgilerini kullanacak.

Yerel ortam için test etedilecek senaryoda Omnitron kullanıcı bilgileri ile ACC uygulamasını hazırlamadan
da test edilebilir.
Yapılacak geliştirmelerin hazır olduğu düşünülen noktada uygulamayı sunucu
ortamında(ACC) yayına alınabilir ve test edilebilir.

Acc tarafında application oluşturulduktan sonra kullanılacak olan projede add new app diyerek geliştrilen uygulama seçilir ve install denilir. Markanın omnitronunda channel ve katalog otomatik olarak oluşur.

Dokümantasyon Ubuntu tabanlı işletim sistemleri için hazırlanmıştır.

.. toctree::
   :maxdepth: 2

   python_installation
   clone_repository
   celery_and_flower_installation


Yukarıdaki işlemleri tamamladıktan sonra sistem için gerekli her şey hazır.
