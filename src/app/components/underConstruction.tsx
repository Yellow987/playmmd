import { Box, Center } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image';

interface UnderConstructionProps {
  size: number;
}

function UnderConstruction(props: UnderConstructionProps) {
  return (
    <Center>
      <Image
        src='/images/rem.gif'
        alt='under-construction'
        width={props.size}
        height={props.size}
        quality={25}
      />
      Under Construction
    </Center>
  )
}

export default UnderConstruction