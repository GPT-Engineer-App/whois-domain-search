import { useState, useEffect, useContext } from "react";
import { Container, Text, Input, Button, Box, Flex, Heading } from "@chakra-ui/react";
import fetchValidTLDs from '../utils/validTLDs';
import { CartContext } from '../context/CartContext';

const Index = () => {
  const [domain, setDomain] = useState("");
  const [searchedDomain, setSearchedDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false); // New state for invalid URL
  const { addToCart } = useContext(CartContext);

  const fetchWhoisData = async () => {
    setError(null); // Clear the error message before initiating a new search
    setWhoisData(null);
    setHasSearched(false);
    setInvalidUrl(false); // Reset invalid URL state

    // Fetch the list of valid TLDs
    const validTLDs = await fetchValidTLDs();

    // Validate the domain TLD
    const domainParts = domain.split('.');
    const tld = `.${domainParts[domainParts.length - 1]}`;
    if (!validTLDs.includes(tld)) {
      setInvalidUrl(true);
      return;
    }

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWhoisData();
    }
  };

  const handleAddToCart = () => {
    addToCart(searchedDomain);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt="16">
      {invalidUrl && (
        <Box bg="red.500" color="white" p={4} mb={4} borderRadius="md" width="100%" textAlign="center">
          Invalid URL - please enter a valid domain name
        </Box>
      )}
      
      <Flex spacing={4} width="100%" mb={4}>
        <Input
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyPress={handleKeyPress}
          flex="1"
          mr={2}
        />
        <Button onClick={fetchWhoisData} colorScheme="blue">Search</Button>
      </Flex>
      
      {hasSearched && (
        <Text fontSize="2xl" mb={4} textAlign="left" width="100%">Search Results:</Text>
      )}

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
            <Button colorScheme="teal" onClick={handleAddToCart}>Add to Cart</Button>
          </Flex>
        </Box>
      )}
    </Container>
  );
};

export default Index;