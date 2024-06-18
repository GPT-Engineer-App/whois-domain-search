import { useState } from "react";
import { Container, Text, VStack, Input, Button, Box, Code, Flex, Heading, IconButton } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWhoisData = async () => {
    setError(null);
    setWhoisData(null);
    try {
      const response = await fetch(`https://who-dat.as93.net/${domain}`);
      if (!response.ok) {
        throw new Error("Failed to fetch WHOIS data");
      }
      const data = await response.json();
      setWhoisData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const isDomainAvailable = whoisData === null && !error;

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Flex justifyContent="space-between" width="100%" p={4} bg="gray.100" mb={4}>
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
        {error && <Text color="red.500">{error}</Text>}
        {whoisData && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Text fontSize="lg" mb={2}>Domain Status:</Text>
            <Text fontSize="xl" fontWeight="bold">{domain}</Text>
            <Text color="red.500">Registered and Unavailable</Text>
            <Button colorScheme="teal" mt={4}>Try to Purchase This Domain Anyway</Button>
          </Box>
        )}
        {isDomainAvailable && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Text fontSize="lg" mb={2}>Domain Status:</Text>
            <Text fontSize="xl" fontWeight="bold">{domain}</Text>
            <Text color="green.500">Not Registered and Available</Text>
            <Button colorScheme="teal" mt={4}>Add to Cart</Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;