import { Box, Flex, Heading, Spacer, Link, IconButton } from "@chakra-ui/react";
import { FaShoppingCart, FaUserCircle, FaTools } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex align="center">
        <Heading size="md">
          <Link as={RouterLink} to="/" color="white" _hover={{ textDecoration: 'none' }}>
            Registrar
          </Link>
        </Heading>
        <Spacer />
        <Link as={RouterLink} to="/tools" mx={2}>
          <IconButton
            icon={<FaTools />}
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Tools"
          />
        </Link>
        <Link as={RouterLink} to="/cart" mx={2}>
          <IconButton
            icon={<FaShoppingCart />}
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Cart"
          />
        </Link>
        <Link as={RouterLink} to="/profile" mx={2}>
          <IconButton
            icon={<FaUserCircle />}
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Profile"
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Header;