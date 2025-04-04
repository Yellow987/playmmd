import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Image as ChakraImage,
  Text,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { Schema } from "../../../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { useDispatch } from "react-redux";
import { setModels } from "@/redux/mmdModels";
import { CharacterModelData } from "../constants";
import { ASSET_TYPE } from "./AssetChooser/MmdAssetChooserModal";
import { FiEdit } from "react-icons/fi";
import { setAudioPath } from "@/redux/audio";
import { setMmdMotions, MotionData } from "@/redux/mmdMotions";
import { CameraData, setMmdCameraData } from "@/redux/cameras";

interface Props {
  assets: Schema["Models"]["type"][];
  assetType: ASSET_TYPE;
  onEditAsset?: (
    asset: Schema["Models"]["type"] | Schema["Motions"]["type"],
  ) => void;
}

const AssetGrid = (props: Props) => {
  const { assets, assetType, onEditAsset } = props;
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

  async function handleAssetClick(asset: Schema["Models"]["type"]) {
    switch (assetType) {
      case "Models":
        // For models, we now use the zip file instead of BPMX
        dispatch(
          setModels([
            {
              name: asset.title,
              path: asset.pathToFiles + `/${asset.title}.zip`,
              isLocalModel: false,
              isZipModel: true, // Add a flag to indicate this is a zip model
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
          dispatch(
            setMmdCameraData({
              cameraPath: asset.pathToFiles + "/camera1.vmd",
              isLocalMotion: false,
            } as CameraData),
          ),
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
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.800">
                {asset.title}
              </Text>
              {onEditAsset && (
                <IconButton
                  aria-label="Edit asset"
                  icon={<FiEdit />}
                  size="xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent click
                    onEditAsset(asset);
                  }}
                />
              )}
            </Flex>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default AssetGrid;
