"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import AssetGrid from "../mmd-generator/components/AssetGrid";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";

const client = generateClient<Schema>();

export default function ManageAssets() {
  const [models, setModels] = useState<Schema["Models"]["type"][]>([]);
  const [motions, setMotions] = useState<Schema["Models"]["type"][]>([]);
  const toast = useToast();

  const fetchAssets = async () => {
    try {
      const { data: modelData } = await client.models.Models.list();
      const { data: motionData } = await client.models.Motions.list();
      setModels(modelData);
      setMotions(motionData);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error fetching assets",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (
    asset: Schema["Models"]["type"],
    type: "Models" | "Motions",
  ) => {
    try {
      // Delete from storage
      await remove({ path: asset.pathToFiles });

      // Delete from database
      if (type === "Models") {
        await client.models.Models.delete({ id: asset.id });
      } else {
        await client.models.Motions.delete({ id: asset.id });
      }

      // Refresh the list
      await fetchAssets();

      toast({
        title: "Asset deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error deleting asset",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const AssetGridWithDelete = ({
    assets,
    type,
  }: {
    assets: Schema["Models"]["type"][];
    type: "Models" | "Motions";
  }) => (
    <Box position="relative">
      <AssetGrid assets={assets} assetType={type} />
      {assets.map((asset) => (
        <IconButton
          key={asset.id}
          aria-label="Delete asset"
          icon={<DeleteIcon />}
          position="absolute"
          top={4}
          right={4}
          size="sm"
          colorScheme="red"
          onClick={() => handleDelete(asset, type)}
        />
      ))}
    </Box>
  );

  return (
    <Box p={8}>
      <Heading mb={6}>Manage Your Assets</Heading>
      <Tabs>
        <TabList>
          <Tab>Models</Tab>
          <Tab>Motions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AssetGridWithDelete assets={models} type="Models" />
          </TabPanel>
          <TabPanel>
            <AssetGridWithDelete assets={motions} type="Motions" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
