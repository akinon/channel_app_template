===========
Ürün Verisi
===========


Product Simple Data
=================

..  code-block:: python

    {
        "pk": 12227,
        "name": "Kırmızı Tişört",
        "base_code": "1KBATC0231",
        "sku": "1KBATC0231001",
        "product_type": "0",
        "is_active": true,
        "parent": null,
        "attributes": {
            "boyut": "34X34",
            "renk": "001",
            "uretim_yeri": "Türkiye",
            "materyal": "%100 POLYESTER",
        },
        "productimage_set": [
            {
                "pk": 20044,
                "status": "active",
                "image": "http://localhost:8001/media/products/2021/10/17/12227/1bfe74b4-175e-4c1a-80f2-b355feae498c.jpg"
            }
        ],
        "attribute_set": 2,
        "productization_date": "2017-01-23T16:40:58.578504Z"
    }


Üründe Mapping Verisi
======================

Ürün datasının içerisine Akinon üzerinde satış kanalının özellikleri için
yapılmış eşleşme(mapping) servisinden geçirilmiş sonucunun eklenmiş halidir.

`mapped_attributes` özellik ismi ile ürün datasında yer alır ve firmanın ihtiyaç duyacağı özellik eşleştirme
sonuçları yer almaktadır.

|    `mapped_attribute_values` kısmında özelliğin omnitron id'si ile birlikte
satış kanalındaki özel kodu(remote_id) ve diğer özellik bilgierine ulaşılabilir.

|   `attribute_set_id` ve `attribute_set_name` kısmı omnitronda yer alan satış kanalındaki bu ürünün
hangi özellik setine denk geldiğinin bilgisidir.

|   `attribute_set_remote_id` kısmı özellik setinin satış kanalındaki temsil eden eşsiz kodudur.
|
..  code-block:: python

    {
        "pk": 12227,
        "name": "Kırmızı Tişört",
        "base_code": "1KBATC0231",
        "sku": "1KBATC0231001",
        "product_type": "0",
        "is_active": true,
        "parent": null,
        "attributes": {
            "boyut": "34X34",
            "renk": "001",
            "uretim_yeri": "Türkiye",
            "materyal": "%100 POLYESTER",
        },
        "productimage_set": [
            {
                "pk": 20044,
                "status": "active",
                "image": "http://localhost:8001/media/products/2021/10/17/12227/1bfe74b4-175e-4c1a-80f2-b355feae498c.jpg"
            }
        ],
        "attribute_set": 2,
        "productization_date": "2017-01-23T16:40:58.578504Z",
        "mapped_attributes": {
            "pk": 370,
            "mapped_attributes": {
                "size": "34 - 34"
                "color": "red",
                "age": "std",
                "desc": "%100 POLYESTER"
            },
            "attribute_set_id": 1,
            "attribute_set_name": "Giyim",
            "attribute_set_remote_id": null,
            "mapped_attribute_values": {
                "123": {
                    "attribute_name": "size",
                    "label": "34 - 34",
                    "value": "34 - 34",
                    "attribute_remote_id": 22,
                    "is_required": true,
                    "is_variant": false,
                    "is_custom": false,
                    "is_meta": false
                },
                "223": {
                    "attribute_name": "color",
                    "label": "RED",
                    "value": "red",
                    "attribute_remote_id": 23,
                    "is_required": true,
                    "is_variant": false,
                    "is_custom": false,
                    "is_meta": false
                },
            }
        }
    }

Üründe Stok Verisi
===================

Ürün datasının içerisine stok bilgisinin eklenmiş halidir.

productstock ismi ile ürün datasında yer alan verinin içerisinde;

|   `stock` kısmında satılabilir stok miktarı vardır.
|
|   `stock_list` kısmında akinondaki stok listesinin ID bilgisi vardır
|
|   `unit_type` kısmında miktar bilgisinin birimi vardır.
|
|   `sold_quantity_unreported` kısımında akinondaki rezerve stok miktarı vardır.
|
|   `modified_date` son güncelleme tarihi vardır.

..  code-block:: python

    {
        "pk": 12227,
        "name": "Kırmızı Tişört",
        "base_code": "1KBATC0231",
        "sku": "1KBATC0231001",
        "product_type": "0",
        "is_active": true,
        "parent": null,
        "attributes": {
            "boyut": "34X34",
            "renk": "001",
            "uretim_yeri": "Türkiye",
            "materyal": "%100 POLYESTER",
        },
        "productimage_set": [
            {
                "pk": 20044,
                "status": "active",
                "image": "http://localhost:8001/media/products/2021/10/17/12227/1bfe74b4-175e-4c1a-80f2-b355feae498c.jpg"
            }
        ],
        "attribute_set": 2,
        "productization_date": "2017-01-23T16:40:58.578504Z",
        "productstock": {
            {
                "pk": 1,
                "product": 2250,
                "stock": 46,
                "stock_list": 1,
                "unit_type": "qty",
                "extra_field":{},
                "sold_quantity_unreported": 0,
                "modified_date": "2017-01-23T13:37:31.947171Z"
            }
        }
    }

Üründe Fiyat Verisi
====================

Ürün datasının içerisine price bilgisinin eklenmiş halidir.

productprice ismi ile ürün datasında yer alan verinin içerisinde;

|   `price` satış fiyatı vardır
|
|   `price_list` kısmında akinondaki fiyat listesinin ID bilgisi vardır
|
|   `currency_type` kısmında fiyat bilgisinin birimi vardır.
|
|   `tax_rate` kısımında vergi oranı vardır.
|
|   `retail_price` kısmında ürünün mağaza fiyatı vardır.
|
|   `discount_percentage` kısmında ürünün üzerindeki indirim bilgisi vardır.
|
|   `modified_date` son güncelleme tarihi vardır.

..  code-block:: python

    {
        "pk": 12227,
        "name": "Kırmızı Tişört",
        "base_code": "1KBATC0231",
        "sku": "1KBATC0231001",
        "product_type": "0",
        "is_active": true,
        "parent": null,
        "attributes": {
            "boyut": "34X34",
            "renk": "001",
            "uretim_yeri": "Türkiye",
            "materyal": "%100 POLYESTER",
        },
        "productimage_set": [
            {
                "pk": 20044,
                "status": "active",
                "image": "http://localhost:8001/media/products/2021/10/17/12227/1bfe74b4-175e-4c1a-80f2-b355feae498c.jpg"
            }
        ],
        "attribute_set": 2,
        "productization_date": "2017-01-23T16:40:58.578504Z",
        "productprice": {
            "pk": 2,
            "product": 913,
            "price": "62.44",
            "price_list": 1,
            "currency_type": "try",
            "tax_rate": "8.00",
            "retail_price": "249.75",
            "extra_field": {},
            "discount_percentage": "75.00",
            "modified_date": "2017-01-23T18:29:23.716095Z"
        }
    }


Üründe Kategori Verisi
=======================

Ürün datasının içerisine kategori bilgilerini eklenmiş halidir.

category_nodes ile ürün datasında yer alan kategori verisinin içinde;

|   name alanı kategorinin adıdır.
|

..  code-block:: python

    {
        "pk": 12227,
        "name": "Kırmızı Tişört",
        "base_code": "1KBATC0231",
        "sku": "1KBATC0231001",
        "product_type": "0",
        "is_active": true,
        "parent": null,
        "attributes": {
            "boyut": "34X34",
            "renk": "001",
            "uretim_yeri": "Türkiye",
            "materyal": "%100 POLYESTER",
        },
        "productimage_set": [
            {
                "pk": 20044,
                "status": "active",
                "image": "http://localhost:8001/media/products/2021/10/17/12227/1bfe74b4-175e-4c1a-80f2-b355feae498c.jpg"
            }
        ],
        "attribute_set": 2,
        "productization_date": "2017-01-23T16:40:58.578504Z"
        "category_nodes": [
            {
                "pk": 255,
                "name": "Shop",
                "order": 1,
                "numchild": 4,
                "depth": 1,
                "sort_option": 20,
                "uuid": "cf461e84-1f19-497b-8fb8-555805e58221",
                "path": "0001",
                "created_date": "2021-10-06T13:48:07.643569Z",
                "modified_date": "2021-11-01T13:54:52.526750Z"
            }
        ]
    }

Senkron veya Asenkron Satış Kanalı Süreç
===========================================

is_sync parameteresi, çalışacak olan ürün sürecinin senkron veya asenkron olup
olmadığı ile ilgilidir.

Eğer insert, update veya delete gibi işlemler satış kanalına
gönderildiği anda hemen işleniyorsa ve sonucu response içerisinde dönüyorsa bu
*senkron* bir işlemdir.
Senkron işlemlerde ürün ile ilgili olan commandların
ProductBatchRequestResponseDto formatında veri dönmesi gerekir
. :ref:`Ürün Oluşturma/Güncelleme İşlem Sonuç Üretme`

..  code-block:: python

    data: any
    report: List[ErrorReportDto]
    response_data: List[ProductBatchRequestResponseDto]
    return response_data, report, data

Eğer süreçler asenkron olarak işleniyorsa ilgili satış kanalından daha sonra
kontrol edilmek üzere bir kod dönmesi gerekir (remote_batch_request_id).

..  code-block:: python

    remote_batch_id = response.get("remote_batch_request_id")
    self.batch_request.remote_batch_id = remote_batch_id
    return "", report, data

Eğer bir süreç asenkron ama satış kanalında ön kontrolü varsa ve bazı kayıtları
işlemek üzere işleme alıp bazıları ile ilgili hemen sonucunu paylaşıyorsa,
asenkron olsa dahi sorun olan kayıtların hatalarının neler olduğunu
işaretlemek gerekir. Bu sorunlar hata raporlarında görünür.

.. code-block:: python

   self.failed_object_list.append(
       (price, ContentType.product_stock.value,
        "Product has not been sent"))
