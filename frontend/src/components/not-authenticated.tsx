import { Result } from '@akinon/ui-react';

export function NotAuthenticated() {
  return (
    <Result
      status='403'
      title='Yetkilendirme Gerekli'
      subTitle='Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir. Lütfen hesabınıza giriş yapın veya sistem yöneticinizle iletişime geçin.'
    />
  );
}