import React, { useEffect, useState } from "react";
import { Box, Grid, Image as ChakraImage, Text } from "@chakra-ui/react";
import { Schema } from "../../../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { useDispatch } from "react-redux";
import { setModels } from "@/redux/mmdModels";
import { CharacterModelData } from "../constants";
import { ASSET_TYPE } from "./AssetChooser/MmdAssetChooserModal";
import { setAudioPath } from "@/redux/audio";
import { setMmdMotions, MotionData } from "@/redux/mmdMotions";

interface Props {
  assets: Schema["Models"]["type"][];
  assetType: ASSET_TYPE;
}

const AssetGrid = (props: Props) => {
  const { assets, assetType } = props;
  const dispatch = useDispatch();
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const loadThumbnails = async () => {
      const urls: { [key: string]: string } = {};
      for (const asset of assets) {
        try {
          const result = await getUrl({
            path: `${asset.pathToFiles}/thumbnail.jpg`,
          });
          urls[asset.title] = result.url.toString();
        } catch (error) {
          // If thumbnail doesn't exist, use a default placeholder
          urls[asset.title] =
            "https://via.placeholder.com/120x120?text=No+Image";
        }
      }
      setThumbnailUrls(urls);
    };

    loadThumbnails();
  }, [assets]);

  function handleAssetClick(asset: Schema["Models"]["type"]) {
    switch (assetType) {
      case "Models":
        dispatch(
          setModels([
            {
              name: asset.title,
              path: asset.pathToFiles + "/model.bpmx",
              isLocalModel: false,
            } as CharacterModelData,
          ]),
        );
        break;
      case "Motions":
        dispatch(
          setAudioPath({
            audioPath: asset.pathToFiles + "/song.wav",
            isLocalAudio: false,
          }),
        );
        dispatch(
          setMmdMotions([
            {
              motions: [asset.pathToFiles + "/motion1.vmd"],
              isLocalMotion: false,
            } as MotionData,
          ]),
        );
        break;
    }
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
                thumbnailUrls[asset.title] ||
                "https://via.placeholder.com/120x120?text=Loading..."
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
