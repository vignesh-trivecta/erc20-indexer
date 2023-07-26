import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [nfts, setNfts]= useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  async function getTokenBalance() {
    const config = {
      apiKey: 's7ypqu8C6n0h2UrXk-o2ZHbFMFJoGq9j',
      network: Network.ETH_MAINNET,
    };

    // NFT
        const nftList = await alchemyWeb3.getNftsForOwner(ownerAddress);
        // Filter the NFTs to get only the verified or not scam genuine NFTs
        const verifiedNFTs = nftList.filter((nft) => !nft.spamInfo.isScam);
        setNfts(verifiedNFTs)

    // ERC-20 tokens
    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);
    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
  }
  return (
    <Box>
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Connect your wallet and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <Tabs isFitted variant='enclosed'>
            <TabList mb='1em' justifyContent={'center'}>
              <Tab>ERC-20 a.k.a TOKENS</Tab>
              <Tab>ERC-721 a.k.a NFT'S</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex flexDirection={{sm: 'column', md:'row'}} justify={'center'}  flexWrap="wrap" spacing={24} rounded={'md'}>
                  {results.tokenBalances.map((e, i) => {
                    return (
                        <Card width={'300px'}  padding={'20px'} borderRadius={'10px'} margin={'8px'}
                        background="rgba(255, 255, 255, 0.25)"
                        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                        backdropFilter="blur(4px)"
                        WebkitBackdropFilter="blur(4px)"
                        border="1px solid rgba(255, 255, 255, 0.18)"
                        >
                          <CardBody>
                            <Text><b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;</Text>
                            <Text><b>Balance:</b>&nbsp;{Utils.formatUnits(e.tokenBalance,tokenDataObjects[i].decimals)}</Text>
                          </CardBody>
                        </Card>
                    );
                  })}
                </Flex>
              </TabPanel>
              <TabPanel>
              <Flex flexDirection={{sm: 'column', md:'row'}} justify={'center'}  flexWrap="wrap" spacing={24} rounded={'md'}>
                  {nfts.ownedNfts.map((e, i) => {
                    return (
                        <Card width={'300px'}  padding={'20px'} borderRadius={'10px'} margin={'8px'}
                        background="rgba(255, 255, 255, 0.25)"
                        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                        backdropFilter="blur(4px)"
                        WebkitBackdropFilter="blur(4px)"
                        border="1px solid rgba(255, 255, 255, 0.18)"
                        >
                          <CardBody>
                            <Text><b>Symbol:</b>&nbsp;{tokenDataObjects[i].symbol}&nbsp;</Text>
                            <Text><b>Name:</b>&nbsp;{tokenDataObjects[i].name}</Text>
                          </CardBody>
                        </Card>
                    );
                  })}
                </Flex>
              </TabPanel>
              {console.log(nfts)}
            </TabPanels>
          </Tabs>

        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
