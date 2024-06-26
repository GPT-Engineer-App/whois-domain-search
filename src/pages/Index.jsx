import { useState, useEffect, useContext } from "react";
import { Container, Text, Input, Button, Box, Flex, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Textarea } from "@chakra-ui/react";
import fetchValidTLDs from '../utils/validTLDs';
import { CartContext } from '../context/CartContext';

const Index = () => {
  const [domain, setDomain] = useState("");
  const [searchedDomain, setSearchedDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [bulkDomains, setBulkDomains] = useState(""); // New state for bulk import domains
  const [bulkResults, setBulkResults] = useState([]); // New state for bulk import results
  const { addToCart } = useContext(CartContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchWhoisData = async () => {
    setError(null);
    setWhoisData(null);
    setHasSearched(false);
    setInvalidUrl(false);

    const validTLDs = await fetchValidTLDs();
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
      setSearchedDomain(domain);
    } catch (err) {
      setError(err.message);
      setWhoisData(null);
      setHasSearched(true);
      setSearchedDomain(domain);
    }
  };

  const validateDomain = async (domain) => {
    const validTLDs = await fetchValidTLDs();
    const domainParts = domain.split('.');
    const tld = `.${domainParts[domainParts.length - 1]}`;
    return validTLDs.includes(tld);
  };

  const fetchBulkWhoisData = async (domains) => {
    const results = [];
    for (const domain of domains) {
      if (!await validateDomain(domain)) {
        results.push({ domain, error: "Invalid URL" });
        continue;
      }
      try {
        const response = await fetch(`https://who-dat.as93.net/${domain}`);
        if (!response.ok) {
          throw new Error("Failed to fetch WHOIS data");
        }
        const data = await response.json();
        results.push({ domain, data });
      } catch (err) {
        results.push({ domain, error: err.message });
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 0.5 seconds
    }
    setBulkResults(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWhoisData();
    }
  };

  const handleAddToCart = () => {
    addToCart({ name: searchedDomain, price: 13 });
  };

  const handleBulkSubmit = () => {
    const domains = bulkDomains.split('\n').map(domain => domain.trim()).filter(domain => domain);
    fetchBulkWhoisData(domains);
    onClose();
  };

  const isDomainAvailable = whoisData === null && !error;

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
      
      <Button onClick={onOpen} colorScheme="blue" mb={4}>Bulk Search</Button>
      
      {bulkResults.length > 0 && (
        <Box width="100%">
          {bulkResults.map((result, index) => (
            <Box key={index} p={4} bg="gray.100" borderRadius="md" width="100%" mb={1} mt={1}>
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontSize="xl" fontWeight="bold">{result.domain}</Text>
                  {result.error ? (
                    <Text color="red.500">{result.error}</Text>
                  ) : (
                    <Text color={result.data ? "red.500" : "green.500"}>
                      {result.data ? "Unavailable" : "Available"}
                    </Text>
                  )}
                </Box>
                {!result.error && !result.data && (
                  <Button colorScheme="teal" onClick={() => addToCart({ name: result.domain, price: 13 })}>Add to Cart</Button>
                )}
              </Flex>
            </Box>
          ))}
        </Box>
      )}
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bulk Import Domains</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter domains, one per line"
              value={bulkDomains}
              onChange={(e) => setBulkDomains(e.target.value)}
              mb={2}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" mr={3} onClick={handleBulkSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {hasSearched && (
        <Text fontSize="2xl" mb={4} textAlign="left" width="100%">Search Results:</Text>
      )}

      {hasSearched && error && (
        <Box p={4} bg="gray.100" borderRadius="md" width="100%">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="xl" fontWeight="bold">{searchedDomain}</Text>
              <Text color="green.500">Available</Text>
            </Box>
            <Button colorScheme="teal" onClick={handleAddToCart}>Add to Cart</Button>
          </Flex>
        </Box>
      )}
      {hasSearched && whoisData && (
        <Box p={4} bg="gray.100" borderRadius="md" width="100%">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="xl" fontWeight="bold">{searchedDomain}</Text>
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
              <Text fontSize="xl" fontWeight="bold">{searchedDomain}</Text>
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