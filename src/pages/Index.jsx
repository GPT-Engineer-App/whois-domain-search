import { useState, useEffect, useContext } from "react";
import { Container, Text, Input, Button, Box, Flex, Heading, Textarea } from "@chakra-ui/react";
import fetchValidTLDs from '../utils/validTLDs';
import { CartContext } from '../context/CartContext';

const Index = () => {
  const [domain, setDomain] = useState("");
  const [searchedDomain, setSearchedDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [bulkImport, setBulkImport] = useState(false);
  const [bulkDomains, setBulkDomains] = useState("");
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkError, setBulkError] = useState(null);
  const { addToCart } = useContext(CartContext);

  const fetchWhoisData = async () => {
    setError(null);
    setWhoisData(null);
    setHasSearched(false);
    setInvalidUrl(false);

    try {
      const validTLDs = await fetchValidTLDs();
      const domainParts = domain.split('.');
      const tld = `.${domainParts[domainParts.length - 1]}`;
      if (!validTLDs.includes(tld)) {
        setInvalidUrl(true);
        return;
      }

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

  const fetchBulkWhoisData = async () => {
    setBulkError(null);
    setBulkResults([]);
    const domains = bulkDomains.split('\n').filter(domain => domain.trim() !== '');
    if (domains.length === 0) {
      setBulkError("Please add domains to the list.");
      return;
    }
    try {
      const results = [];
      const validTLDs = await fetchValidTLDs();
      for (const domain of domains) {
        const domainParts = domain.split('.');
        const tld = `.${domainParts[domainParts.length - 1]}`;
        if (!validTLDs.includes(tld)) {
          results.push({ domain, available: true });
          continue;
        }
        const response = await fetch(`https://who-dat.as93.net/${domain}`);
        if (!response.ok) {
          results.push({ domain, available: true });
          continue;
        }
        const data = await response.json();
        results.push(data);
      }
      setBulkResults(results);
    } catch (err) {
      setBulkError(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWhoisData();
    }
  };

  const handleAddToCart = () => {
    addToCart({ name: searchedDomain, price: 13 });
  };

  const handleBulkImport = () => {
    setBulkImport(true);
  };

  const handleBulkSubmit = () => {
    fetchBulkWhoisData();
  };

  const handleBulkCancel = () => {
    setBulkImport(false);
    setBulkDomains("");
    setBulkResults([]);
    setBulkError(null);
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
      
      <Button onClick={handleBulkImport} colorScheme="blue" mb={4}>Bulk Import</Button>

      {bulkImport && (
        <Box width="100%" mb={4}>
          <Textarea
            placeholder="Add 1 domain per line, up to 10 domains"
            value={bulkDomains}
            onChange={(e) => setBulkDomains(e.target.value)}
            rows={10}
          />
          <Flex justifyContent="space-between" mt={2}>
            <Button onClick={handleBulkSubmit} colorScheme="blue">Submit</Button>
            <Button onClick={handleBulkCancel} colorScheme="red">Cancel</Button>
          </Flex>
          {bulkError && (
            <Box bg="red.500" color="white" p={4} mt={4} borderRadius="md" width="100%" textAlign="center">
              {bulkError}
            </Box>
          )}
          {bulkResults.length > 0 && (
            <Box mt={4} width="100%">
              {bulkResults.map((result, index) => (
                <Box key={index} p={4} bg="gray.100" borderRadius="md" mb={2}>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <Text fontSize="xl" fontWeight="bold">{result.domain}</Text>
                      <Text color={result.available ? "green.500" : "red.500"}>
                        {result.available ? "Available" : "Unavailable"}
                      </Text>
                    </Box>
                    {result.available && (
                      <Button colorScheme="teal" onClick={() => addToCart({ name: result.domain, price: 13 })}>Add to Cart</Button>
                    )}
                  </Flex>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

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