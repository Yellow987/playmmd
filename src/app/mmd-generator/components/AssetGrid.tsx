import React from "react";
import { Box, Grid, Image as ChakraImage, Text } from "@chakra-ui/react";
import { Schema } from "../../../../amplify/data/resource";
import { useDispatch } from "react-redux";
import { setModels } from "@/redux/mmdModels";
import { CharacterModelData } from "../constants";

interface Props {
  assets: Schema["Models"]["type"][];
}

const AssetGrid = (props: Props) => {
  const { assets } = props;
  const dispath = useDispatch();

  function handleAssetClick(asset: Schema["Models"]["type"]) {
    console.log(asset);
    dispath(
      setModels([
        {
          name: asset.title,
          path: asset.pathToFiles + "/model.bpmx",
          isLocalModel: false,
        } as CharacterModelData,
      ]),
    );
  }

  return (
    <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={4} p={4}>
      {assets.map((asset, i) => (
        <Box
          key={i}
          textAlign="center"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          overflow="hidden"
          bg="white"
          boxShadow="sm"
          display="inline-block"
          as="button"
          onClick={() => handleAssetClick(asset)}
        >
          <Box width="120px" height="120px" mx="auto" position="relative">
            <ChakraImage
              src={
                "https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?q=80&w=1314&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
          <Box p={2} bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <Text fontSize="sm" fontWeight="medium" color="gray.800">
              {asset.title}
            </Text>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default AssetGrid;
