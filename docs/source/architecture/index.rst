
Mimari
================================================
Proje, Python 3.8'de herhangi bir web servis kütüphanesi kullanılmadan Celery üzerinde belirli aralıklarla
çalışan tasklar üzerinden asenkron olarak çalışacak şekilde tasarlanmıştır.

Celery broker olarak Redis'i kullanıyor, veritabanı bulunmuyor ve bunun dışında minimal durum
bilgisi barındırdığı için (stateless) yatay ölçeklenme konusunda esnek bir altyapı sunuyor.
Şu ana kadar olan geliştirmelerde Redis üzerinde de broker'ın kendi kullanımı dışında cache amaçlı olarak
herhangi bir veri tutulmadı.
Durum bilgisi olarak sayılacabilecek ortam değişkenleri, ACC üzerinde uygulama
kurulduğu zaman besleniyor ve bazı nadir durumlarda güncelleme alıyor.
Bu senaryoda uygulama yeniden başlatılarak, uygulamanın güncellemeleri alması gerekiyor.

Mimari, genel olarak 3 temel bloktan oluşuyor: Omnitron Entegrasyonu, Satış Kanalı Entegrasyonu ve de
tasklar.



Entegrasyon
----------------------
Entegrasyon kısımları ortak bir ebeveyn sınıf üzerinden Komut (Command) tasarım örüntüsünü kullanarak
tanımlandı.
Gerekli olan akışlar için OmnitronIntegration ve ChannelIntegration sınıflarında
varsayılan komutlar geliştirildi.

Komutlar task metotlarının tanımlandığı noktada birbiri ardına çağrılmaktadır. Birinin çıktısı,
sonrakinin girdisi olduğu için uygun formatta çıktı üretip girdi almaktadırlar. Bu sebeple tanımlanan
arayüzlere sadık kalınması şiddetle tavsiye edilmektedir.

.. autoclass:: channel_app.core.integration.BaseIntegration
    :members:

Omnitron Entegrasyonu
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Omnitron entegrasyonu, Channel App Template'ın, Omnitron servislerini çağırıp, CRUD işlemlerini,
farklı servislerden veri toplamayı ve verilerin uygun formata dönüşümünü yaptığı sınıftır.

Burada farklı amaçlar için tanımlanmış komutlar bulunmaktadır.
Örneğin; ürün oluşturma, ürün silme ve stok güncelleme bunlardan birkaçı.
Komutların tamamının listesi için referans dokümanını inceleyebilirsiniz.

.. TODO api reference kısmına link koy

OmnitronIntegration sınıfı altındaki tüm komutlar, standart bir arayüz sunması ve de temel olarak
kullanıldığı her projede tekrar tekrar yazılmasının önüne geçmek adına, girdi ve çıktı olarak
DTO(Data Transfer Object) sınıflarını kullanmaktadırlar.
Böylece farklı pazaralanları için geliştirilen projelerde aynı veri formatına dönüştürüldüğü
sürece komutlar çalışmaya devam edecektir.

İdeal bir senaryoda OmnitronIntegration sınıfını türetmeye gerek olmayacak ve sınıf doğrudan
kullanılabilecektir.
Omnitron ve Channel App Template arasındaki iletişimde de değişen noktalar olabileceği gibi,
modeller ve yapı çoğunlukla sabit kalacağından, A ve B pazaralanları için farklı geliştirme
yapılması ihtimali düşüktür.

.. autoclass:: channel_app.omnitron.integration.OmnitronIntegration
    :members: __init__

Satış Kanalı Entegrasyonu
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Satış kanalı entegrasyonu, Channel App Template'ın, satış yapmak istediği pazaralanının servislerini
çağırıp, CRUD işlemlerini, farklı servislerden veri toplamayı ve verilerin uygun formata dönüşümünü
yaptığı sınıftır.

Satış kanalı servisleri ile bağlantı kurmak için istemci sınıfı yazılacaksa ya da requests kütüphanesi
üzerinden herhangi bir sarmalayıcı bir yapı kullanmadan istekler atılacaksa, gerekli nesnelerin ve
ayar değişkenlerinin bu sınıfın `__init__` metodunda tanımlanması önerilir.

`ChannelIntegration` sınıfındaki komutlar `__mocked_request` adında mock veri ile çalışan
varsayılan bir metot barındırıyor. Bunlar taslak olarak kullanılan metotların baştan sona çalışması
için hazırlandı. Her pazaralanı için farklı bağlantı ve servisler bulunacağından dolayı ortak
bir çözüm uygulanması teknik olarak mümkün değil. Channel App geliştiricileri buradaki komutları
türetmeli ve `send` metodunu ezerek komutu tamamlamalı. Yeni `send` metodunda pazaralanı servislerine
istek atıp verileri de Omnitron komutlarının beklediği DTO nesnelerine dönüştürmeli.

.. TODO buradaki dönüşüm process_response gibi bir yerde yapılması daha uygun olabilir bu duruma göre
    güncelleme yapılabilir bu noktaya

.. TODO api reference kısmına link koy

.. autoclass:: channel_app.channel.integration.ChannelIntegration
    :members:

Komut Arayüzü
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Komut arayüzü, yapılacak işlemler için standart metotlar belirleyen bir tasarım örüntüsüdür.
Çalıştır, gönder, getir gibi varsayılan metotların farklı komutlarda ihtiyaca göre değişen kısımlarının
ezilmesiyle minimal değişikliklerle farklı komutlar geliştirilir.
Böylece hata yönetimi, genel akış, ekstra modüllerin statü yönetimleri gibi diğer gereksinimler her
bir komut için tekrar tanımlanmaz.


.. autoclass:: channel_app.core.commands.CommandInterface
    :members:

Tasklar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Tasklar, farklı komutların birbiri ardına çalıştırılmasıyla bir iş akışını tamamlayan düzenli
aralıklarla çalışan metotları ifade eder.
Uygulamanın giriş noktalarıdır.
Komutlar kendi başlarına çağrılmaz.
Bir task içerisinde sadece o komutun çalışacağı şekilde tanımlanabilir.
Tasklar, Celery üzerindeki tanımlı programa göre düzenli olarak çalıştırılır ya da manuel olarak
Flower üzerinden tetiklenebilir.
Tasklar akışları oluşturan birimlerdir.
Bu konu hakkında daha detaylı bilgi için Akışlar bölümünü inceleyebilirsiniz.


Servisler(Flowlar)
----------------------

Servisler, tasklar aracılığıyla Akinon ile Satış Kanalı Entegrasyonu arasındaki
iletişimi sağlayan kısımdır. Akinondan verinin okunması/yazılması ve Satış Kanalı
ile iletişime geçilmesi olmak üzere 2 temel adımdan oluşur.


============================== ================================
Module                           Açıklama
============================== ================================
:doc:`arc.setup.service`         Kurulum aşamasına ait komutlar
:doc:`arc.product.service`       Ürün ile ilgili komutlar
:doc:`arc.product_p.service`     Fiyat ile ilgili komutlar
:doc:`arc.product_s.service`     Stok ile ilgili komutlar
:doc:`arc.product_i.service`     Resim ile ilgili komutlar
:doc:`arc.order.service`         Sipariş ile ilgili komutlar
============================== ================================


.. toctree::
   :hidden:

   arc.setup.service
   arc.product.service
   arc.product_p.service
   arc.product_s.service
   arc.product_i.service
   arc.order.service
