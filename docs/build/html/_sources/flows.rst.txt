
Akışlar
================================================

Akışlar bir iş fonksiyonunun gerçekleşmesi için yapılacak adımları, çalıştırılacak komutları
listeler.
Omnitron ile Satış Kanalı entegrasyonuna ait komutlardan yapılacak işle alakalı olanları
akışın gerektirdiği sıraya göre çalıştırır.

Akışlarda komutların yanısıra, akışın herhangi bir noktasında hata alıp almadığımızı görebilmek
ya da parçalara bölünebilir işleri birden fazla parçada yapıp birbiri ile ilişkisini kurabilmek için
BatchRequest adında bir model tanımlandı.


BatchRequest Modeli
--------------------------

BatchRequest modeli, işlenen nesneleri yöneten, takip eden, anlamlı hatalar üreten ve de
bir sürecin birden fazla parçada çalışmasına olanak sağlayan bir durum makinesi olarak çalışıyor.
Örneğin bir ürün gönderme akışında 10 tane ürün gönderiliyor ve bunların bir tanesinde uygulama
tarafındaki kodlama hatasından dolayı hata fırlatıldı.
Bu durumda hata loglarına ulaşmak mümkünse dahi beraberinde gönderilemeyen ürünleri takip edemeyebiliriz.
Ya da ürünleri gönderdik ama satış kanalı tarafındaki istek asenkron çalışıyor.
Bu isteğin sonucunu beklemek Channel App tarafındaki taskın da beklemesini gerektireceği için
sağlıklı bir karar olmaz.
Asenkron çalışan istekleri gönderip anında dönen referans id değerlerini saklayabilecek ve işlemekte
olduğumuz ürünler ile iliştirip sonradan kontroller yapabilecek bir yapı sunuyor.

.. image:: images/batch_request_state_machine.png

Statüler
~~~~~~~~~~~~~~~~~~~

1. initialized
    Başlangıç durumunu ifade eder. BatchRequest oluşturulduğunda hayatına bu durum üzerinden başlar.
2. commit
    Commit statüsüne geçildiğinde BatchRequest bir Omnitron modeline kilitlenir.
    Örneğin ürün gönderme akışı için bir BatchRequest oluşturup onu commit statüsüne aldığımızda,
    model tipi (content_type) "product" olarak belirlenir.
    Paralel olarak "product" tipinde başka bir BatchRequest'in commit statüsüne gelmesi engellenir.
    Bu şekilde aynı anda yalnızca bir ürün gönderme akışı çalışır.
    Bu statüye geçişte BatchRequest'te işlenecek nesneler bildirilir.
    Ayrıca tek seferde tüm nesnelerin bildirilmesine gerek duyulmaz.
    Bunun için commit statüsünde olan bir BatchRequest'e tekrar commit statüsüne geçirilerek nesne
    eklemesi yapılabilir.
3. sent_to_remote
    Satış kanalı entegrasyonunu kullanarak nesneleri ilettiğimizde sent_to_remote statüsüne çekilir.
    Eğer satış kanalının servisi asenkron çalışıyorsa ve toplu işlem için bir id değeri iletiyorsa,
    bu durum geçişinde id bilgisini de remote_batch_id alanıyla birlikte beslemek gerekir.
    Bu alan taskın sonuçlanıp sonuçlanmadığı bilgisini kontrol edip BatchRequest statüsünü ilerletmek
    amaçlı kullanılacaktır.
    Eğer bir id değeri dönmüyorsa, statüyü ilerletmek için yapılması gereken kontrolü başka metotlarla
    yapmak gerekir.
    Örneğin ürün gönderme akışında, ürünleri listeleyen servisi çağırıp onun çıktısını
    filtreleyerek kontrol edilebilir ya da bazı kendini bilmez API tasarımcılarının listeleme
    için bir servis sunmaması durumunda oluşturma isteği atıp hata almak gibi yeraltı metotlarına
    başvurmak da gerekebilir.
4. ongoing
    Bu statü, sent_to_remote statüsü ile aynı durumu ifade ediyor arada ufak bir nüans farkı var.
    O da sent_to_remote statüsünde olan BatchRequest nesneleri için işlemin sonuçlanıp sonuçlanmadığını
    kontrol ettiğimizde hala devam ettiği durumda ongoing statüsüne ilerletiyoruz.
5. done
    BatchRequest içerisindeki tüm nesnelerin işlendiğini ifade ediyor.
    Bu nesnelerin hepsi hata almış da olabilir.
    Buradaki `done` BatchRequest'in başarılı sonlanması anlamına geliyor.
    Ürünlerin kendi başlarına hata alması `done` statüsüne geçişe engel bir teşkil etmiyor.
    Statü geçişi sırasında, mevcut BatchRequest nesnesi içerisinde işlenen ürünler için geri bildirim
    verilmesi gerekiyor.
    Örneğin ürünler satış kanalında oluştuysa, satış kanalında bir id'ye sahip oldukları anlamına geliyor.
    Bu id'nin Omnitron tarafına beslenmesi gerekiyor ki sonradan yapılan güncellemelerde satış kanalına
    hangi id ile istek atılması gerektiği bilinsin.
6. fail
    Mevcut BatchRequest'te işlenen nesnelerin tamamı işlenmeden, işlemin durdurulmasına yol açacak bir
    hata olduysa ya da daha satış kanalına gönderme isteğine sıra gelmeden nesnelerin tamamında
    eksik bir nokta varsa bu statü ile işlem sonlanabilir.

Senkron Akışlar
-----------------------------------
.. image:: images/sync.png

Satış Kanalı servisleri senkron olarak çalışıyorsa, atılan isteğe referans id'si dönmek yerine doğrudan
asıl beklediğimiz sonuçla alakalı bir çıktı üretiyorsa, ortaya daha basit bir süreç çıkıyor.

Adımlar
~~~~~~~~~~
1. BatchRequest kaydını oluştur.
    `initialized` statüsünde olarak oluşuyor.
    Bu aşamada BatchRequest, herhangi bir model tipine atanmaz.
2. Akış içerisinde işlenecek nesneler çekilir.
    Bunlar ürün akışında ürünleri, stok akışında stokları temsil eder.
3. Akıştaki işlediğimiz nesneleri belirtmek için BatchRequest'i `commit` statüsüne geçiriyoruz.
    Burada model tipi (content_type) olarak ana işlenen akış neyse onu koymalıyız.
    Örneğin ürünleri gönderiyorsak ve de ürün akışında stok, fiyat ve fotoğraf gibi modelleri de
    beslememiz gerekiyorsa, BatchRequest'in model tipi "product" olmalı.
    BatchRequest içerisinde gönderilen `objects` bloğunda ise her bir model kendi tipiyle
    (Evet, hem BatchRequest'in model tiplerini,  hem de içerisinde `objects` bloğunda
    gönderilen nesnelerin model tiplerini besliyoruz.) gönderiliyor.
4. Satış kanalına isteği gönderiyoruz ve sonucunu alıyoruz.
5. Satış kanalından gelen sonuca göre BatchRequest'i `done` ya da `fail` statülerine ilerletiyoruz.
    `fail` statüsü için `objects` bilgisini beslemeye gerek yok ancak nesnelerle ilgili tekil olarak
    hataları saklamak istiyorsak `objects` parametresini koymak gereklidir.


Asenkron Akışlar
------------------------------
Satış Kanalı servisleri asenkron olarak çalışıyorsa, atılan isteğin gerçek sonucunu değil,
sonucu kontrol etmek için bir referans id'si dönmesi beklenir.
Bunun sebebi yapılacak işlemin uzun sürebilmesinden kaynaklıdır.
Örneğin ürün gönderme akışında 1000 ürün işlediğini düşünürsek, senkron çalışacak şekilde
tasarlandığında sağlıklı bir süreç oluşturması pek olası değil.
Aynı zamanda onlarca yüzlerce farklı müşteri de ürün girişi yapıyor olabilir.
Bunların sıralı olarak işlenmesi gerekiyor.
İşlenen veriler de birbirini etkileyebileceği için paralel olarak işlem yapmak mümkün de olmayabilir.

İlk üç adım senkron yapı ile aynı olduğu için 4. adımdan başlanarak anlatılacaktır.

Adımlar
~~~~~~~~~~
4. Satış kanalına attığımız istekte, isteğin asıl sonucunu değil, asıl sonucu kontrol etmek için
    gönderilen id değerini alıyoruz.
    Herhangi bir değer gönderilmezse satış kanalına kontrol için attığımız sorguyu (7. adım)
    farklı bir şekilde yapmamız gerekiyor.

5. BatchRequest'in statüsünü `sent_to_remote` statüsüne güncelliyoruz ve 4. adımda bir referans id'si
    geri döndüyse, güncelleme sırasında `remote_batch_id` alanına da o değeri besliyoruz.

6. Bu adımdan başlayarak akış yeni bir task üzerinden devam ediyor.
    Önceki adımda süreç asenkron olduğu için statüyü ilerletip task'ı sonlandırmıştık.
    Belirli aralıklarla deneyerek sürecin tamamlandığını kontrol etmemiz gerekiyor.
    Başarılı ya da başarısız bir sonuç aldığımızda da gerekli güncellemeleri yapıp süreci sonlandırıyoruz.
    Statüsü `sent_to_remote` ya da `ongoing` olan BatchRequest nesnelerini sorguluyoruz.

7. BatchRequest içerisindeki `remote_batch_id` değerini kullanarak akış içerisindeki nesnelerin
    durumlarını sorguluyoruz.
    Eğer referans için bir id yoksa satış kanalının farklı servislerini kullanarak işlemin durumunu
    kontrol etmek gerekecektir.
    Bu aşamada BatchRequest nesnelerini çektikten sonra Omnitron tarafında BatchRequest'e bağlı
    olan nesneleri de sorgulayıp onların `remote_id` değerlerini kullanarak istek atmak gerekir.

8. Son aşama olarak da satış kanalındaki güncel bilgilerle Omnitron tarafındaki statüyü de
    güncellememiz gerekiyor.
    Eğer işlem tamamlanmadıysa `ongoing` olarak güncelliyoruz ve bir sonraki denemede 6. adımdan başlayarak
    süreç yenileniyor.
    Eğer işlem tamamlandıysa ve satış kanalı, işlenen BatchRequest için genel bir hata döndüyse,
    statüyü `fail` olarak güncelliyoruz.


.. image:: images/async.png

