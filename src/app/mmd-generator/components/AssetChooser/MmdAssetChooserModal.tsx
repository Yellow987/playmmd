import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";
import { BiUpload } from "react-icons/bi"; // BoxIcons
import { FaCloudUploadAlt } from "react-icons/fa"; // Font Awesome
import { useDispatch, useSelector } from "react-redux";
import { BpmxConverter, MmdMesh, MmdModel } from "babylon-mmd";
import { localAssets } from "../../MmdViewer";
import ModelPublisher from "./ModelPublisher";
import { RootState } from "@/redux/store";
import AssetGrid from "../AssetGrid";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../../../../amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import { Scene } from "@babylonjs/core/scene";
import PmxUploader from "./PmxUploader";
import MotionUploader from "./MotionUploader";
import MotionPublisher from "./MotionPublisher";

// Extend the type definition to include non-standard attributes
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export type ASSET_TYPE = "Models" | "Motions";

export type MotionFiles = {
  songFile: File | undefined;
  motionsFiles: File[];
  cameraFile?: File;
};

interface Props {
  localFilesRef: MutableRefObject<localAssets[]>;
  sceneRef: MutableRefObject<Scene | null>;
  assetType: ASSET_TYPE;
}

const MmdAssetChooserModal = (props: Props) => {
  const { localFilesRef, sceneRef, assetType } = props;
  const [motionData, setMotionData] = useState<MotionFiles>({
    songFile: undefined,
    motionsFiles: [],
    cameraFile: undefined,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: uploaderIsOpen,
    onOpen: uploaderOnOpen,
    onClose: uploaderOnClose,
  } = useDisclosure();
  const {
    isOpen: publisherIsOpen,
    onOpen: publisherOnOpen,
    onClose: publisherOnClose,
  } = useDisclosure();
  const mmdModels = useSelector((state: RootState) => state.mmdModels.models);
  const client = generateClient<Schema>();

  const [assets, setAssets] = useState<Schema[typeof assetType]["type"][]>([]);
  const mmdMeshRef = useRef<MmdMesh>(null);

  useEffect(() => {
    async function getAssets() {
      let isUserSignedIn = false;
      try {
        await getCurrentUser();
        isUserSignedIn = true;
      } catch (error) {
        console.log(error);
      }

      const {
        data: assets,
        nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
        errors,
      } = await (client.models[assetType].list as any)({
        limit: 100, // default value is 100
        nextToken: "",
        authMode: isUserSignedIn ? "userPool" : undefined,
      });
      setAssets(assets);
      console.log(assets);
      console.log(errors);
    }
    getAssets();
  }, []);

  const closeAllModals = () => {
    uploaderOnClose();
    publisherOnClose();
    onClose();
  };

  return (
    <>
      {/* Button to open the chooser */}
      <Button w="full" onClick={onOpen}>
        Open Chooser
      </Button>

      {/* Fullscreen chooser modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxW="95%" // Set maximum width to 90% of the screen
          borderRadius="lg" // Rounded corners
          overflow="auto" // Prevent content overflow
          height="95vh" // Set maximum height to 90% of the screen
          my={4}
        >
          <ModalHeader>
            {/* Flexbox to layout title and buttons */}
            <Flex justifyContent="space-between" alignItems="center">
              <Box>Model Selector</Box>
              <Flex gap={4} mr={8}>
                <Button
                  size="sm"
                  colorScheme="teal"
                  // onClick={() => inputRef.current?.click()}
                  onClick={uploaderOnOpen}
                >
                  <BiUpload
                    size={24}
                    title="Upload"
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Upload
                </Button>
                <Modal isOpen={uploaderIsOpen} onClose={uploaderOnClose}>
                  <ModalOverlay />
                  <ModalContent
                    maxW="90%" // Set maximum width to 90% of the screen
                    height="82vh"
                    borderRadius="lg" // Rounded corners
                    overflow="auto"
                  >
                    <ModalHeader>
                      <ModalBody>
                        {(() => {
                          switch (assetType) {
                            case "Models":
                              return (
                                <PmxUploader
                                  localFilesRef={localFilesRef}
                                  mmdMeshRef={mmdMeshRef}
                                />
                              );
                            case "Motions":
                              return (
                                <MotionUploader
                                  motionData={motionData}
                                  setMotionData={setMotionData}
                                  onComplete={closeAllModals}
                                />
                              );
                            default:
                              return null; // Return null if no match is found
                          }
                        })()}
                      </ModalBody>
                    </ModalHeader>
                    <ModalCloseButton />
                  </ModalContent>
                </Modal>
                <Button
                  size="sm"
                  colorScheme="orange"
                  isDisabled={!mmdModels[0].isLocalModel}
                  onClick={publisherOnOpen}
                >
                  <FaCloudUploadAlt
                    size={24}
                    title="Upload"
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Publish
                </Button>
                <Modal isOpen={publisherIsOpen} onClose={publisherOnClose}>
                  <ModalOverlay />
                  <ModalContent
                    maxW="90%" // Set maximum width to 90% of the screen
                    height="82vh"
                    borderRadius="lg" // Rounded corners
                    overflow="auto"
                  >
                    <ModalHeader>
                      <ModalBody>
                        {(() => {
                          switch (assetType) {
                            case "Models":
                              return (
                                <ModelPublisher
                                  mmdMeshRef={mmdMeshRef}
                                  sceneRef={sceneRef}
                                  localFilesRef={localFilesRef}
                                />
                              );
                            case "Motions":
                              return (
                                <MotionPublisher
                                  motionData={motionData}
                                  onComplete={closeAllModals}
                                />
                              );
                            default:
                              return null; // Return null if no match is found
                          }
                        })()}
                      </ModalBody>
                    </ModalHeader>
                    <ModalCloseButton />
                  </ModalContent>
                </Modal>
              </Flex>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <AssetGrid assets={assets} assetType={assetType} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MmdAssetChooserModal;
