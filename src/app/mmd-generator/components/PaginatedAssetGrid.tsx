import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Flex, Text, Select } from "@chakra-ui/react";
import { Schema } from "../../../../amplify/data/resource";
import AssetGrid from "./AssetGrid";
import { ASSET_TYPE } from "./AssetChooser/MmdAssetChooserModal";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import AssetEditor from "./AssetEditor";

interface Props {
  assetType: ASSET_TYPE;
}

const PaginatedAssetGrid = (props: Props) => {
  const { assetType } = props;
  const [assets, setAssets] = useState<Schema[typeof assetType]["type"][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<
    Schema[typeof assetType]["type"] | null
  >(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const client = generateClient<Schema>();

  // Function to fetch assets with pagination
  const fetchAssets = async (token: string | null = null, isForward = true) => {
    setIsLoading(true);

    let isUserSignedIn = false;
    try {
      await getCurrentUser();
      isUserSignedIn = true;
    } catch (error) {
      console.log("User not signed in:", error);
    }

    try {
      const {
        data: fetchedAssets,
        nextToken: newNextToken,
        errors,
      } = await (client.models[assetType].list as any)({
        limit: itemsPerPage,
        nextToken: token || "",
        authMode: isUserSignedIn ? "userPool" : undefined,
        // Sort by createdAt in descending order (newest first)
        // Note: createdAt is automatically added by Amplify Data
        sort: { field: "createdAt", direction: "desc" },
      });

      if (errors) {
        console.error("Errors fetching assets:", errors);
        return;
      }

      setAssets(fetchedAssets);

      // Update pagination state
      if (isForward) {
        if (token) {
          setPrevTokens([...prevTokens, token]);
        }
        setNextToken(newNextToken);
      }

      // Calculate total pages (approximate)
      if (fetchedAssets.length < itemsPerPage && !newNextToken) {
        const calculatedTotalPages = Math.ceil(
          (currentPage * itemsPerPage) / itemsPerPage,
        );
        setTotalPages(calculatedTotalPages);
      } else if (newNextToken) {
        setTotalPages(currentPage + 1);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAssets(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetType, itemsPerPage]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > currentPage) {
      // Going forward
      fetchAssets(nextToken, true);
    } else if (newPage < currentPage) {
      // Going backward
      const prevToken = prevTokens[prevTokens.length - 1];
      const newPrevTokens = prevTokens.slice(0, -1);
      setPrevTokens(newPrevTokens);
      fetchAssets(prevToken, false);
    }
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setPrevTokens([]);
    setNextToken(null);
  };

  // Handle opening the editor
  const handleEditAsset = (asset: Schema[typeof assetType]["type"]) => {
    setSelectedAsset(asset);
    setIsEditorOpen(true);
  };

  // Handle closing the editor
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedAsset(null);
  };

  // Handle successful asset update
  const handleUpdateSuccess = () => {
    // Refresh the assets list
    fetchAssets();
  };

  // Handle successful asset deletion
  const handleDeleteSuccess = () => {
    // Refresh the assets list
    fetchAssets();
    // Close the editor
    handleCloseEditor();
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Your {assetType}
        </Text>
        <Select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          width="auto"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </Select>
      </Flex>

      {isLoading ? (
        <Text textAlign="center" py={10}>
          Loading assets...
        </Text>
      ) : assets.length === 0 ? (
        <Text textAlign="center" py={10}>
          No {assetType.toLowerCase()} found. Upload some!
        </Text>
      ) : (
        <AssetGrid
          assets={assets}
          assetType={assetType}
          onEditAsset={handleEditAsset}
        />
      )}

      {/* Asset Editor Modal */}
      {selectedAsset && (
        <AssetEditor
          asset={selectedAsset}
          assetType={assetType}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSuccess={handleUpdateSuccess}
          onDelete={handleDeleteSuccess}
        />
      )}

      {/* Pagination controls */}
      <Flex justifyContent="center" mt={6} gap={2}>
        <Button
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>

        <Text alignSelf="center" mx={2}>
          Page {currentPage} of {totalPages}
        </Text>

        <Button
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={!nextToken || isLoading}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default PaginatedAssetGrid;
