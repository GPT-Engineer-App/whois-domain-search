import { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Button, Box, Flex, Heading } from "@chakra-ui/react";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [multiWhoisData, setMultiWhoisData] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMultiQueryComplete, setIsMultiQueryComplete] = useState(false);

  const fetchWhoisData = async () => {
    setError(null); // Clear the error message before initiating a new search
    setWhoisData(null);
    setMultiWhoisData([]);
    setHasSearched(false);
    setIsMultiQueryComplete(false);
    try {
      const response = await fetch(`https://who-dat.as93.net/${domain}`);
      if (!response.ok) {
        throw new Error("Failed to fetch WHOIS data");
      }
      const data = await response.json();
      setWhoisData(data);
      setHasSearched(true);

      if (!data.available) {
        const sld = domain.split('.')[0];
        const tlds = ['co', 'ai', 'io', 'org', 'net', 'xyz', 'info'];
        const multiResponses = await Promise.all(tlds.map(tld => fetch(`https://who-dat.as93.net/${sld}.${tld}`)));
        const multiData = await Promise.all(multiResponses.map(res => res.json()));
        setMultiWhoisData(multiData.map((data, index) => ({ ...data, domain: `${sld}.${tlds[index]}` })));
        setIsMultiQueryComplete(true);
      } else {
        setIsMultiQueryComplete(true);
      }
    } catch (err) {
      setError(err.message);
      setWhoisData(null); // Ensure whoisData is null on error
      setHasSearched(true);
      setIsMultiQueryComplete(true);
    }
  };

  const isDomainAvailable = whoisData === null && !error;

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={8}>
      <Box position="fixed" top={0} width="100%" bg="white" zIndex={1} p={4} boxShadow="md">
        <VStack spacing={4} width="100%">
          <Input
            placeholder="Enter domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button onClick={fetchWhoisData} colorScheme="blue">Search</Button>
        </VStack>
      </Box>
      <Box mt={24} width="100%" overflowY="auto" maxHeight="80vh">
        {hasSearched && error && (
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
        {hasSearched && whoisData && isMultiQueryComplete && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{domain}</Text>
                <Text color={whoisData.available ? "green.500" : "red.500"}>{whoisData.available ? "Available" : "Unavailable"}</Text>
              </Box>
              <Button colorScheme="teal">{whoisData.available ? "Add to Cart" : "Try to Purchase This Domain Anyway"}</Button>
            </Flex>
          </Box>
        )}
        {hasSearched && isDomainAvailable && isMultiQueryComplete && (
          <Box p={4} bg="gray.100" borderRadius="md" width="100%">
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold">{domain}</Text>
                <Text color="green.500">Available</Text>
              </Box>
              <Button colorScheme="teal">Add to Cart</Button>
            </Flex>
          </Box>
        )}
        {whoisData && !whoisData.available && multiWhoisData.length > 0 && (
          <Box width="100%">
            <Heading size="md" mb={4}>Try these instead</Heading>
            {multiWhoisData.map((data, index) => (
              <Box key={index} p={4} bg="gray.100" borderRadius="md" mb={4}>
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontSize="xl" fontWeight="bold">{data.domain}</Text>
                    <Text color={data.available ? "green.500" : "red.500"}>{data.available ? "Available" : "Unavailable"}</Text>
                  </Box>
                  <Button colorScheme="teal">{data.available ? "Add to Cart" : "Try to Purchase This Domain Anyway"}</Button>
                </Flex>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Index;