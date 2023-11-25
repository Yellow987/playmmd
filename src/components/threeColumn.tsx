import { Box, Button, Flex, SimpleGrid, chakra } from '@chakra-ui/react'
import React from 'react'
import Horozontalcard from './horozontalcard'
import YellowVRC_1 from '../../assets/YellowVRC_1.png'
import UnderConstruction from './underConstruction'

function ThreeColumn() {

  const todo = (<UnderConstruction size={20} />)
  return (
    <Flex
      bg="#edf3f8"
      _dark={{
        bg: "#3e3e3e",
      }}
      pt={20}
      px={{
        base: "2",
        md: "20",
      }}
      w="full"
      justifyContent="center"
      alignItems="center"
      //pos="absolute"
    >
      <Box
        shadow="xl"
        bg="white"
        _dark={{
          bg: "gray.800",
        }}
        px={{
          base: 4,
          md: 8
        }}
        py={20}
        mx="auto"
        maxWidth="container.lg"
      >
        <Horozontalcard 
          title="Dwelling in the Digital"
          description='V-Tuber, Virtual girl, Animations, and More!'
          buttonText='Learn More'
          link='/digital'
          image='/images/YellowSmile_2.png'
        />

        <Horozontalcard 
          title="Tech & Software"
          description='Details of my projects! - CageFreeHub - yellowdesi.us'
          buttonText={todo}
          link='/tech'
          image='/images/YellowVRC_1.png'
        />
        
        <Horozontalcard 
          title="Doing a Little Good"
          description='Effective Altruism, Giving What We Can, Veganism'
          buttonText={todo}
          link='/good'
          image='/images/YellowSmile.png'
        />
      </Box>
    </Flex>
  )
}

export default ThreeColumn