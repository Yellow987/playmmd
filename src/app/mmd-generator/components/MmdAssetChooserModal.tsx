import React, { MutableRefObject, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import { BiUpload } from "react-icons/bi"; // BoxIcons
import { FaCloudUploadAlt } from "react-icons/fa"; // Font Awesome
import { useDispatch } from "react-redux";
import { setModels } from "@/redux/mmdModels";
import { CharacterModelData } from "../constants";
import { BpmxConverter } from "babylon-mmd";
import PmxConverterScene from "./PmxConverterScene";
import PmxUploader from "./PmxUploader";
import { localAssets } from "../MmdViewer";

// Extend the type definition to include non-standard attributes
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface Props {
  localFilesRef: MutableRefObject<localAssets[]>;
}

const MmdAssetChooserModal = (props: Props) => {
  const { localFilesRef } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: uploaderIsOpen,
    onOpen: uploaderOnOpen,
    onClose: uploaderOnClose,
  } = useDisclosure();

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   console.log("Selected files:", files);
  //   if (!files) return;

  //   // Convert FileList to an array for easier manipulation
  //   const fileArray = Array.from(files);

  //   // Look for the main PMX file
  //   const pmxFile = fileArray.find((file) => file.name.endsWith(".pmx"));
  //   if (!pmxFile) {
  //     console.error("No .pmx file found.");
  //     return;
  //   }

  //   // Generate object URLs for the files
  //   const objectURLs: Record<string, string> = {};
  //   fileArray.forEach((file) => {
  //     objectURLs[file.name] = URL.createObjectURL(file);
  //   });

  //   console.log(pmxFile.name);

  //   const converter = new BpmxConverter();

  //   dispatch(
  //     setModels([
  //       {
  //         name: pmxFile.name,
  //         path: objectURLs[pmxFile.name],
  //         isLocalModel: true,
  //       } as CharacterModelData,
  //     ]),
  //   );

  //TODO: release files after next upload
  // };

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
                {/* <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }} // Hide the input element
                  onChange={handleFileChange}
                  webkitdirectory="true" // Enables folder selection
                  directory="true" // Redundant, but for compatibility
                /> */}
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
                        <PmxUploader localFilesRef={localFilesRef} />
                      </ModalBody>
                    </ModalHeader>
                    <ModalCloseButton />
                  </ModalContent>
                </Modal>
                <Button
                  size="sm"
                  colorScheme="orange"
                  isDisabled={true}
                  onClick={() => alert("Action 2 triggered!")}
                >
                  <FaCloudUploadAlt
                    size={24}
                    title="Upload"
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Publish
                </Button>
              </Flex>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box
              h="full"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Button m={4} onClick={() => alert("Option 1 chosen!")}>
                Option 1
              </Button>
            </Box>
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
