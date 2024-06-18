import { useState } from "react";
import { Container, Text, VStack, Input, Button, Box, Spinner } from "@chakra-ui/react";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [whoisData, setWhoisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWhoisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://who-dat.as93.net/${domain}`);
      if (!response.ok) {
        throw new Error("Failed to fetch WHOIS data");
      }
      const data = await response.json();
      setWhoisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <Button onClick={fetchWhoisData} isDisabled={!domain || loading}>
          {loading ? <Spinner size="sm" /> : "Search"}
        </Button>
        {error && <Text color="red.500">{error}</Text>}
        {whoisData && (
          <Box p={4} borderWidth={1} borderRadius="md" width="100%">
            <pre>{JSON.stringify(whoisData, null, 2)}</pre>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;