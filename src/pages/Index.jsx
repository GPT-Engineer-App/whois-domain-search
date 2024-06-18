import { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Button, Box, Flex, Heading } from "@chakra-ui/react";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [searchedDomain, setSearchedDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchWhoisData = async () => {
    setError(null); // Clear the error message before initiating a new search
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
      setSearchedDomain(domain); // Set the searched domain
    } catch (err) {
      setError(err.message);
      setWhoisData(null); // Ensure whoisData is null on error
      setHasSearched(true);
      setSearchedDomain(domain); // Set the searched domain even on error
    }
  };

  const isDomainAvailable = whoisData === null && !error;

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt="16">
      
      <VStack spacing={4} width="100%">
        <Input
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={fetchWhoisData} colorScheme="blue">Search</Button>
        
        {hasSearched && error && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{searchedDomain}</Text> {/* Use searchedDomain */}
                <Text color="green.500">Available</Text>
              </Box>
              <Button colorScheme="teal">Add to Cart</Button>
            </Flex>
          </Box>
        )}
        {hasSearched && whoisData && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{searchedDomain}</Text> {/* Use searchedDomain */}
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
                <Text fontSize="xl" fontWeight="bold">{searchedDomain}</Text> {/* Use searchedDomain */}
                <Text color="green.500">Available</Text>
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