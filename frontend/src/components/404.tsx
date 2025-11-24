import { Flex, Image, Text } from '@akinon/ui-react';

import notFoundGif from '@/assets/404_notfound.gif';

export const NotFound = () => {
  return (
    <Flex justify="center" align="center" vertical>
      <Image src={notFoundGif} alt="404" height={400} preview={false} />
      <Text>Sayfa bulunamadı</Text>
    </Flex>
  );
};
