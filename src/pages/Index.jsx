import { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Button, Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchWhoisData = async () => {
    setError(null);
    setWhoisData(null);
    setHasSearched(false);
    try {
      const response = await fetch(`https://who-dat.as93.net/${domain}`);
      if (!response.ok) {
        throw new Error("Failed to fetch WHOIS data");
      }
      const data = await response.json();
      setWhoisData(data);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
      setWhoisData(null); // Ensure whoisData is null on error
      setHasSearched(true);
    }
  };

  const isDomainAvailable = whoisData === null && !error;

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt="16">
      <Flex justifyContent="space-between" width="100%" p={4} bg="gray.100" mb={4} position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Heading size="md">Domain Checker</Heading>
        <IconButton icon={<FaShoppingCart />} aria-label="Cart" />
      </Flex>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">WHOIS Lookup</Text>
        <Input
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={fetchWhoisData} colorScheme="blue">Search</Button>
        {error && error !== "Failed to fetch WHOIS data" && <Text color="red.500">{error}</Text>}
        {hasSearched && error && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{domain}</Text>
                <Text color="green.500">Not Registered and Available</Text>
              </Box>
              <Button colorScheme="teal">Add to Cart</Button>
            </Flex>
          </Box>
        )}
        {hasSearched && whoisData && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{domain}</Text>
                <Text color="red.500">Unavailable</Text>
              </Box>
              <Button colorScheme="teal">Try to Purchase This Domain Anyway</Button>
            </Flex>
          </Box>
        )}
        {hasSearched && isDomainAvailable && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{domain}</Text>
                <Text color="green.500">Not Registered and Available</Text>
              </Box>
              <Button colorScheme="teal">Add to Cart</Button>
            </Flex>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;