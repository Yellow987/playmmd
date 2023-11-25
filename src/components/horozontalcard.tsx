import { SimpleGrid, chakra, Button, Box } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image';
import { Link } from '@chakra-ui/next-js';

interface HorizontalCardProps {
  title: string;
  description: string;
  buttonText: string | React.ReactNode;
  link: string;
  image: string;
}

function Horozontalcard(props: HorizontalCardProps) {
  return (
    <SimpleGrid
      alignItems="start"
      columns={{
        base: 1,
        md: 2,
      }}
      mb={24}
      spacingY={{
        base: 10,
        md: 32,
      }}
      spacingX={{
        base: 10,
        md: 24,
      }}
    >
      <Box>
        <chakra.h2
          mb={4}
          fontSize={{
            base: "2xl",
            md: "4xl",
          }}
          fontWeight="bold"
          textAlign={{
            base: "center",
            md: "left",
          }}
          color="gray.900"
          _dark={{
            color: "gray.400",
          }}
          lineHeight={{
            md: "shorter",
          }}
          textShadow="2px 0 currentcolor"
        >
          {props.title}
        </chakra.h2>
        <chakra.p
          mb={5}
          textAlign={{
            base: "center",
            sm: "left",
          }}
          color="gray.600"
          _dark={{
            color: "gray.400",
          }}
          fontSize={{
            md: "lg",
          }}
        >
          {props.description}
        </chakra.p>
        <Link href={props.link}>
          <Button
            w={{
              base: "full",
              sm: "auto",
            }}
            size="lg"
            bg="gray.900"
            _dark={{
              bg: "gray.700",
            }}
            _hover={{
              bg: "gray.700",
              _dark: {
                bg: "gray.600",
              },
            }}
            color="gray.100"
          >
            {props.buttonText}
          </Button>
        </Link>
      </Box>
      <Box
        style={{
          maxHeight: "500px",
          minHeight: "350px",
          position: "relative",
        }}
      >
        <Image
          src={props.image}
          alt="dance gif"
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
    </SimpleGrid>
  )
}

export default Horozontalcard 