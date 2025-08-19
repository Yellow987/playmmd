import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Image as ChakraImage,
  Text,
  IconButton,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Schema } from "../../../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { useDispatch } from "react-redux";
import { setModels } from "@/redux/mmdModels";
import { CharacterModelData } from "../constants";
import { ASSET_TYPE } from "./AssetChooser/MmdAssetChooserModal";
import { FiEdit, FiDownload } from "react-icons/fi";
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
  const toast = useToast();
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>(
    {},
  );
  const [downloadingAssets, setDownloadingAssets] = useState<Set<string>>(
    new Set(),
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

  const handleDownload = async (
    asset: Schema["Models"]["type"],
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent asset selection when clicking download

    const assetId = asset.title;
    setDownloadingAssets((prev) => new Set(prev).add(assetId));

    try {
      switch (assetType) {
        case "Models":
          await downloadModel(asset);
          break;
        case "Motions":
          await downloadMotion(asset);
          break;
      }

      toast({
        title: "Download Started",
        description: `${asset.title} download initiated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: `Failed to download ${asset.title}. Please try again.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDownloadingAssets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(assetId);
        return newSet;
      });
    }
  };

  const downloadModel = async (asset: Schema["Models"]["type"]) => {
    const zipPath = `${asset.pathToFiles}/${asset.title}.zip`;
    const result = await getUrl({ path: zipPath });

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = result.url.toString();
    link.download = `${asset.title}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMotion = async (asset: Schema["Models"]["type"]) => {
    const files = [
      { name: "song.wav", path: `${asset.pathToFiles}/song.wav` },
      { name: "motion1.vmd", path: `${asset.pathToFiles}/motion1.vmd` },
      { name: "camera1.vmd", path: `${asset.pathToFiles}/camera1.vmd` },
    ];

    // Download all files sequentially
    for (const file of files) {
      try {
        const result = await getUrl({ path: file.path });
        const link = document.createElement("a");
        link.href = result.url.toString();
        link.download = `${asset.title}_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small delay between downloads to prevent overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`Failed to download ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
  };

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
          position="relative"
          cursor="pointer"
          transition="transform 0.2s, box-shadow 0.2s"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "md",
          }}
          onClick={(e) => {
            // If onEditAsset is provided, clicking the asset opens the editor
            if (onEditAsset) {
              e.stopPropagation();
              onEditAsset(asset);
            } else {
              // Otherwise, use the default behavior (select the asset)
              handleAssetClick(asset);
            }
          }}
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
          <Flex
            p={2}
            bg="gray.50"
            borderTop="1px solid"
            borderColor="gray.200"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.800"
              flex="1"
              textAlign="left"
            >
              {asset.title}
            </Text>
            <Button
              size="xs"
              colorScheme="green"
              variant="solid"
              leftIcon={<FiDownload />}
              onClick={(e) => handleDownload(asset, e)}
              isLoading={downloadingAssets.has(asset.title)}
              loadingText="..."
              ml={2}
              minW="60px"
            >
              {downloadingAssets.has(asset.title) ? "" : "Get"}
            </Button>
          </Flex>
        </Box>
      ))}
    </Grid>
  );
};

export default AssetGrid;
