import React, { useRef } from "react";
import { useState } from "react";
import {
  Text,
  Group,
  Button,
  createStyles,
  MantineTheme,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { CloudUpload } from "tabler-icons-react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { create } from "ipfs-http-client";

import { nftGramm } from "../../config";

import NFTGramm from "../../artifacts/contracts/NFT-Gramm.sol/NFTGramm.json";

const client = create("https://ipfs.infura.io:5001/api/v0");

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    bottom: -20,
    backgroundColor: "black !important",
  },
}));

function getActiveColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

const DropzoneField = ({ modalClose }) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const openRef = useRef();
  const [fileUrl, setFileUrl] = useState(null);
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    console.log(file);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      listNFTForSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function uploadToIPFS(fileUrl) {
    if (!fileUrl) return;
    const data = JSON.stringify({
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale(fileUrl) {
    const url = await uploadToIPFS(fileUrl);
    console.log(url);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftGramm, NFTGramm.abi, signer);
    console.log(url);
    let transaction = await contract.createToken(url);
    await transaction.wait();

    modalClose();
  }

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={() => {}}
        onReject={(files) => console.log("rejected files", files)}
        onChange={onChange}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
        maxSize={30 * 1024 ** 2}
        multiple
      >
        {(status) => (
          <div style={{ pointerEvents: "none" }}>
            <Group position="center">
              <CloudUpload size={50} color={getActiveColor(status, theme)} />
            </Group>
            <Text
              align="center"
              weight={700}
              size="lg"
              mt="xl"
              sx={{ color: getActiveColor(status, theme) }}
            >
              {status.accepted
                ? "Drop files here"
                : status.rejected
                ? "Image file less than 30mb"
                : "Upload resume"}
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
              <i>.png/.jpeg</i> files that are less than 30mb in size.
            </Text>
          </div>
        )}
      </Dropzone>

      <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current()}
      >
        Select files
      </Button>
    </div>
  );
};

export default DropzoneField;
