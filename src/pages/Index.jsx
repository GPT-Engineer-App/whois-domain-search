import { useState } from "react";
import { Container, Text, VStack, Input, Button, Box, Code, Heading, Divider, Stack } from "@chakra-ui/react";

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

  const renderWhoisData = (data) => {
    const renderField = (label, value) => (
      <Box mb={2}>
        <Text as="span" fontWeight="bold">{label}: </Text>
        <Text as="span">{value}</Text>
      </Box>
    );

    const renderObject = (obj, parentKey = "") => {
      return Object.keys(obj).map((key) => {
        const value = obj[key];
        const label = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "object" && value !== null) {
          return (
            <Box key={label} ml={4}>
              <Text fontWeight="bold">{label}:</Text>
              {renderObject(value, label)}
            </Box>
          );
        }

        return <Box key={label}>{renderField(label, value)}</Box>;
      });
    };

    return (
      <Box p={4} bg="gray.100" borderRadius="md" width="100%" maxHeight="400px" overflowY="auto" mt={4}>
        <Heading size="md" mb={2}>WHOIS Data:</Heading>
        <Stack spacing={2}>
          {renderObject(data)}
        </Stack>
      </Box>
    );
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">WHOIS Lookup</Text>
        <Input
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={fetchWhoisData} colorScheme="blue">Search</Button>
        {error && <Text color="red.500">{error}</Text>}
        {whoisData && renderWhoisData(whoisData)}
      </VStack>
    </Container>
  );
};

export default Index;