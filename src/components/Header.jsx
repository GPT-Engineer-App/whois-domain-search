import { useContext, useState } from 'react';
import { Box, Flex, Heading, Spacer, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, Text } from "@chakra-ui/react";
import { FaShoppingCart, FaUserCircle, FaTools } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
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
        <Menu isOpen={isOpen} onClose={toggleMenu}>
          <MenuButton
            as={IconButton}
            icon={<FaShoppingCart />}
            isRound
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Cart"
            onClick={toggleMenu}
          />
          <MenuList>
            {cartItems.length === 0 ? (
              <MenuItem>No items in cart</MenuItem>
            ) : (
              cartItems.map((item, index) => (
                <MenuItem key={index}>
                  <Flex justify="space-between" width="100%">
                    <Text>{item}</Text>
                    <Text>${13} per year</Text>
                  </Flex>
                </MenuItem>
              ))
            )}
          </MenuList>
        </Menu>
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